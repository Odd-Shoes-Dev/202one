import { pesapalConfig, readPesapalTrackingId } from '@/lib/pesapal'
import { paymentBookingId, reconcileStudioPayment } from '@/lib/studio-payments'

export async function GET(request: Request) {
  const config = pesapalConfig()
  const params = new URL(request.url).searchParams
  const callbackReference = params.get('OrderMerchantReference')
  const reference = callbackReference ?? params.get('tx_ref') ?? ''
  if (!paymentBookingId(reference)) {
    return new Response(null, { status: 303, headers: { Location: '/book#booking-flow', 'Cache-Control': 'no-store' } })
  }

  const trackingId = readPesapalTrackingId(params.get('OrderTrackingId'))
  if (config && (callbackReference === null || trackingId)) {
    try {
      await reconcileStudioPayment(config, reference, trackingId ?? undefined)
    } catch {
      console.error('Pesapal checkout return could not verify the transaction')
    }
  }

  const query = new URLSearchParams({ tx_ref: reference })
  return new Response(null, { status: 303, headers: { Location: `/book/payment?${query}`, 'Cache-Control': 'no-store' } })
}
