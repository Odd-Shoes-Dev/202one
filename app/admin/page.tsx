import { requireAdmin } from '@/app/actions/auth'
import { db } from '@/lib/adapters/db'
import styles from './admin.module.css'

function badge(status: string) {
  return <span className={`${styles.badge} ${styles[`badge-${status}`]}`}>{status}</span>
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('en-UG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function formatTime(d: Date | string) {
  return new Date(d).toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' })
}

export default async function AdminDashboard() {
  await requireAdmin()

  const [allBookings] = await Promise.all([
    db.listBookings(),
  ])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayBookings = allBookings.filter(b => {
    const d = new Date(b.starts_at)
    return d >= today && d < tomorrow
  })

  const pending = allBookings.filter(b => b.status === 'pending')
  const confirmed = allBookings.filter(b => b.status === 'confirmed')
  const total = allBookings.length

  return (
    <div>
      <div className={styles.pageHeader}>
        <span className={styles.pageEyebrow}>OVERVIEW</span>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSub}>
          {new Date().toLocaleDateString('en-UG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>TODAY</div>
          <div className={styles.statValue}>{todayBookings.length}</div>
          <div className={styles.statSub}>booking{todayBookings.length !== 1 ? 's' : ''}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>PENDING</div>
          <div className={styles.statValue}>{pending.length}</div>
          <div className={styles.statSub}>awaiting confirmation</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>CONFIRMED</div>
          <div className={styles.statValue}>{confirmed.length}</div>
          <div className={styles.statSub}>upcoming</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>ALL TIME</div>
          <div className={styles.statValue}>{total}</div>
          <div className={styles.statSub}>total bookings</div>
        </div>
      </div>

      {/* Pending — needs action */}
      {pending.length > 0 && (
        <div className={styles.sectionBlock}>
          <div className={styles.sectionBlockTitle}>NEEDS ACTION — PENDING</div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Artist</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pending.map(b => (
                  <tr key={b.id}>
                    <td style={{ color: 'var(--sand)' }}>
                      <div>{b.artist_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--concrete)', marginTop: 2 }}>{b.email}</div>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{b.type}</td>
                    <td>{formatDate(b.starts_at)}</td>
                    <td>{formatTime(b.starts_at)}</td>
                    <td>{b.duration_hours}h</td>
                    <td>UGX {Number(b.total_amount).toLocaleString()}</td>
                    <td>{badge(b.status)}</td>
                    <td><a href={`/admin/bookings/${b.id}`} style={{ color: 'var(--gold-bright)', fontSize: 12 }}>View →</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Today's bookings */}
      <div className={styles.sectionBlock}>
        <div className={styles.sectionBlockTitle}>TODAY&apos;S BOOKINGS</div>
        {todayBookings.length === 0 ? (
          <p style={{ color: 'var(--concrete)', fontSize: 14 }}>No bookings today.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Artist</th>
                  <th>Type</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {todayBookings.map(b => (
                  <tr key={b.id}>
                    <td style={{ color: 'var(--sand)' }}>{b.artist_name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{b.type}</td>
                    <td>{formatTime(b.starts_at)} – {formatTime(b.ends_at)}</td>
                    <td>{b.duration_hours}h</td>
                    <td>{badge(b.status)}</td>
                    <td><a href={`/admin/bookings/${b.id}`} style={{ color: 'var(--gold-bright)', fontSize: 12 }}>View →</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <a href="/admin/bookings" style={{ fontSize: 13, color: 'var(--gold-bright)', borderBottom: '1px solid var(--gold)', paddingBottom: 2 }}>All bookings →</a>
        <a href="/admin/pricing" style={{ fontSize: 13, color: 'var(--sand-dim)', borderBottom: '1px solid var(--concrete-line)', paddingBottom: 2 }}>Manage pricing →</a>
        <a href="/admin/content" style={{ fontSize: 13, color: 'var(--sand-dim)', borderBottom: '1px solid var(--concrete-line)', paddingBottom: 2 }}>Edit content →</a>
      </div>
    </div>
  )
}
