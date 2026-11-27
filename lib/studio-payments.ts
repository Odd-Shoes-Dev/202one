import { createHash } from 'node:crypto'
import { getSql } from '@/lib/adapters/db/client'
import { availableSlot, studioTime } from '@/lib/demo-reservations'
import { checkoutMinutes, createPesapalCheckout, PesapalCheckoutRejected, verifyPesapalPayment, type PesapalConfig, type PesapalEnvironment } from '@/lib/pesapal'
import { addons, demoDeposit, durationOptions, plans, quoteLines, type QuoteOptions } from '@/lib/studio-quote'

type PaymentState = 'pending' | 'paid' | 'review'
type Payment = {
  state: PaymentState
  amount: number
  items: ReturnType<typeof quoteLines>
  expired: boolean
  total_amount: number
  starts_at: string
  ends_at: string
  booking_status: string
  pesapal_environment: PesapalEnvironment | null
  pesapal_tracking_id: string | null
}

type CheckoutInput = {
  id: string
  quote: QuoteOptions
  date: string
  start: number
  deposit: boolean
  name: string
  email: string
}

type CheckoutResult = { url: string } | { error: string; changeTime?: boolean; retry?: boolean; statusHref?: string }

const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

export function paymentBookingId(reference: string) {
  const id = reference.slice('202ONE-'.length)
  return reference.startsWith('202ONE-') && idPattern.test(id) ? id : null
}

export async function startStudioPayment(config: PesapalConfig, input: CheckoutInput): Promise<CheckoutResult> {
  const { id, quote, date, start, deposit } = input ?? {}
  if (typeof id !== 'string' || !idPattern.test(id) || !quote || typeof quote.tier !== 'string'
    || !Object.hasOwn(plans, quote.tier) || !durationOptions.includes(quote.hours)
    || !Array.isArray(quote.extras) || quote.extras.length > Object.keys(addons).length
    || quote.extras.some((item) => typeof item !== 'string' || !Object.hasOwn(addons, item))
    || typeof date !== 'string' || typeof deposit !== 'boolean') {
    return { error: 'Review your package and booking details, then try again.' }
  }

  const name = typeof input.name === 'string' ? input.name.trim() : ''
  const email = typeof input.email === 'string' ? input.email.trim() : ''
  if (!name || name.length > 100 || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Enter a name and a valid email address.' }
  }

  const resource = quote.tier === 'services' ? 'services' : 'studio'
  if (!availableSlot({ date, start, hours: quote.hours, resource }, [])) {
    return { error: 'Choose a future time within the studio’s booking hours.', changeTime: true }
  }

  const items = quoteLines({ ...quote, extras: [...new Set(quote.extras)].sort() })
  const total = items.reduce((sum, item) => sum + item.amount, 0)
  if (!total) return { error: 'Choose at least one service to continue.' }
  const amount = deposit ? Math.min(demoDeposit, total) : total
  const type = quote.tier === 'services' ? 'event' : quote.tier
  const startsAt = `${date}T${studioTime(start)}:00+03:00`
  const endsAt = `${date}T${studioTime(start + quote.hours)}:00+03:00`
  const hash = createHash('sha256').update(JSON.stringify([type, startsAt, endsAt, amount, items, name, email])).digest('hex')
  const reference = `202ONE-${id}`
  const statusHref = `/book/payment?${new URLSearchParams({ tx_ref: reference })}`
  const sql = getSql()

  // Serialize holds and confirmations so overlapping requests see the latest committed schedule.
  const [, created] = await sql.transaction([
    sql`SELECT pg_advisory_xact_lock(hashtext('202one-studio-schedule'))`,
    sql`WITH reservation AS (
      INSERT INTO bookings (id, type, artist_name, email, starts_at, ends_at, rate_per_hour, duration_hours, total_amount, deposit_amount, admin_notes)
      SELECT ${id}::uuid, ${type}::booking_type, ${name}, ${email}, ${startsAt}::timestamptz, ${endsAt}::timestamptz,
        ${plans[quote.tier].hourly}, ${quote.hours}, ${total}, ${Math.min(demoDeposit, total)},
        ${config.environment === 'sandbox' ? 'Pesapal sandbox booking' : null}
      WHERE ${startsAt}::timestamptz > now() AND NOT EXISTS (
        SELECT 1 FROM bookings AS b
        LEFT JOIN studio_checkout_payments AS p ON p.booking_id = b.id
        WHERE b.starts_at < ${endsAt}::timestamptz AND b.ends_at > ${startsAt}::timestamptz
          AND (b.type = 'event') = (${type}::booking_type = 'event')
          AND (b.status IN ('confirmed', 'completed', 'blocked')
            OR (b.status = 'pending' AND (p.booking_id IS NULL OR (p.state = 'pending' AND p.hold_until > now()))))
      )
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    )
    INSERT INTO studio_checkout_payments (booking_id, request_hash, amount, items, pesapal_environment, hold_until)
    SELECT id, ${hash}, ${amount}, ${JSON.stringify(items)}::jsonb,
      ${config.environment}, LEAST(${startsAt}::timestamptz, now() + (${checkoutMinutes}::integer * interval '1 minute'))
    FROM reservation RETURNING booking_id`,
  ])

  if (!created.length) {
    const [existing] = await sql`SELECT p.request_hash, p.checkout_url, p.state, p.pesapal_environment,
      b.status AS booking_status, p.hold_until <= now() AS expired
      FROM studio_checkout_payments p JOIN bookings b ON b.id = p.booking_id WHERE p.booking_id = ${id}`
    if (!existing) return { error: 'That time is unavailable. Choose another slot.', changeTime: true }
    if (existing.request_hash !== hash || existing.pesapal_environment !== config.environment) {
      return { error: 'Start a new checkout for these booking details.', retry: true }
    }
    if (existing.state !== 'pending') return { url: statusHref }
    if (existing.expired || existing.booking_status !== 'pending') return { error: 'This checkout has expired. Choose a time to try again.', changeTime: true }
    if (existing.checkout_url) return { url: existing.checkout_url as string }
    return { error: 'The checkout link is still pending. Try again shortly or check the payment status.', statusHref }
  }

  try {
    const checkout = await createPesapalCheckout(config, reference, amount, { name, email }, amount < total)
    const [saved] = await sql`UPDATE studio_checkout_payments SET
      checkout_url = ${checkout.url}, pesapal_tracking_id = ${checkout.trackingId}
      WHERE booking_id = ${id} AND (pesapal_tracking_id IS NULL OR pesapal_tracking_id = ${checkout.trackingId})
      RETURNING state, hold_until <= now() AS expired`
    if (!saved) throw new Error('Pesapal checkout details could not be saved')
    if (saved.state !== 'pending' || saved.expired) return { url: statusHref }
    return { url: checkout.url }
  } catch (error) {
    if (error instanceof PesapalCheckoutRejected) {
      await sql`WITH rejected AS (
        UPDATE studio_checkout_payments SET hold_until = now()
        WHERE booking_id = ${id} AND state = 'pending' RETURNING booking_id
      )
      UPDATE bookings SET status = 'failed', updated_at = now()
      FROM rejected WHERE bookings.id = rejected.booking_id AND bookings.status = 'pending'`
      console.error(error.message)
      return { error: 'Pesapal could not open checkout. Please try again.', retry: true }
    }
    console.error('Pesapal checkout response could not be confirmed')
    return { error: 'We could not confirm the checkout link. Check the payment status before trying another booking.', statusHref }
  }
}

export async function readStudioPayment(id: string) {
  const sql = getSql()
  const [payment] = await sql`SELECT p.state, p.amount, p.items, p.hold_until <= now() AS expired,
    p.pesapal_environment, p.pesapal_tracking_id,
    b.total_amount, b.starts_at, b.ends_at, b.status AS booking_status
    FROM studio_checkout_payments p JOIN bookings b ON b.id = p.booking_id WHERE p.booking_id = ${id}`
  return (payment as Payment | undefined) ?? null
}

export async function reconcileStudioPayment(config: PesapalConfig, reference: string, notificationTrackingId?: string) {
  const id = paymentBookingId(reference)
  if (!id) return null
  const payment = await readStudioPayment(id)
  if (!payment || payment.pesapal_environment !== config.environment) return null
  if (payment.pesapal_tracking_id && notificationTrackingId && payment.pesapal_tracking_id !== notificationTrackingId) return null

  const trackingId = payment.pesapal_tracking_id ?? notificationTrackingId
  if (!trackingId || payment.state === 'review') return payment

  const outcome = await verifyPesapalPayment(config, trackingId, reference, payment.amount)
  if (!outcome) return null
  if (outcome === 'unpaid' || (payment.state === 'paid' && outcome !== 'reversed')) return payment

  const reviewNote = {
    completed: 'Pesapal payment arrived after the checkout hold ended or the booking status changed. Review before confirming.',
    mismatch: 'Pesapal payment amount or currency differs from the booking. Review before confirming.',
    reversed: 'Pesapal reported a payment reversal. Review this booking and its payment flags.',
  }[outcome]

  const sql = getSql()
  await sql.transaction([
    sql`SELECT pg_advisory_xact_lock(hashtext('202one-studio-schedule'))`,
    sql`WITH settled AS (
      UPDATE studio_checkout_payments AS p SET
        state = CASE WHEN ${outcome === 'completed'} AND p.hold_until > now() AND b.status = 'pending' THEN 'paid' ELSE 'review' END,
        pesapal_tracking_id = ${trackingId}, verified_at = now()
      FROM bookings AS b WHERE p.booking_id = ${id} AND b.id = p.booking_id
        AND (p.pesapal_tracking_id IS NULL OR p.pesapal_tracking_id = ${trackingId})
        AND (p.state = 'pending' OR (${outcome === 'reversed'} AND p.state = 'paid'))
      RETURNING p.booking_id, p.state, p.amount
    )
    UPDATE bookings AS b SET
      status = CASE WHEN settled.state = 'paid' THEN 'confirmed'::booking_status ELSE b.status END,
      deposit_paid = b.deposit_paid OR settled.state = 'paid',
      full_paid = b.full_paid OR (settled.state = 'paid' AND settled.amount = b.total_amount),
      payment_ref = ${reference}, updated_at = now(),
      admin_notes = CASE WHEN settled.state = 'review' THEN concat_ws(E'\n', b.admin_notes, ${reviewNote}::text) ELSE b.admin_notes END
    FROM settled WHERE b.id = settled.booking_id`,
  ])
  return readStudioPayment(id)
}
