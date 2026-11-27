'use client'

import Link from 'next/link'
import { useRef, useState, useSyncExternalStore, type FormEvent } from 'react'
import { openStudioCheckout } from '@/app/book/payment-action'
import type { PesapalEnvironment } from '@/lib/pesapal'
import { addons, bookingHref, demoDeposit, durationOptions, plans, quoteLines, ugx, type QuoteOptions, type StudioAddon, type StudioPlan } from '@/lib/studio-quote'
import { availableSlot, readReservations, reservationSnapshot, reserveDemoBooking, studioTime, studioToday, subscribeToReservations, type DemoReceipt, type DemoSlot } from '@/lib/demo-reservations'
import styles from './StudioCheckout.module.css'

const methods = ['MTN Mobile Money', 'Airtel Money', 'Card']
const startHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
const steps = ['Build package', 'Choose time', 'Checkout']
const emptySnapshot = () => '[]'

export default function StudioCheckout({
  initial, pricing = false, paymentMode,
}: { initial: QuoteOptions; pricing?: boolean; paymentMode?: PesapalEnvironment }) {
  const [quote, setQuote] = useState(initial)
  const [step, setStep] = useState(0)
  const [date, setDate] = useState('')
  const [start, setStart] = useState('')
  const [method, setMethod] = useState(methods[0])
  const [deposit, setDeposit] = useState(false)
  const [error, setError] = useState('')
  const [paymentStatusHref, setPaymentStatusHref] = useState('')
  const [receipt, setReceipt] = useState<DemoReceipt>()
  const [paying, setPaying] = useState(false)
  const checkoutLock = useRef(false)
  const attempt = useRef<{ id: string; details: string } | null>(null)
  const heading = useRef<HTMLDivElement>(null)
  const snapshot = useSyncExternalStore(subscribeToReservations, reservationSnapshot, emptySnapshot)
  const reservations = paymentMode ? [] : readReservations(snapshot)
  const lines = quoteLines(quote)
  const total = lines.reduce((sum, line) => sum + line.amount, 0)
  const amount = deposit ? Math.min(demoDeposit, total) : total
  const slot: DemoSlot = {
    date,
    start: Number(start),
    hours: quote.hours,
    resource: quote.tier === 'services' ? 'services' : 'studio',
  }
  const chosenTimeAvailable = date !== '' && start !== '' && availableSlot(slot, reservations)

  function toggleAddon(id: StudioAddon) {
    setQuote((previous) => ({
      ...previous,
      extras: previous.extras.includes(id) ? previous.extras.filter((item) => item !== id) : [...previous.extras, id],
    }))
  }

  function changeStep(next: number) {
    setError('')
    setPaymentStatusHref('')
    setStep(next)
    heading.current?.focus()
  }

  function chooseTime(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!chosenTimeAvailable) {
      setError('Choose an available date and time to continue.')
      return
    }
    changeStep(2)
  }

  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (checkoutLock.current || !total) return
    checkoutLock.current = true
    setPaying(true)
    setError('')
    setPaymentStatusHref('')

    try {
      if (paymentMode) {
        const form = new FormData(event.currentTarget)
        const name = String(form.get('customer') ?? '').trim()
        const email = String(form.get('email') ?? '').trim()
        const details = JSON.stringify({ quote, date, start, deposit, name, email })
        if (attempt.current?.details !== details) {
          attempt.current = { id: crypto.randomUUID(), details }
        }
        const result = await openStudioCheckout({ id: attempt.current.id, quote, date, start: slot.start, deposit, name, email })
        if ('url' in result) {
          window.location.assign(result.url)
          return
        }
        setError(result.error)
        if (result.statusHref) setPaymentStatusHref(result.statusHref)
        if (result.retry || result.changeTime) attempt.current = null
        if (result.changeTime) {
          setStep(1)
          setStart('')
          heading.current?.focus()
        }
        return
      }

      const code = Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => byte.toString(16).padStart(2, '0')).join('')
      const reference = `DEMO-${code.toUpperCase()}`
      const booking = { ...slot, reference, label: plans[quote.tier].title, method, total, paid: amount, items: lines }
      if (!(await reserveDemoBooking(booking))) {
        setStep(1)
        setStart('')
        setError('That time is unavailable. Choose another slot.')
        heading.current?.focus()
        return
      }
      setReceipt(booking)
      heading.current?.focus()
    } catch {
      setError(paymentMode
        ? 'Pesapal checkout could not be opened. Please try again.'
        : 'The demo booking could not be saved. Check that this browser allows site storage and try again.')
    } finally {
      checkoutLock.current = false
      setPaying(false)
    }
  }

  return (
    <section id="booking-flow" className={styles.checkout} aria-labelledby="checkout-heading">
      <header ref={heading} tabIndex={-1} className={styles.heading}>
        {paymentMode !== 'live' && <p className={styles.notice}>{paymentMode === 'sandbox' ? 'Pesapal sandbox · Sample rates' : 'Booking demo · Sample rates and simulated payments'}</p>}
        <h2 id="checkout-heading">{receipt ? 'Demo booking confirmed' : pricing ? 'Build your price' : steps[step]}</h2>
        {!receipt && !pricing && (
          <ol className={styles.steps} aria-label="Booking progress">
            {steps.map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined}>{label}</li>)}
          </ol>
        )}
        {!receipt && !pricing && step === 0 && reservations.length > 0 && (
          <button type="button" className={styles.receiptLink} onClick={() => { setReceipt(reservations.at(-1)); heading.current?.focus() }}>
            View last demo booking
          </button>
        )}
      </header>

      {receipt ? (
        <div className={styles.receipt}>
          <p role="status">Your demo reservation is saved in this browser.</p>
          <dl>
            <dt>Reference</dt><dd>{receipt.reference}</dd>
            <dt>Package</dt><dd>{receipt.label}</dd>
            <dt>Schedule</dt><dd>{receipt.date} · {studioTime(receipt.start)}–{studioTime(receipt.start + receipt.hours)} EAT</dd>
            <dt>Items</dt><dd><ul>{receipt.items.map((item) => <li key={item.title}>{item.title} · {ugx(item.amount)}</li>)}</ul></dd>
            <dt>Package total</dt><dd>{ugx(receipt.total)}</dd>
            <dt>Demo payment</dt><dd>{ugx(receipt.paid)} via {receipt.method}</dd>
            <dt>Remaining balance</dt><dd>{ugx(receipt.total - receipt.paid)}</dd>
          </dl>
          <button type="button" className={styles.primary} onClick={() => { setReceipt(undefined); setDate(''); setStart(''); setDeposit(false); changeStep(0) }}>
            Start another booking
          </button>
        </div>
      ) : (
        <div className={styles.columns}>
          <div className={styles.panel}>
            {step === 0 && (
              <>
                <fieldset className={styles.fieldset}>
                  <legend>Choose a starting point</legend>
                  <div className={styles.planGrid}>
                    {Object.entries(plans).map(([id, plan]) => (
                      <label className={styles.option} key={id}>
                        <input type="radio" name="studio-tier" value={id} checked={quote.tier === id} onChange={() => setQuote({ ...quote, tier: id as StudioPlan })} />
                        <span>
                          <strong>{plan.title}</strong>
                          <span>{plan.description}</span>
                          <b>{plan.hourly ? `${ugx(plan.hourly)} / hour` : 'Priced by service'}</b>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className={styles.duration}>
                  <span>{quote.tier === 'services' ? 'Booking window' : 'Studio time'}</span>
                  <select value={quote.hours} onChange={(event) => { setQuote({ ...quote, hours: Number(event.target.value) }); setStart('') }}>
                    {durationOptions.map((hours) => <option key={hours} value={hours}>{hours} {hours === 1 ? 'hour' : 'hours'}</option>)}
                  </select>
                </label>
                <fieldset className={styles.fieldset}>
                  <legend>{quote.tier === 'services' ? 'Choose your services' : 'Add creative services'}</legend>
                  <div className={styles.addonGrid}>
                    {Object.entries(addons).map(([id, addon]) => (
                      <label className={styles.addon} key={id}>
                        <input type="checkbox" checked={quote.extras.includes(id as StudioAddon)} onChange={() => toggleAddon(id as StudioAddon)} />
                        <span><strong>{addon.title}</strong><span>{ugx(addon.price)}</span></span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </>
            )}

            {step === 1 && (
              <form onSubmit={chooseTime} className={styles.form}>
                <h3>Reserve your booking window</h3>
                <p>Mbarara time (EAT). {paymentMode ? 'We check availability and hold your time when you open checkout.' : 'Availability in this demo reflects reservations made in this browser.'}</p>
                <div className={styles.formGrid}>
                  <label><span>Date</span><input type="date" required min={studioToday()} defaultValue={date} onInput={(event) => { setDate(event.currentTarget.value); setStart(''); setError('') }} /></label>
                  <label>
                    <span>Start time</span>
                    <select required value={start} disabled={!date} onChange={(event) => { setStart(event.target.value); setError('') }}>
                      <option value="">Choose a time</option>
                      {startHours.map((hour) => (
                        <option key={hour} value={hour} disabled={!date || !availableSlot({ ...slot, start: hour }, reservations)}>
                          {studioTime(hour)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                {date && startHours.every((hour) => !availableSlot({ ...slot, start: hour }, reservations)) && (
                  <p role="status">No times are available for this date and duration.</p>
                )}
                {error && <p className={styles.error} role="alert">{error}</p>}
                <div className={styles.buttons}>
                  <button type="button" className={styles.secondary} onClick={() => changeStep(0)}>Back</button>
                  <button type="submit" className={styles.primary} disabled={!chosenTimeAvailable}>Continue to checkout</button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form className={styles.form} onSubmit={checkout}>
                <h3>Review and pay</h3>
                <p>{date} · {studioTime(slot.start)}–{studioTime(slot.start + slot.hours)} EAT</p>
                <div className={styles.formGrid}>
                  <label><span>Customer name</span><input name="customer" autoComplete="name" required maxLength={100} placeholder={paymentMode === 'live' ? 'Your name' : 'Demo customer'} /></label>
                  <label><span>Email</span><input name="email" type="email" autoComplete="email" required maxLength={200} placeholder={paymentMode === 'live' ? 'you@example.com' : 'demo@example.com'} /></label>
                </div>
                <p>{paymentMode === 'live' ? 'Choose an available payment method on Pesapal.' : paymentMode === 'sandbox'
                  ? 'Use sample details to try Pesapal’s test checkout.' : 'Use sample details. The payment and confirmation are simulated.'}</p>
                {!paymentMode && <label>
                  <span>Payment method</span>
                  <select value={method} onChange={(event) => setMethod(event.target.value)}>
                    {methods.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>}
                <label>
                  <span>Amount to pay</span>
                  <select value={deposit ? 'deposit' : 'full'} onChange={(event) => setDeposit(event.target.value === 'deposit')}>
                    <option value="full">Full amount · {ugx(total)}</option>
                    {total > demoDeposit && <option value="deposit">Deposit · {ugx(demoDeposit)}</option>}
                  </select>
                </label>
                {error && <p className={styles.error} role="alert">{error}</p>}
                {paymentStatusHref && <Link className={styles.receiptLink} href={paymentStatusHref}>Check payment status</Link>}
                <div className={styles.buttons}>
                  <button type="button" className={styles.secondary} disabled={paying} onClick={() => changeStep(1)}>Back</button>
                  <button type="submit" className={styles.primary} disabled={paying || !chosenTimeAvailable}>
                    {paymentMode
                      ? paying ? 'Opening Pesapal…' : `Continue to Pesapal · ${ugx(amount)}`
                      : paying ? 'Saving demo booking…' : `Simulate payment · ${ugx(amount)}`}
                  </button>
                </div>
                {!chosenTimeAvailable && <p role="status">This time is no longer available. Go back to choose another slot.</p>}
              </form>
            )}
          </div>

          <aside className={styles.summary} aria-label="Package summary">
            <h3>Your package</h3>
            {quote.tier === 'services' && <p>{quote.hours} {quote.hours === 1 ? 'hour' : 'hours'} reserved for scheduling</p>}
            <dl aria-live="polite">
              {lines.map(({ title, amount }) => <div key={title}><dt>{title}</dt><dd>{ugx(amount)}</dd></div>)}
              <div className={styles.total}><dt>{paymentMode ? 'Package total' : 'Demo total'}</dt><dd>{ugx(total)}</dd></div>
              {step === 2 && deposit && <div><dt>Balance after deposit</dt><dd>{ugx(total - amount)}</dd></div>}
            </dl>
            {total === 0 && <p>Choose at least one service to continue.</p>}
            {step === 0 && (pricing && total > 0 ? (
              <Link className={styles.primary} href={bookingHref(quote)}>Continue to booking</Link>
            ) : (
              <button type="button" className={styles.primary} disabled={!total} onClick={() => changeStep(1)}>
                {pricing ? 'Continue to booking' : 'Choose date and time'}
              </button>
            ))}
          </aside>
        </div>
      )}
    </section>
  )
}
