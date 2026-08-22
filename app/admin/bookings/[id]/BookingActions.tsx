'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Booking } from '@/lib/types'

async function updateStatus(id: string, status: string, adminNotes?: string) {
  const res = await fetch(`/api/admin/bookings/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, adminNotes }),
  })
  return res.json()
}

async function updatePayment(id: string, field: 'deposit' | 'full') {
  const res = await fetch(`/api/admin/bookings/${id}/payment`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ field }),
  })
  return res.json()
}

export default function BookingActions({ booking }: { booking: Booking }) {
  const [adminNotes, setAdminNotes] = useState(booking.admin_notes ?? '')
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function handle(action: string, status?: string) {
    setLoading(action)
    if (status) {
      await updateStatus(booking.id, status, adminNotes || undefined)
    } else if (action === 'deposit') {
      await updatePayment(booking.id, 'deposit')
    } else if (action === 'full') {
      await updatePayment(booking.id, 'full')
    }
    setLoading(null)
    router.refresh()
  }

  const btnStyle = (color: string, bg = 'transparent') => ({
    background: bg,
    border: `1px solid ${color}`,
    color: bg !== 'transparent' ? 'var(--black)' : color,
    padding: '12px 22px',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    fontFamily: 'var(--sans)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    opacity: loading ? 0.6 : 1,
  })

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--gold)', fontWeight: 600, marginBottom: 8 }}>ADMIN NOTES</div>
        <textarea
          value={adminNotes}
          onChange={e => setAdminNotes(e.target.value)}
          placeholder="Add internal notes..."
          rows={3}
          style={{ width: '100%', background: 'var(--black-soft)', border: '1px solid var(--concrete-line)', color: 'var(--sand)', fontFamily: 'var(--sans)', fontSize: 14, padding: '12px 14px', outline: 'none', resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {booking.status === 'pending' && (
          <button style={btnStyle('var(--gold-bright)', 'var(--gold-bright)')} disabled={!!loading} onClick={() => handle('confirm', 'confirmed')}>
            {loading === 'confirm' ? '...' : 'Confirm booking'}
          </button>
        )}
        {(booking.status === 'pending' || booking.status === 'confirmed') && (
          <button style={btnStyle('var(--copper)')} disabled={!!loading} onClick={() => handle('cancel', 'cancelled')}>
            {loading === 'cancel' ? '...' : 'Cancel booking'}
          </button>
        )}
        {booking.status === 'confirmed' && (
          <button style={btnStyle('var(--concrete)')} disabled={!!loading} onClick={() => handle('complete', 'completed')}>
            {loading === 'complete' ? '...' : 'Mark completed'}
          </button>
        )}
        {!booking.deposit_paid && (
          <button style={btnStyle('var(--sand-dim)')} disabled={!!loading} onClick={() => handle('deposit')}>
            {loading === 'deposit' ? '...' : 'Mark deposit paid'}
          </button>
        )}
        {booking.deposit_paid && !booking.full_paid && (
          <button style={btnStyle('var(--sand-dim)')} disabled={!!loading} onClick={() => handle('full')}>
            {loading === 'full' ? '...' : 'Mark fully paid'}
          </button>
        )}
      </div>
    </div>
  )
}
