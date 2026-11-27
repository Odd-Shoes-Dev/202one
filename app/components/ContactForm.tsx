'use client'

import { useActionState, useRef, useState } from 'react'
import { submitEnquiry } from '@/app/actions/enquiry'
import type { FeedbackState } from '@/app/actions/feedback'
import type { QuoteOptions } from '@/lib/studio-quote'
import styles from './ContactForm.module.css'

type Booking = { quote: QuoteOptions; date: string; start: number }

const initialState: FeedbackState = { status: 'idle', message: '' }

export default function ContactForm({ booking }: { booking?: Booking }) {
  const submissionId = useRef<string | null>(null)
  const [subject, setSubject] = useState('Studio booking')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const [state, action, pending] = useActionState(async (previous: FeedbackState, data: FormData) => {
    submissionId.current ??= crypto.randomUUID()
    data.set('submissionId', submissionId.current)
    if (booking) {
      data.set('kind', 'booking')
      data.set('tier', booking.quote.tier)
      data.set('hours', String(booking.quote.hours))
      data.set('extras', booking.quote.extras.join(','))
      data.set('date', booking.date)
      data.set('start', String(booking.start))
    }
    return submitEnquiry(previous, data)
  }, initialState)

  if (state.status === 'success') {
    return <p className={styles.status} role="status">{state.message}</p>
  }

  return (
    <form className={styles.form} action={action}>
      <h3>{booking ? 'Request your booking' : 'Send a studio enquiry'}</h3>
      <p>{booking ? 'Share your contact details so we can confirm availability and arrange payment.' : 'Tell us what you’re planning. We’ll reply to the email you provide.'}</p>
      {!booking && (
        <label>
          <span>What can we help with?</span>
          <select name="subject" value={subject} onChange={(event) => setSubject(event.target.value)}>
            <option>Studio booking</option>
            <option>Student project</option>
            <option>Creative services</option>
            <option>Studio visit</option>
          </select>
        </label>
      )}
      <label>
        <span>Your name</span>
        <input name="name" autoComplete="name" required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        <span>Reply email</span>
        <input name="email" type="email" autoComplete="email" required maxLength={200} value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>
        <span>{booking ? 'Project notes (optional)' : 'Message'}</span>
        <textarea name="message" rows={4} required={!booking} maxLength={1000} value={message} onChange={(event) => setMessage(event.target.value)} />
      </label>
      {state.status === 'error' && <p className={styles.error} role="alert">{state.message}</p>}
      <button type="submit" disabled={pending}>{pending ? 'Sending…' : booking ? 'Send booking request' : 'Send enquiry'}</button>
    </form>
  )
}
