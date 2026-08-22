'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { StudioSession } from '@/lib/types'
import pStyles from '../pricing/pricing.module.css'
import styles from '../admin.module.css'

const empty = { title: '', artist_name: '', description: '', video_url: '' }

export default function SessionsEditor({ sessions }: { sessions: StudioSession[] }) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  function set(field: string, value: string) { setForm(f => ({ ...f, [field]: value })) }

  async function create() {
    setLoading('create')
    await fetch('/api/admin/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(null); setAdding(false); setForm(empty); router.refresh()
  }

  async function setFeatured(id: number) {
    setLoading(String(id))
    await fetch(`/api/admin/sessions/${id}/feature`, { method: 'PATCH' })
    setLoading(null); router.refresh()
  }

  async function toggleVisible(id: number, current: boolean) {
    setLoading(`vis-${id}`)
    await fetch(`/api/admin/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_visible: !current }),
    })
    setLoading(null); router.refresh()
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--concrete-line)', border: '1px solid var(--concrete-line)', marginBottom: 16 }}>
        {sessions.map(s => (
          <div key={s.id} style={{ background: 'var(--black-soft)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                <span style={{ color: 'var(--sand)', fontWeight: 600, fontSize: 15, fontFamily: 'var(--serif)' }}>{s.title}</span>
                {s.is_featured && <span className={`${styles.badge} ${styles['badge-confirmed']}`}>FEATURED</span>}
                {!s.is_visible && <span className={`${styles.badge} ${styles['badge-completed']}`}>HIDDEN</span>}
              </div>
              <div style={{ fontSize: 13, color: 'var(--sand-dim)' }}>{s.artist_name}</div>
              <div style={{ fontSize: 12, color: 'var(--concrete)', marginTop: 4 }}>{s.description}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {!s.is_featured && (
                <button onClick={() => setFeatured(s.id)} disabled={!!loading} style={{ background: 'none', border: '1px solid var(--gold)', color: 'var(--gold-bright)', padding: '7px 12px', fontSize: 11, fontFamily: 'var(--sans)', cursor: 'pointer', letterSpacing: '0.08em' }}>
                  {loading === String(s.id) ? '...' : 'Set featured'}
                </button>
              )}
              <button onClick={() => toggleVisible(s.id, s.is_visible)} disabled={!!loading} style={{ background: 'none', border: '1px solid var(--concrete-line)', color: 'var(--concrete)', padding: '7px 12px', fontSize: 11, fontFamily: 'var(--sans)', cursor: 'pointer' }}>
                {loading === `vis-${s.id}` ? '...' : s.is_visible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {adding ? (
        <div style={{ border: '1px solid var(--concrete-line)', padding: '24px' }}>
          <div className={pStyles.fields}>
            <div className={pStyles.field}>
              <label className={pStyles.label}>Title</label>
              <input className={pStyles.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Steady" />
            </div>
            <div className={pStyles.field}>
              <label className={pStyles.label}>Artist name</label>
              <input className={pStyles.input} value={form.artist_name} onChange={e => set('artist_name', e.target.value)} placeholder="e.g. Naomi K." />
            </div>
            <div className={pStyles.field} style={{ gridColumn: '1 / -1' }}>
              <label className={pStyles.label}>Description</label>
              <textarea className={pStyles.input} rows={2} value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
            <div className={pStyles.field} style={{ gridColumn: '1 / -1' }}>
              <label className={pStyles.label}>Video URL (optional)</label>
              <input className={pStyles.input} value={form.video_url} onChange={e => set('video_url', e.target.value)} placeholder="YouTube, Vimeo, etc." />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className={pStyles.btnSave} disabled={!form.title || !form.artist_name || !!loading} onClick={create}>
              {loading === 'create' ? 'Adding...' : 'Add session'}
            </button>
            <button className={pStyles.btnCancel} onClick={() => { setAdding(false); setForm(empty) }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{ background: 'none', border: '1px dashed var(--concrete-line)', color: 'var(--sand-dim)', padding: '12px 22px', fontSize: 12, fontFamily: 'var(--sans)', cursor: 'pointer', letterSpacing: '0.08em' }}>
          + Add session
        </button>
      )}
    </div>
  )
}
