import { requireAdmin } from '@/app/actions/auth'
import { db } from '@/lib/adapters/db'
import type { StudioFeedback } from '@/lib/types'
import styles from '../admin.module.css'

export const metadata = { title: 'Feedback | 202One Studio Admin' }

const dateFormat = new Intl.DateTimeFormat('en-UG', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Africa/Kampala',
})

export default async function FeedbackPage() {
  await requireAdmin()

  let feedback: StudioFeedback[] | null
  try {
    feedback = await db.listFeedback()
  } catch {
    feedback = null
  }

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Studio feedback</h1>
        <p className={styles.pageSub}>Recent feedback from site visitors.</p>
      </div>
      {feedback === null ? (
        <p>Feedback is unavailable. Check the database connection and feedback migration.</p>
      ) : feedback.length === 0 ? (
        <p>No feedback has been submitted yet.</p>
      ) : (
        <ul className={styles.feedbackList}>
          {feedback.map(({ id, message, created_at }) => (
            <li key={id}>
              <time dateTime={created_at}>{dateFormat.format(new Date(created_at))}</time>
              <p>{message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
