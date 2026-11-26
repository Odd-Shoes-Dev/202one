import { flutterwaveConfig, validFlutterwaveSignature } from '@/lib/flutterwave'
import { reconcileStudioPayment } from '@/lib/studio-payments'

export async function POST(request: Request) {
  const config = flutterwaveConfig()
  if (!config) return new Response(null, { status: 503 })

  const body = await request.text()
  if (!validFlutterwaveSignature(config, body, request.headers)) return new Response(null, { status: 401 })

  let notification: { event?: string; data?: { id?: number; tx_ref?: string; status?: string } } | null
  try {
    notification = JSON.parse(body)
  } catch {
    return new Response(null, { status: 400 })
  }

  const data = notification?.data
  if (notification?.event !== 'charge.completed' || data?.status !== 'successful' || typeof data.tx_ref !== 'string') {
    return new Response(null, { status: 200 })
  }

  try {
    const payment = await reconcileStudioPayment(config, data.tx_ref, data.id ? String(data.id) : undefined)
    return new Response(null, { status: payment?.state === 'pending' ? 503 : 200 })
  } catch {
    console.error('Studio checkout webhook could not verify the transaction')
    return new Response(null, { status: 503 })
  }
}
