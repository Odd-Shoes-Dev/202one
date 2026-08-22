import { requireAdmin } from '@/app/actions/auth'
import { db } from '@/lib/adapters/db'
import styles from '../admin.module.css'

function badge(status: string) {
  return <span className={`${styles.badge} ${styles[`badge-${status}`]}`}>{status}</span>
}

function fmt(d: Date | string) {
  return new Date(d).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' })
}
function fmtTime(d: Date | string) {
  return new Date(d).toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' })
}

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin()
  const params = await searchParams
  const statusFilter = params.status && params.status !== 'all' ? params.status : undefined

  const bookings = await db.listBookings(statusFilter ? { status: statusFilter as 'pending' | 'confirmed' | 'completed' | 'cancelled' } : undefined)

  return (
    <div>
      <div className={styles.pageHeader}>
        <span className={styles.pageEyebrow}>MANAGE</span>
        <h1 className={styles.pageTitle}>Bookings</h1>
        <p className={styles.pageSub}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} {statusFilter ? `· ${statusFilter}` : '· all'}</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: '1px solid var(--concrete-line)' }}>
        {STATUS_FILTERS.map(s => (
          <a
            key={s}
            href={`/admin/bookings?status=${s}`}
            style={{
              padding: '10px 18px',
              fontSize: 12,
              letterSpacing: '0.08em',
              fontWeight: 600,
              color: (params.status ?? 'all') === s ? 'var(--gold-bright)' : 'var(--concrete)',
              borderBottom: (params.status ?? 'all') === s ? '2px solid var(--gold-bright)' : '2px solid transparent',
              marginBottom: -1,
              textTransform: 'capitalize',
            }}
          >
            {s}
          </a>
        ))}
      </div>

      {bookings.length === 0 ? (
        <p style={{ color: 'var(--concrete)', fontSize: 14 }}>No bookings found.</p>
      ) : (
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
                <th>Deposit</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td style={{ color: 'var(--sand)' }}>
                    <div>{b.artist_name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--concrete)', marginTop: 2 }}>{b.email}</div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{b.type}</td>
                  <td>{fmt(b.starts_at)}</td>
                  <td>{fmtTime(b.starts_at)}</td>
                  <td>{b.duration_hours}h</td>
                  <td style={{ color: 'var(--sand)' }}>UGX {Number(b.total_amount).toLocaleString()}</td>
                  <td>{b.deposit_paid ? <span style={{ color: '#6BAE75', fontSize: 12 }}>Paid</span> : <span style={{ color: 'var(--concrete)', fontSize: 12 }}>Pending</span>}</td>
                  <td>{badge(b.status)}</td>
                  <td><a href={`/admin/bookings/${b.id}`} style={{ color: 'var(--gold-bright)', fontSize: 12, whiteSpace: 'nowrap' }}>View →</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
