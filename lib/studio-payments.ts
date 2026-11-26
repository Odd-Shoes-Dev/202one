import { createHash } from 'node:crypto'
import { getSql } from '@/lib/adapters/db/client'
import { availableSlot, studioTime } from '@/lib/demo-reservations'
import { checkoutMinutes, createFlutterwaveLink, FlutterwaveError, flutterwaveConfig, verifiedFlutterwavePayment } from '@/lib/flutterwave'
import { addons, demoDeposit, durationOptions, plans, quoteLines, type QuoteOptions } from '@/lib/studio-quote'

type Config = NonNullable<ReturnType<typeof flutterwaveConfig>>
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

export async function startStudioPayment(config: Config, input: CheckoutInput): Promise<CheckoutResult> {
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
        ${plans[quote.tier].hourly}, ${quote.hours}, ${total}, ${Math.min(demoDeposit, total)}, 'Flutterwave sandbox booking'
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
    INSERT INTO studio_checkout_payments (booking_id, request_hash, amount, items, hold_until)
    SELECT id, ${hash}, ${amount}, ${JSON.stringify(items)}::jsonb,
      LEAST(${startsAt}::timestamptz, now() + (${checkoutMinutes + 2}::integer * interval '1 minute'))
    FROM reservation RETURNING booking_id`,
  ])

  if (!created.length) {
    const [existing] = await sql`SELECT p.request_hash, p.checkout_url, p.state,
      b.status AS booking_status, p.hold_until <= now() AS expired
      FROM studio_checkout_payments p JOIN bookings b ON b.id = p.booking_id WHERE p.booking_id = ${id}`
    if (!existing) return { error: 'That time is unavailable. Choose another slot.', changeTime: true }
    if (existing.request_hash !== hash) return { error: 'Start a new checkout after changing your booking details.' }
    if (existing.state !== 'pending') return { url: statusHref }
    if (existing.expired || existing.booking_status !== 'pending') return { error: 'This checkout has expired. Choose a time to try again.', changeTime: true }
    if (existing.checkout_url) return { url: existing.checkout_url as string }
    return { error: 'The checkout link is still pending. Try again shortly or check the payment status.', statusHref }
  }

  try {
    const link = await createFlutterwaveLink(config, reference, amount, { name, email }, amount < total)
    await sql`UPDATE studio_checkout_payments SET checkout_url = ${link} WHERE booking_id = ${id}`
    return { url: link }
  } catch (error) {
    if (error instanceof FlutterwaveError && [400, 401, 403, 404, 422].includes(error.status)) {
      await sql`WITH rejected AS (
        UPDATE studio_checkout_payments SET hold_until = now()
        WHERE booking_id = ${id} AND state = 'pending' RETURNING booking_id
      )
      UPDATE bookings SET status = 'failed', updated_at = now()
      FROM rejected WHERE bookings.id = rejected.booking_id AND bookings.status = 'pending'`
      console.error('Flutterwave checkout rejected', error.status)
      return { error: 'Flutterwave could not open the test checkout. Please try again.', retry: true }
    }
    console.error('Flutterwave checkout response could not be saved')
    return { error: 'We could not confirm the checkout link. Check the payment status before trying another booking.', statusHref }
  }
}

export async function readStudioPayment(id: string) {
  const sql = getSql()
  const [payment] = await sql`SELECT p.state, p.amount, p.items, p.hold_until <= now() AS expired,
    b.total_amount, b.starts_at, b.ends_at, b.status AS booking_status
    FROM studio_checkout_payments p JOIN bookings b ON b.id = p.booking_id WHERE p.booking_id = ${id}`
  return (payment as Payment | undefined) ?? null
}

export async function reconcileStudioPayment(config: Config, reference: string, transactionId?: string) {
  const id = paymentBookingId(reference)
  if (!id) return null
  const payment = await readStudioPayment(id)
  if (!payment || payment.state !== 'pending') return payment

  const verified = await verifiedFlutterwavePayment(config, reference, payment.amount, transactionId)
  if (!verified) return payment

  const sql = getSql()
  await sql.transaction([
    sql`SELECT pg_advisory_xact_lock(hashtext('202one-studio-schedule'))`,
    sql`WITH settled AS (
      UPDATE studio_checkout_payments AS p SET
        state = CASE WHEN ${verified.matches} AND p.hold_until > now() AND b.status = 'pending' THEN 'paid' ELSE 'review' END,
        flutterwave_id = ${verified.id}, verified_at = now()
      FROM bookings AS b WHERE p.booking_id = ${id} AND b.id = p.booking_id AND p.state = 'pending'
      RETURNING p.booking_id, p.state, p.amount
    )
    UPDATE bookings AS b SET
      status = CASE WHEN settled.state = 'paid' THEN 'confirmed'::booking_status ELSE b.status END,
      deposit_paid = b.deposit_paid OR settled.state = 'paid',
      full_paid = b.full_paid OR (settled.state = 'paid' AND settled.amount = b.total_amount),
      payment_ref = ${reference}, updated_at = now(),
      admin_notes = CASE WHEN settled.state = 'review' THEN concat_ws(E'\n', b.admin_notes,
        'Flutterwave sandbox payment needs review. Check the paid amount, currency and booking hold.') ELSE b.admin_notes END
    FROM settled WHERE b.id = settled.booking_id`,
  ])
  return readStudioPayment(id)
}
