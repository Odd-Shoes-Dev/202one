'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PricingTier } from '@/lib/types'
import formStyles from './pricing.module.css'
import styles from '../admin.module.css'

export default function PricingEditor({ pricing }: { pricing: PricingTier[] }) {
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, Partial<PricingTier>>>({})
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  function startEdit(tier: PricingTier) {
    setEditing(tier.tier)
    setForm(f => ({ ...f, [tier.tier]: { rate: tier.rate, note: tier.note ?? '', tagline: tier.tagline, description: tier.description } }))
  }

  function setField(tier: string, field: string, value: string | number) {
    setForm(f => ({ ...f, [tier]: { ...f[tier], [field]: value } }))
  }

  async function save(tier: string) {
    setLoading(tier)
    await fetch(`/api/admin/pricing/${tier}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form[tier]),
    })
    setLoading(null)
    setEditing(null)
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--concrete-line)', border: '1px solid var(--concrete-line)' }}>
      {pricing.map(p => (
        <div key={p.tier} style={{ background: 'var(--black-soft)', padding: '28px 32px' }}>
          {editing === p.tier ? (
            <div className={formStyles.editForm}>
              <div className={formStyles.editHeader}>
                <span className={formStyles.tierLabel}>{p.label}</span>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className={formStyles.btnSave} disabled={!!loading} onClick={() => save(p.tier)}>
                    {loading === p.tier ? 'Saving...' : 'Save changes'}
                  </button>
                  <button className={formStyles.btnCancel} onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </div>
              <div className={formStyles.fields}>
                <div className={formStyles.field}>
                  <label className={formStyles.label}>Rate (UGX / hour)</label>
                  <input className={formStyles.input} type="number" value={form[p.tier]?.rate ?? p.rate} onChange={e => setField(p.tier, 'rate', parseInt(e.target.value))} />
                </div>
                <div className={formStyles.field}>
                  <label className={formStyles.label}>Tagline</label>
                  <input className={formStyles.input} value={form[p.tier]?.tagline ?? p.tagline} onChange={e => setField(p.tier, 'tagline', e.target.value)} />
                </div>
                <div className={formStyles.field} style={{ gridColumn: '1 / -1' }}>
                  <label className={formStyles.label}>Description</label>
                  <textarea className={formStyles.input} rows={3} value={form[p.tier]?.description ?? p.description} onChange={e => setField(p.tier, 'description', e.target.value)} style={{ resize: 'vertical' }} />
                </div>
                <div className={formStyles.field} style={{ gridColumn: '1 / -1' }}>
                  <label className={formStyles.label}>Note (shown under price)</label>
                  <input className={formStyles.input} value={form[p.tier]?.note ?? p.note ?? ''} onChange={e => setField(p.tier, 'note', e.target.value)} />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--gold)', fontWeight: 600 }}>{p.label}</span>
                  {p.is_featured && <span className={`${styles.badge} ${styles['badge-confirmed']}`}>FEATURED</span>}
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 26, color: 'var(--sand)', fontWeight: 600, marginBottom: 4 }}>
                  UGX {Number(p.rate).toLocaleString()} <span style={{ fontSize: 14, color: 'var(--sand-dim)', fontFamily: 'var(--sans)', fontWeight: 300 }}>/ hr</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--sand-dim)', fontStyle: 'italic', marginBottom: 4 }}>{p.tagline}</div>
                {p.note && <div style={{ fontSize: 11.5, color: 'var(--concrete)', marginTop: 4 }}>{p.note}</div>}
              </div>
              <button onClick={() => startEdit(p)} style={{ background: 'none', border: '1px solid var(--concrete-line)', color: 'var(--sand-dim)', padding: '8px 18px', fontSize: 12, fontFamily: 'var(--sans)', cursor: 'pointer', flexShrink: 0, letterSpacing: '0.06em' }}>
                Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
