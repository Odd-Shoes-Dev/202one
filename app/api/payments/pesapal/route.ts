import { pesapalConfig, readPesapalTrackingId } from '@/lib/pesapal'
import { paymentBookingId, reconcileStudioPayment } from '@/lib/studio-payments'

type Notification = { OrderNotificationType?: unknown; OrderTrackingId?: unknown; OrderMerchantReference?: unknown }

async function handleNotification(notification: Notification | null) {
  const type = notification?.OrderNotificationType
  const trackingId = readPesapalTrackingId(notification?.OrderTrackingId)
  const reference = notification?.OrderMerchantReference
  if (type !== 'IPNCHANGE' || !trackingId || typeof reference !== 'string' || !paymentBookingId(reference)) {
    return new Response(null, { status: 400 })
  }

  let status = 500
  const config = pesapalConfig()
  if (config) {
    try {
      const payment = await reconcileStudioPayment(config, reference, trackingId)
      if (payment) status = 200
    } catch {
      console.error('Pesapal notification could not verify the transaction')
    }
  }

  return Response.json({
    orderNotificationType: type,
    orderTrackingId: trackingId,
    orderMerchantReference: reference,
    status,
  }, { status, headers: { 'Cache-Control': 'no-store' } })
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  return handleNotification({
    OrderNotificationType: params.get('OrderNotificationType'),
    OrderTrackingId: params.get('OrderTrackingId'),
    OrderMerchantReference: params.get('OrderMerchantReference'),
  })
}

export async function POST(request: Request) {
  let notification: Notification | null
  try {
    notification = await request.json() as Notification | null
  } catch {
    return new Response(null, { status: 400 })
  }
  return handleNotification(notification)
}
