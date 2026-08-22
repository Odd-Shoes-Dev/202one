'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Promotion } from '@/lib/types'
import formStyles from './pricing.module.css'
import styles from '../admin.module.css'

const empty = { name: '', description: '', discount_type: 'percentage' as const, discount_value: 10, badge_label: '', ends_at: '' }

export default function PromotionsEditor({ promotions }: { promotions: Promotion[] }) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  function set(field: string, value: string | number) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function create() {
    setLoading('create')
    await fetch('/api/admin/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, ends_at: form.ends_at || undefined }),
    })
    setLoading(null)
    setAdding(false)
    setForm(empty)
    router.refresh()
  }

  async function deactivate(id: number) {
    setLoading(String(id))
    await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' })
    setLoading(null)
    router.refresh()
  }

  const active = promotions.filter(p => p.is_active)
  const inactive = promotions.filter(p => !p.is_active)

  return (
    <div>
      {/* Active promotions */}
      {active.length === 0 && !adding && (
        <p style={{ fontSize: 14, color: 'var(--concrete)', marginBottom: 20 }}>No active promotions.</p>
      )}

      {active.map(p => (
        <div key={p.id} style={{ border: '1px solid var(--gold)', padding: '20px 24px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontWeight: 600, color: 'var(--sand)', fontSize: 15 }}>{p.name}</span>
              <span className={`${styles.badge} ${styles['badge-confirmed']}`}>ACTIVE</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--gold-bright)', marginBottom: 4 }}>
              {p.discount_type === 'percentage' ? `${p.discount_value}% off` : `UGX ${Number(p.discount_value).toLocaleString()} off`}
              {p.applies_to ? ` · ${p.applies_to.join(', ')}` : ' · all tiers'}
            </div>
            {p.badge_label && <div style={{ fontSize: 12, color: 'var(--concrete)' }}>Badge: "{p.badge_label}"</div>}
            {p.ends_at && <div style={{ fontSize: 12, color: 'var(--concrete)', marginTop: 4 }}>Expires: {new Date(p.ends_at).toLocaleDateString()}</div>}
          </div>
          <button onClick={() => deactivate(p.id)} disabled={loading === String(p.id)} style={{ background: 'none', border: '1px solid var(--copper)', color: 'var(--copper)', padding: '7px 14px', fontSize: 12, fontFamily: 'var(--sans)', cursor: 'pointer', flexShrink: 0 }}>
            {loading === String(p.id) ? '...' : 'Deactivate'}
          </button>
        </div>
      ))}

      {/* Add new */}
      {adding ? (
        <div style={{ border: '1px solid var(--concrete-line)', padding: '28px 28px' }}>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', color: 'var(--gold)', fontWeight: 600, marginBottom: 20 }}>NEW PROMOTION</div>
          <div className={formStyles.fields}>
            <div className={formStyles.field}>
              <label className={formStyles.label}>Name</label>
              <input className={formStyles.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Student Discount" />
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label}>Badge label (shown on landing page)</label>
              <input className={formStyles.input} value={form.badge_label} onChange={e => set('badge_label', e.target.value)} placeholder="e.g. STUDENT DISCOUNT — OCT ONLY" />
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label}>Discount type</label>
              <select className={formStyles.input} value={form.discount_type} onChange={e => set('discount_type', e.target.value)}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed amount (UGX)</option>
              </select>
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label}>{form.discount_type === 'percentage' ? 'Percentage (%)' : 'Amount (UGX)'}</label>
              <input className={formStyles.input} type="number" value={form.discount_value} onChange={e => set('discount_value', parseInt(e.target.value))} />
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label}>Expires on (leave blank for no expiry)</label>
              <input className={formStyles.input} type="date" value={form.ends_at} onChange={e => set('ends_at', e.target.value)} />
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label}>Description (optional)</label>
              <input className={formStyles.input} value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className={formStyles.btnSave} disabled={!form.name || !!loading} onClick={create}>
              {loading === 'create' ? 'Creating...' : 'Create promotion'}
            </button>
            <button className={formStyles.btnCancel} onClick={() => { setAdding(false); setForm(empty) }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{ background: 'none', border: '1px dashed var(--concrete-line)', color: 'var(--sand-dim)', padding: '12px 22px', fontSize: 12, fontFamily: 'var(--sans)', cursor: 'pointer', letterSpacing: '0.08em', marginTop: 8 }}>
          + Add promotion
        </button>
      )}

      {/* Past promotions */}
      {inactive.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--concrete)', fontWeight: 600, marginBottom: 12 }}>PAST PROMOTIONS</div>
          {inactive.map(p => (
            <div key={p.id} style={{ padding: '12px 0', borderTop: '1px solid var(--concrete-line)', display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--concrete)' }}>
              <span>{p.name} — {p.discount_type === 'percentage' ? `${p.discount_value}%` : `UGX ${Number(p.discount_value).toLocaleString()}`} off</span>
              <span>{new Date(p.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
