import { requireAdmin } from '@/app/actions/auth'
import { db } from '@/lib/adapters/db'
import { notFound } from 'next/navigation'
import BookingActions from './BookingActions'
import styles from '../../admin.module.css'

function badge(status: string) {
  return <span className={`${styles.badge} ${styles[`badge-${status}`]}`}>{status}</span>
}

function fmt(d: Date | string) {
  return new Date(d).toLocaleDateString('en-UG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
function fmtTime(d: Date | string) {
  return new Date(d).toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' })
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const booking = await db.getBooking(id)
  if (!booking) notFound()

  return (
    <div style={{ maxWidth: 720 }}>
      <div className={styles.pageHeader}>
        <span className={styles.pageEyebrow}><a href="/admin/bookings" style={{ color: 'var(--concrete)' }}>BOOKINGS</a> / DETAIL</span>
        <h1 className={styles.pageTitle}>{booking.artist_name}</h1>
        <div style={{ marginTop: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
          {badge(booking.status)}
          <span style={{ fontSize: 12, color: 'var(--concrete)' }}>{booking.id}</span>
        </div>
      </div>

      {/* Details */}
      <div style={{ border: '1px solid var(--concrete-line)', marginBottom: 32 }}>
        {[
          { label: 'SESSION TYPE',   value: booking.type.charAt(0).toUpperCase() + booking.type.slice(1) },
          { label: 'EMAIL',          value: booking.email },
          { label: 'PHONE',          value: booking.phone ?? '—' },
          { label: 'DATE',           value: fmt(booking.starts_at) },
          { label: 'TIME',           value: `${fmtTime(booking.starts_at)} – ${fmtTime(booking.ends_at)}` },
          { label: 'DURATION',       value: `${booking.duration_hours} hours` },
          { label: 'RATE',           value: `UGX ${Number(booking.rate_per_hour).toLocaleString()} / hr` },
          { label: 'TOTAL',          value: `UGX ${Number(booking.total_amount).toLocaleString()}` },
          { label: 'DEPOSIT',        value: `UGX ${Number(booking.deposit_amount).toLocaleString()} — ${booking.deposit_paid ? 'PAID' : 'NOT YET PAID'}` },
          { label: 'FULL PAYMENT',   value: booking.full_paid ? 'PAID' : 'NOT YET PAID' },
          { label: 'PAYMENT REF',    value: booking.payment_ref ?? '—' },
          { label: 'NOTES',          value: booking.notes ?? '—' },
          { label: 'ADMIN NOTES',    value: booking.admin_notes ?? '—' },
          { label: 'BOOKED ON',      value: fmt(booking.created_at) },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', padding: '16px 24px', borderBottom: '1px solid var(--concrete-line)' }}>
            <div style={{ width: 160, flexShrink: 0, fontSize: 11, letterSpacing: '0.12em', color: 'var(--gold)', fontWeight: 600 }}>{row.label}</div>
            <div style={{ fontSize: 14, color: 'var(--sand-dim)' }}>{row.value}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <BookingActions booking={booking} />
    </div>
  )
}
