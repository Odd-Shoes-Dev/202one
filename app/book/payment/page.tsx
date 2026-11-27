import type { Metadata } from 'next'
import Link from 'next/link'
import SitePage from '@/app/components/SitePage'
import styles from '@/app/components/StudioCheckout.module.css'
import { pesapalConfig } from '@/lib/pesapal'
import { paymentBookingId, readStudioPayment } from '@/lib/studio-payments'
import { ugx } from '@/lib/studio-quote'

export const metadata: Metadata = {
  title: 'Booking Payment | 202One Studio',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
}

const dateFormat = new Intl.DateTimeFormat('en-UG', { timeZone: 'Africa/Kampala', dateStyle: 'medium' })
const timeFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Kampala', timeStyle: 'short' })

export default async function PaymentPage({ searchParams }: {
  searchParams: Promise<{ tx_ref?: string | string[] }>
}) {
  const params = await searchParams
  const reference = typeof params.tx_ref === 'string' ? params.tx_ref : ''
  const id = paymentBookingId(reference)
  const config = pesapalConfig()
  let payment = null
  let unavailable = !process.env.DATABASE_URL
  if (!unavailable && id) {
    try {
      payment = await readStudioPayment(id)
    } catch {
      unavailable = true
    }
  }

  const query = new URLSearchParams({ tx_ref: reference })
  const testPayment = payment ? payment.pesapal_environment !== 'live' : config?.environment === 'sandbox'
  const paymentLabel = testPayment ? 'Test payment' : 'Payment'
  const canCheck = id && config && (unavailable || (payment?.pesapal_environment === config.environment && payment.state === 'pending' && payment.pesapal_tracking_id))

  return (
    <SitePage title="Booking payment" image="booking" description="Your studio booking payment status and package details.">
      <section className={styles.checkout} aria-labelledby="payment-heading">
        <div className={styles.receipt}>
          {testPayment && <p className={styles.notice}>{payment?.pesapal_environment === null ? 'Earlier test checkout' : 'Pesapal sandbox'} · Sample rates</p>}
          {!payment ? (
            <h2 id="payment-heading">{unavailable ? 'Payment status is temporarily unavailable' : 'Payment reference not found'}</h2>
          ) : (
            <>
              <h2 id="payment-heading">{payment.state === 'paid'
                ? payment.booking_status === 'confirmed' ? testPayment ? 'Test booking confirmed' : 'Booking confirmed' : `${paymentLabel} recorded`
                : payment.state === 'review' ? `${paymentLabel} under review`
                  : payment.expired || payment.booking_status !== 'pending' ? 'Checkout hold ended' : 'Waiting for payment verification'}</h2>
              {payment.state === 'review' && <p>The studio needs to review this payment. Keep the reference below.</p>}
              {payment.state === 'pending' && <p>{payment.expired || payment.booking_status !== 'pending'
                ? 'If you already paid, keep your reference and contact the studio if your payment is still unconfirmed.'
                : 'Payment can take a moment to confirm. Check the status before trying another checkout.'}</p>}
              <dl>
                <dt>Reference</dt><dd>{reference}</dd>
                <dt>Schedule</dt><dd>{dateFormat.format(new Date(payment.starts_at))} · {timeFormat.format(new Date(payment.starts_at))}–{timeFormat.format(new Date(payment.ends_at))} EAT</dd>
                <dt>Items</dt><dd><ul>{payment.items.map((item) => <li key={item.title}>{item.title} · {ugx(item.amount)}</li>)}</ul></dd>
                <dt>Package total</dt><dd>{ugx(payment.total_amount)}</dd>
                <dt>{payment.state === 'paid' ? `${paymentLabel} verified` : 'Checkout amount'}</dt><dd>{ugx(payment.amount)}</dd>
                {payment.state === 'paid' && <><dt>Remaining balance</dt><dd>{ugx(payment.total_amount - payment.amount)}</dd></>}
              </dl>
            </>
          )}
          <div className={styles.buttons}>
            {canCheck && <a className={styles.primary} href={`/book/payment/confirm?${query}`}>Check payment status</a>}
            <Link className={styles.secondary} href="/book#booking-flow">Back to bookings</Link>
          </div>
        </div>
      </section>
    </SitePage>
  )
}
