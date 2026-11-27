import { requireAdmin } from '@/app/actions/auth'
import { db } from '@/lib/adapters/db'
import type { StudioFeedback } from '@/lib/types'
import styles from '../admin.module.css'

export const metadata = { title: 'Enquiries & feedback | 202One Studio Admin' }

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
        <h1 className={styles.pageTitle}>Enquiries & feedback</h1>
        <p className={styles.pageSub}>Booking requests, studio enquiries, and feedback from site visitors.</p>
      </div>
      {feedback === null ? (
        <p>The studio inbox is unavailable. Check the database connection and feedback migration.</p>
      ) : feedback.length === 0 ? (
        <p>No enquiries or feedback have been submitted yet.</p>
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
