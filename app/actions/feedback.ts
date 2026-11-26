'use server'

import { db } from '@/lib/adapters/db'

export type FeedbackState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

export async function submitFeedback(_previous: FeedbackState, data: FormData): Promise<FeedbackState> {
  const id = data.get('submissionId')
  const rawMessage = data.get('message')
  const message = typeof rawMessage === 'string' ? rawMessage.trim() : ''

  if (!message || message.length > 2000) {
    return { status: 'error', message: 'Enter feedback between 1 and 2,000 characters.' }
  }

  if (typeof id !== 'string' || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) {
    return { status: 'error', message: 'Close and reopen the form, then try again.' }
  }

  try {
    await db.saveFeedback(id, message)
    return { status: 'success', message: 'Thank you. Your feedback was sent to 202One Studio.' }
  } catch (error) {
    console.error('[submitFeedback] Unable to save feedback', error instanceof Error ? error.name : '')
    return { status: 'error', message: 'Your feedback could not be sent. Please try again later.' }
  }
}
