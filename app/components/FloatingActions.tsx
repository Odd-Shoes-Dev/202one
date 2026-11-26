'use client'

import Link from 'next/link'
import { useActionState, useRef, useState } from 'react'
import { submitFeedback, type FeedbackState } from '@/app/actions/feedback'
import styles from './FloatingActions.module.css'

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

export default function FloatingActions() {
  const dialog = useRef<HTMLDialogElement>(null)
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  function openFeedback() {
    setSubmissionId(crypto.randomUUID())
    dialog.current?.showModal()
  }

  return (
    <>
      <div className={styles.actions} role="group" aria-label="Quick actions">
        <Link className={styles.booking} href="/book#booking-flow" aria-label="Book the Studio">
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M7 3v4m10-4v4M3 10h18m-12 5 2 2 4-4" />
          </svg>
          <span className={styles.actionLabel} aria-hidden="true">Book the Studio</span>
        </Link>
        <button
          className={styles.feedback}
          type="button"
          aria-label="Feedback"
          aria-haspopup="dialog"
          aria-controls="feedback-dialog"
          onClick={openFeedback}
        >
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 11.5a8 8 0 0 1-8 8h-2l-6 2 1.5-4.5A8 8 0 1 1 21 11.5Z" />
            <path d="M8.5 10h7m-7 4h5" />
          </svg>
          <span className={styles.actionLabel} aria-hidden="true">Feedback</span>
        </button>
      </div>
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
