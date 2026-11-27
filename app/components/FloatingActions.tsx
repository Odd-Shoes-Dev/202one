'use client'

import { CalendarCheck, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useActionState, useRef, useState } from 'react'
import { submitFeedback, type FeedbackState } from '@/app/actions/feedback'
import styles from './FloatingActions.module.css'
import site from './Site.module.css'

const initialState: FeedbackState = { status: 'idle', message: '' }

function FeedbackForm({ submissionId }: { submissionId: string }) {
  const [state, action, pending] = useActionState(submitFeedback, initialState)
  const [message, setMessage] = useState('')

  if (state.status === 'success') {
    return <p className={styles.status} role="status">{state.message}</p>
  }

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="submissionId" value={submissionId} />
      <label htmlFor="feedback-message">Your feedback</label>
      <textarea
        id="feedback-message"
        name="message"
        rows={5}
        required
        maxLength={2000}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      {state.status === 'error' && <p className={styles.error} role="alert">{state.message}</p>}
      <button className={styles.booking} type="submit" disabled={pending || !message.trim()}>
        {pending ? 'Sending…' : 'Send feedback'}
      </button>
    </form>
  )
}

export function FeedbackButton() {
  const dialog = useRef<HTMLDialogElement>(null)
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  function openFeedback() {
    setSubmissionId(crypto.randomUUID())
    dialog.current?.showModal()
  }

  return (
    <>
      <button
        className={`${styles.feedback} ${site.iconLabel}`}
        type="button"
        aria-haspopup="dialog"
        aria-controls="feedback-dialog"
        onClick={openFeedback}
      >
        <MessageSquare aria-hidden="true" /> Feedback
      </button>
      <dialog
        ref={dialog}
        id="feedback-dialog"
        className={styles.dialog}
        aria-labelledby="feedback-heading"
        onClose={() => setSubmissionId(null)}
      >
        <div className={styles.heading}>
          <h2 id="feedback-heading">Share feedback</h2>
          <button type="button" className={styles.close} onClick={() => dialog.current?.close()}>Close</button>
        </div>
        <p className={styles.intro}>Tell us what worked or what we could improve.</p>
        {submissionId && <FeedbackForm submissionId={submissionId} />}
      </dialog>
    </>
  )
}

export default function FloatingActions() {
  const pathname = usePathname()
  if (pathname === '/book' || pathname.startsWith('/book/') || pathname === '/pricing') return null

  return (
    <div className={styles.actions} role="group" aria-label="Booking shortcut">
      <Link className={styles.booking} href="/book#booking-flow" aria-label="Book the Studio">
        <CalendarCheck className={styles.icon} strokeWidth={1.8} aria-hidden="true" />
        <span className={styles.actionLabel} aria-hidden="true">Book the Studio</span>
      </Link>
    </div>
  )
}
