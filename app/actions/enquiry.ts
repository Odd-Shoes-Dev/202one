'use server'

import { db } from '@/lib/adapters/db'
import { availableSlot, studioTime } from '@/lib/demo-reservations'
import { quoteLines, readQuote, ugx } from '@/lib/studio-quote'
import type { FeedbackState } from './feedback'

const subjects = ['Studio booking', 'Student project', 'Creative services', 'Studio visit'] as const

export async function submitEnquiry(_previous: FeedbackState, data: FormData): Promise<FeedbackState> {
  const id = data.get('submissionId')
  const name = String(data.get('name') ?? '').trim()
  const email = String(data.get('email') ?? '').trim()
  const notes = String(data.get('message') ?? '').trim()
  const subject = subjects.find((item) => item === data.get('subject'))
  const booking = data.get('kind') === 'booking'

  if (typeof id !== 'string' || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) {
    return { status: 'error', message: 'Refresh the page and try again.' }
  }
  if (!name || name.length > 100 || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: 'Enter your name and a valid reply email.' }
  }
  if (notes.length > 1000 || (!booking && (!subject || !notes))) {
    return { status: 'error', message: 'Choose a topic and enter a message of up to 1,000 characters.' }
  }

  const details = [
    booking ? 'Booking enquiry' : `Studio enquiry · ${subject}`,
    `Name: ${name.replace(/\s+/g, ' ')}`,
    `Reply to: ${email}`,
  ]

  if (booking) {
    const tier = String(data.get('tier') ?? '')
    const hours = String(data.get('hours') ?? '')
    const quote = readQuote({ tier, hours, extras: String(data.get('extras') ?? '') })
    const lines = quoteLines(quote)
    const date = String(data.get('date') ?? '')
    const start = Number(data.get('start'))
    const slot = { date, start, hours: quote.hours, resource: quote.tier === 'services' ? 'services' as const : 'studio' as const }
    if (tier !== quote.tier || Number(hours) !== quote.hours || !lines.length || !availableSlot(slot, [])) {
      return { status: 'error', message: 'Go back and choose a valid package, date, and time.' }
    }
    details.push(
      `Preferred time: ${date} · ${studioTime(start)}–${studioTime(start + quote.hours)} EAT`,
      ...lines.map(({ title, amount }) => `${title} · ${ugx(amount)}`),
      `Estimated total: ${ugx(lines.reduce((sum, line) => sum + line.amount, 0))}`,
    )
  }

  if (notes) details.push('', notes)
  const message = details.join('\n')
  if (message.length > 2000) {
    return { status: 'error', message: 'Shorten your project notes and try again.' }
  }

  try {
    await db.saveFeedback(id, message)
    return {
      status: 'success',
      message: booking
        ? 'Your booking request was sent. The studio will reply by email to confirm availability.'
        : 'Your enquiry was sent. The studio will reply by email.',
    }
  } catch (error) {
    console.error('[submitEnquiry] Unable to save enquiry', error instanceof Error ? error.name : '')
    return { status: 'error', message: 'Your enquiry could not be sent. Please try again.' }
  }
}
