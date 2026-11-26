'use client'

import { useState, useEffect, useId } from 'react'
import { createBooking, calculateBookingTotal } from '@/app/actions/booking'
import styles from './BookingForm.module.css'

const TIERS = [
  { value: 'space',      label: 'Space',      tagline: 'Rehearsal, songwriting, practice', rate: 35000 },
  { value: 'session',    label: 'Session',     tagline: 'Recording with engineer support',  rate: 60000 },
  { value: 'production', label: 'Production',  tagline: 'Full production & mixing',         rate: 100000 },
]

const DURATIONS = [1, 2, 3, 4, 6, 8]

type Step = 'type' | 'details' | 'datetime' | 'review' | 'done'

interface FormState {
  type: string
  artist_name: string
  email: string
  phone: string
  notes: string
  date: string
  start_time: string
  duration: number
}

const empty: FormState = {
  type: '',
  artist_name: '',
  email: '',
  phone: '',
  notes: '',
  date: '',
  start_time: '',
  duration: 2,
}

export default function BookingForm({ onSuccess, initialTier }: { onSuccess?: () => void; initialTier?: string } = {}) {
  const fieldId = useId()
  const [step, setStep] = useState<Step>(initialTier ? 'details' : 'type')
  const [form, setForm] = useState<FormState>({ ...empty, type: initialTier ?? '' })

  useEffect(() => {
    if (initialTier) {
      setForm({ ...empty, type: initialTier })
      setStep('details')
    } else {
      setForm(empty)
      setStep('type')
    }
  }, [initialTier])
  const [total, setTotal] = useState<{ subtotal: number; discount: number; total: number; promoApplied: string | null } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)

  // Recalculate total whenever tier or duration changes
  useEffect(() => {
    if (!form.type) return
    calculateBookingTotal(form.type, form.duration).then(res => {
      if (res.success && res.data) setTotal(res.data)
    })
  }, [form.type, form.duration])

  function set(field: keyof FormState, value: string | number) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function selectedTier() {
    return TIERS.find(t => t.value === form.type)
  }

  function buildDatetimes() {
    const [h, m] = form.start_time.split(':').map(Number)
    const starts = new Date(`${form.date}T${form.start_time}:00`)
    const ends = new Date(starts.getTime() + form.duration * 60 * 60 * 1000)
    return { starts, ends }
  }

  async function submit() {
    setLoading(true)
    setError(null)

    const tier = selectedTier()
    if (!tier) return

    const { starts, ends } = buildDatetimes()

    const result = await createBooking({
      type: form.type as 'space' | 'session' | 'production',
      artist_name: form.artist_name,
      email: form.email,
      phone: form.phone || undefined,
      notes: form.notes || undefined,
      starts_at: starts,
      ends_at: ends,
      rate_per_hour: tier.rate,
      duration_hours: form.duration,
      total_amount: total?.total ?? tier.rate * form.duration,
      deposit_amount: 10000,
    })

    setLoading(false)

    if (result.success && result.data) {
      setBookingId(result.data.booking.id)
      setStep('done')
      onSuccess?.()
    } else {
      setError(result.error ?? 'Something went wrong.')
    }
  }

  if (step === 'done') {
    return (
      <div className={styles.done}>
        <div className={styles.doneIcon}>✓</div>
        <h2 className={styles.doneTitle}>Booking received.</h2>
        <p className={styles.doneSub}>We've sent a confirmation to <strong>{form.email}</strong>. The team will be in touch with payment instructions for the UGX 10,000 deposit to secure your slot.</p>
        <p className={styles.doneRef}>Reference: <span>{bookingId}</span></p>
        <a href="/" className={styles.doneBack}>Back to 202One</a>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      {/* Progress */}
      <div className={styles.progress}>
        {(['type', 'details', 'datetime', 'review'] as Step[]).map((s, i) => (
          <div key={s} className={`${styles.progressStep} ${step === s ? styles.active : ''} ${['details','datetime','review','done'].indexOf(step) > i - 1 ? styles.done : ''}`}>
            <div className={styles.progressDot}>{i + 1}</div>
            <span>{['Session type', 'Your details', 'Date & time', 'Review'][i]}</span>
          </div>
        ))}
      </div>

      {/* Step 1 — Session type */}
      {step === 'type' && (
        <div className={styles.step}>
          <h2 className={styles.stepTitle}>What are you booking?</h2>
          <div className={styles.tierGrid}>
            {TIERS.map(t => (
              <button
                key={t.value}
                className={`${styles.tierCard} ${form.type === t.value ? styles.selected : ''}`}
                onClick={() => { set('type', t.value); setStep('details') }}
              >
                <div className={styles.tierLabel}>{t.label}</div>
                <div className={styles.tierTagline}>{t.tagline}</div>
                <div className={styles.tierRate}>UGX {t.rate.toLocaleString()} / hr</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Details */}
      {step === 'details' && (
        <div className={styles.step}>
          <h2 className={styles.stepTitle}>Tell us about yourself.</h2>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${fieldId}-artist-name`}>Name / Artist name <span>*</span></label>
              <input id={`${fieldId}-artist-name`} className={styles.input} value={form.artist_name} onChange={e => set('artist_name', e.target.value)} placeholder="e.g. Naomi K." />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${fieldId}-email`}>Email <span>*</span></label>
              <input id={`${fieldId}-email`} className={styles.input} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${fieldId}-phone`}>Phone <span className={styles.optional}>(optional)</span></label>
              <input id={`${fieldId}-phone`} className={styles.input} type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+256 7xx xxx xxx" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${fieldId}-notes`}>Notes <span className={styles.optional}>(optional)</span></label>
              <textarea id={`${fieldId}-notes`} className={`${styles.input} ${styles.textarea}`} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="What are you working on? Any instruments, band size, or special requirements?" rows={4} />
            </div>
          </div>
          <div className={styles.nav}>
            <button className={styles.btnBack} onClick={() => setStep('type')}>Back</button>
            <button
              className={styles.btnNext}
              disabled={!form.artist_name || !form.email}
              onClick={() => setStep('datetime')}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Date & time */}
      {step === 'datetime' && (
        <div className={styles.step}>
          <h2 className={styles.stepTitle}>When do you want to come in?</h2>
          <div className={styles.fields}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${fieldId}-date`}>Date <span>*</span></label>
                <input id={`${fieldId}-date`} className={styles.input} type="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={e => set('date', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${fieldId}-start-time`}>Start time <span>*</span></label>
                <input id={`${fieldId}-start-time`} className={styles.input} type="time" value={form.start_time} onChange={e => set('start_time', e.target.value)} />
              </div>
            </div>
            <div className={styles.field}>
              <p className={styles.label} id={`${fieldId}-duration`}>Duration</p>
              <div className={styles.durationGrid} role="group" aria-labelledby={`${fieldId}-duration`}>
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    className={`${styles.durationBtn} ${form.duration === d ? styles.selected : ''}`}
                    onClick={() => set('duration', d)}
                  >
                    {d}h
                  </button>
                ))}
              </div>
            </div>

            {total && (
              <div className={styles.totalPreview}>
                <div className={styles.totalRow}>
                  <span>UGX {selectedTier()?.rate.toLocaleString()} × {form.duration}h</span>
                  <span>UGX {total.subtotal.toLocaleString()}</span>
                </div>
                {total.discount > 0 && (
                  <div className={`${styles.totalRow} ${styles.discount}`}>
                    <span>Discount ({total.promoApplied})</span>
                    <span>− UGX {total.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className={`${styles.totalRow} ${styles.totalFinal}`}>
                  <span>Total</span>
                  <span>UGX {total.total.toLocaleString()}</span>
                </div>
                <div className={styles.depositNote}>
                  Reserve now with a UGX 10,000 deposit · Pay the rest when you arrive
                </div>
              </div>
            )}
          </div>
          <div className={styles.nav}>
            <button className={styles.btnBack} onClick={() => setStep('details')}>Back</button>
            <button
              className={styles.btnNext}
              disabled={!form.date || !form.start_time}
              onClick={() => setStep('review')}
            >
              Review booking
            </button>
          </div>
        </div>
      )}

      {/* Step 4 — Review */}
      {step === 'review' && (
        <div className={styles.step}>
          <h2 className={styles.stepTitle}>Review your booking.</h2>
          <div className={styles.review}>
            <div className={styles.reviewSection}>
              <div className={styles.reviewLabel}>SESSION TYPE</div>
              <div className={styles.reviewValue}>{selectedTier()?.label} — {selectedTier()?.tagline}</div>
            </div>
            <div className={styles.reviewSection}>
              <div className={styles.reviewLabel}>ARTIST</div>
              <div className={styles.reviewValue}>{form.artist_name}</div>
              <div className={styles.reviewSub}>{form.email}{form.phone ? ` · ${form.phone}` : ''}</div>
            </div>
            <div className={styles.reviewSection}>
              <div className={styles.reviewLabel}>DATE & TIME</div>
              <div className={styles.reviewValue}>
                {new Date(`${form.date}T${form.start_time}`).toLocaleDateString('en-UG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className={styles.reviewSub}>{form.start_time} · {form.duration} hour{form.duration > 1 ? 's' : ''}</div>
            </div>
            {form.notes && (
              <div className={styles.reviewSection}>
                <div className={styles.reviewLabel}>NOTES</div>
                <div className={styles.reviewValue}>{form.notes}</div>
              </div>
            )}
            {total && (
              <div className={styles.reviewSection}>
                <div className={styles.reviewLabel}>TOTAL</div>
                <div className={styles.reviewValue}>UGX {total.total.toLocaleString()}</div>
                <div className={styles.reviewSub}>Deposit due now: UGX 10,000 · Remainder on arrival</div>
              </div>
            )}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.nav}>
            <button className={styles.btnBack} onClick={() => setStep('datetime')}>Back</button>
            <button className={styles.btnSubmit} onClick={submit} disabled={loading}>
              {loading ? 'Submitting...' : 'Confirm booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
