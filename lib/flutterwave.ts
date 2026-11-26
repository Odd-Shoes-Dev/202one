import { createHmac, timingSafeEqual } from 'node:crypto'

export function flutterwaveConfig() {
  const key = process.env.FLUTTERWAVE_SECRET_KEY?.trim()
  const webhookSecret = process.env.FLUTTERWAVE_WEBHOOK_SECRET?.trim()
  const returnUrl = process.env.FLUTTERWAVE_RETURN_URL?.trim()
  if (!process.env.DATABASE_URL || !key?.startsWith('FLWSECK_TEST') || !webhookSecret || !returnUrl) return null

  try {
    const url = new URL(returnUrl)
    const local = ['localhost', '127.0.0.1'].includes(url.hostname)
    if (url.pathname !== '/book/payment/confirm' || url.username || url.password || url.search || url.hash) return null
    if (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) return null
    return { key, webhookSecret, returnUrl: url.href }
  } catch {
    return null
  }
}

type Config = NonNullable<ReturnType<typeof flutterwaveConfig>>
export const checkoutMinutes = 15

export class FlutterwaveError extends Error {
  constructor(readonly status: number) {
    super(`Flutterwave request failed (${status})`)
  }
}

async function request<T>(config: Config, path: string, body?: object) {
  const response = await fetch(`https://api.flutterwave.com/v3/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${config.key}`, 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
    cache: 'no-store',
  })
  if (!response.ok) throw new FlutterwaveError(response.status)
  return await response.json() as { status: string; data?: T }
}

export async function createFlutterwaveLink(config: Config, reference: string, amount: number, customer: { name: string; email: string }, deposit: boolean) {
  const result = await request<{ link?: string }>(config, 'payments', {
    tx_ref: reference,
    amount,
    currency: 'UGX',
    redirect_url: config.returnUrl,
    customer,
    payment_options: 'mobilemoneyuganda,card',
    configurations: { session_duration: checkoutMinutes },
    customizations: { title: '202One Studio', description: deposit ? 'Studio booking deposit (test)' : 'Studio booking (test)' },
  })
  if (result.status !== 'success' || !result.data?.link) throw new Error('Flutterwave did not return a checkout link')

  const link = new URL(result.data.link)
  if (link.origin !== 'https://checkout.flutterwave.com' || link.username || link.password || !link.pathname.startsWith('/v3/hosted/pay/')) {
    throw new Error('Unexpected Flutterwave checkout URL')
  }
  return link.href
}

export async function verifiedFlutterwavePayment(config: Config, reference: string, amount: number, transactionId?: string) {
  const path = transactionId && /^\d{1,20}$/.test(transactionId)
    ? `transactions/${transactionId}/verify`
    : `transactions/verify_by_reference?${new URLSearchParams({ tx_ref: reference })}`
  try {
    const result = await request<{ id: number; tx_ref: string; currency: string; status: string; amount: number }>(config, path)
    const data = result.data
    if (result.status !== 'success' || data?.status !== 'successful') return null
    if (data.tx_ref !== reference || (transactionId && String(data.id) !== transactionId)) return null
    if (!Number.isSafeInteger(data.id) || data.id <= 0) return null
    if (data.currency !== 'UGX' || data.amount !== amount) return { id: String(data.id), matches: false }
    return { id: String(data.id), matches: true }
  } catch (error) {
    if (error instanceof FlutterwaveError && [400, 404].includes(error.status)) return null
    throw error
  }
}

export function validFlutterwaveSignature(config: Config, body: string, headers: Headers) {
  const signature = headers.get('flutterwave-signature')
  const expected = signature !== null
    ? createHmac('sha256', config.webhookSecret).update(body).digest('base64')
    : config.webhookSecret
  const actual = Buffer.from(signature ?? headers.get('verif-hash') ?? '')
  const expectedBytes = Buffer.from(expected)
  return actual.length === expectedBytes.length && timingSafeEqual(actual, expectedBytes)
}
