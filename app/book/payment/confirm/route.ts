import { flutterwaveConfig } from '@/lib/flutterwave'
import { paymentBookingId, reconcileStudioPayment } from '@/lib/studio-payments'

export async function GET(request: Request) {
  const config = flutterwaveConfig()
  const params = new URL(request.url).searchParams
  const reference = params.get('tx_ref') ?? ''
  const incomingId = params.get('transaction_id') ?? ''
  const transactionId = /^\d{1,20}$/.test(incomingId) ? incomingId : undefined
  if (!config || !paymentBookingId(reference)) {
    return new Response(null, { status: 303, headers: { Location: '/book#booking-flow', 'Cache-Control': 'no-store' } })
  }

  try {
    await reconcileStudioPayment(config, reference, transactionId)
  } catch {
    console.error('Studio checkout return could not verify the transaction')
  }

  const query = new URLSearchParams({ tx_ref: reference })
  if (transactionId) query.set('transaction_id', transactionId)
  return new Response(null, { status: 303, headers: { Location: `/book/payment?${query}`, 'Cache-Control': 'no-store' } })
}
