'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Event } from '@/lib/types'
import pStyles from '../pricing/pricing.module.css'
import styles from '../admin.module.css'

const empty = { name: '', description: '', event_date: '', is_free: true, rsvp_link: '' }

export default function EventsEditor({ events }: { events: Event[] }) {
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  function set(field: string, value: string | boolean) { setForm(f => ({ ...f, [field]: value })) }

  function startEdit(e: Event) {
    setEditing(e.id)
    setAdding(false)
    setForm({
      name: e.name,
      description: e.description,
      event_date: e.event_date ? new Date(e.event_date).toISOString().slice(0, 16) : '',
      is_free: e.is_free,
      rsvp_link: e.rsvp_link ?? '',
    })
  }

  function buildPayload() {
    return {
      name: form.name,
      description: form.description,
      event_date: form.event_date ? new Date(form.event_date) : null,
      is_free: form.is_free,
      rsvp_link: form.rsvp_link || null,
    }
  }

  async function create() {
    setLoading('create')
    await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload()),
    })
    setLoading(null); setAdding(false); setForm(empty); router.refresh()
  }

  async function save(id: number) {
    setLoading(`save-${id}`)
    await fetch(`/api/admin/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload()),
    })
    setLoading(null); setEditing(null); setForm(empty); router.refresh()
  }

  async function toggleVisible(id: number, current: boolean) {
    setLoading(`vis-${id}`)
    await fetch(`/api/admin/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_visible: !current }),
    })
    setLoading(null); router.refresh()
  }

  async function remove(id: number) {
    if (!confirm('Delete this event?')) return
    setLoading(`del-${id}`)
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
    setLoading(null); router.refresh()
  }

  const FormFields = () => (
    <div className={pStyles.fields}>
      <div className={pStyles.field}>
        <label className={pStyles.label}>Name</label>
        <input className={pStyles.input} value={form.name} onChange={e => set('name', e.target.value)} />
      </div>
      <div className={pStyles.field}>
        <label className={pStyles.label}>Date & time</label>
        <input className={pStyles.input} type="datetime-local" value={form.event_date} onChange={e => set('event_date', e.target.value)} />
      </div>
      <div className={pStyles.field} style={{ gridColumn: '1 / -1' }}>
        <label className={pStyles.label}>Description</label>
        <textarea className={pStyles.input} rows={2} value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} />
      </div>
      <div className={pStyles.field}>
        <label className={pStyles.label}>RSVP link (optional)</label>
        <input className={pStyles.input} value={form.rsvp_link} onChange={e => set('rsvp_link', e.target.value)} placeholder="https://..." />
      </div>
      <div className={pStyles.field} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input type="checkbox" id="is_free" checked={form.is_free} onChange={e => set('is_free', e.target.checked)} />
        <label htmlFor="is_free" className={pStyles.label} style={{ margin: 0, cursor: 'pointer' }}>Free event</label>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--concrete-line)', border: '1px solid var(--concrete-line)', marginBottom: 16 }}>
        {events.map(ev => (
          <div key={ev.id}>
            <div style={{ background: 'var(--black-soft)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ color: 'var(--sand)', fontWeight: 600, fontSize: 15, fontFamily: 'var(--serif)' }}>{ev.name}</span>
                  {ev.is_free && <span style={{ fontSize: 10, color: 'var(--concrete)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>FREE</span>}
                  {!ev.is_visible && <span className={`${styles.badge} ${styles['badge-completed']}`}>HIDDEN</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--concrete)' }}>
                  {ev.event_date ? new Date(ev.event_date).toLocaleDateString('en-UG', { dateStyle: 'medium' }) : 'No date set'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button onClick={() => editing === ev.id ? setEditing(null) : startEdit(ev)} style={{ background: 'none', border: '1px solid var(--concrete-line)', color: 'var(--sand-dim)', padding: '7px 12px', fontSize: 11, fontFamily: 'var(--sans)', cursor: 'pointer' }}>
                  {editing === ev.id ? 'Cancel' : 'Edit'}
                </button>
                <button onClick={() => toggleVisible(ev.id, ev.is_visible)} disabled={!!loading} style={{ background: 'none', border: '1px solid var(--concrete-line)', color: 'var(--concrete)', padding: '7px 12px', fontSize: 11, fontFamily: 'var(--sans)', cursor: 'pointer' }}>
                  {loading === `vis-${ev.id}` ? '...' : ev.is_visible ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => remove(ev.id)} disabled={!!loading} style={{ background: 'none', border: '1px solid var(--concrete-line)', color: '#c0392b', padding: '7px 12px', fontSize: 11, fontFamily: 'var(--sans)', cursor: 'pointer' }}>
                  {loading === `del-${ev.id}` ? '...' : 'Delete'}
                </button>
              </div>
            </div>
            {editing === ev.id && (
              <div style={{ background: 'var(--black-soft)', padding: '0 24px 24px', borderTop: '1px solid var(--concrete-line)' }}>
                <FormFields />
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button className={pStyles.btnSave} disabled={!form.name || !!loading} onClick={() => save(ev.id)}>
                    {loading === `save-${ev.id}` ? 'Saving...' : 'Save'}
                  </button>
                  <button className={pStyles.btnCancel} onClick={() => { setEditing(null); setForm(empty) }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {adding ? (
        <div style={{ border: '1px solid var(--concrete-line)', padding: '24px' }}>
          <FormFields />
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className={pStyles.btnSave} disabled={!form.name || !!loading} onClick={create}>
              {loading === 'create' ? 'Adding...' : 'Add event'}
            </button>
            <button className={pStyles.btnCancel} onClick={() => { setAdding(false); setForm(empty) }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => { setAdding(true); setEditing(null) }} style={{ background: 'none', border: '1px dashed var(--concrete-line)', color: 'var(--sand-dim)', padding: '12px 22px', fontSize: 12, fontFamily: 'var(--sans)', cursor: 'pointer', letterSpacing: '0.08em' }}>
          + Add event
        </button>
      )}
    </div>
  )
}
