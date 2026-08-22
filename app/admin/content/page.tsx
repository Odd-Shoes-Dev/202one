import { requireAdmin } from '@/app/actions/auth'
import { db } from '@/lib/adapters/db'
import styles from '../admin.module.css'
import EventsEditor from './EventsEditor'
import SessionsEditor from './SessionsEditor'

export default async function ContentPage() {
  await requireAdmin()
  const [events, sessions] = await Promise.all([
    db.listAllEvents(),
    db.listAllSessions(),
  ])

  return (
    <div>
      <div className={styles.pageHeader}>
        <span className={styles.pageEyebrow}>MANAGE</span>
        <h1 className={styles.pageTitle}>Content</h1>
        <p className={styles.pageSub}>Control what appears on the landing page.</p>
      </div>

      <div className={styles.sectionBlock}>
        <div className={styles.sectionBlockTitle}>202ONE SESSIONS — FEATURED</div>
        <SessionsEditor sessions={sessions} />
      </div>

      <div className={styles.sectionBlock}>
        <div className={styles.sectionBlockTitle}>COMMUNITY EVENTS</div>
        <EventsEditor events={events} />
      </div>
    </div>
  )
}
