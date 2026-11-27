import 'server-only'

const apiOrigins = {
  sandbox: 'https://cybqa.pesapal.com/pesapalv3/api/',
  live: 'https://pay.pesapal.com/v3/api/',
}

export type PesapalEnvironment = keyof typeof apiOrigins
export type PesapalConfig = {
  environment: PesapalEnvironment
  consumerKey: string
  consumerSecret: string
  notificationId: string
  siteOrigin: string
  apiBase: string
}
export const checkoutMinutes = 15

export function readPesapalTrackingId(value: unknown) {
  return typeof value === 'string' && /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(value)
    ? value.toLowerCase()
    : null
}

export function pesapalConfig(): PesapalConfig | null {
  const environment = process.env.PESAPAL_ENVIRONMENT?.trim()
  const consumerKey = process.env.PESAPAL_CONSUMER_KEY?.trim()
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET?.trim()
  const notificationId = readPesapalTrackingId(process.env.PESAPAL_IPN_ID?.trim())
  const siteUrl = process.env.PESAPAL_SITE_URL?.trim()

  if ((environment !== 'sandbox' && environment !== 'live') || !process.env.DATABASE_URL?.trim()
    || !consumerKey || !consumerSecret || !notificationId || !siteUrl) return null

  try {
    const site = new URL(siteUrl)
    if (site.protocol !== 'https:' || site.pathname !== '/' || site.username || site.password || site.search || site.hash) return null
    return { environment, consumerKey, consumerSecret, notificationId, siteOrigin: site.origin, apiBase: apiOrigins[environment] }
  } catch {
    return null
  }
}

export class PesapalCheckoutRejected extends Error {}

class PesapalRequestError extends Error {
  constructor(readonly status: number) {
    super(`Pesapal request failed (${status})`)
  }
}

type ApiResponse = { status?: string | number; error?: { code?: string; message?: string; error_type?: string; type?: string } | null }

async function request<T>(config: PesapalConfig, path: string, options: { body?: object; token?: string }) {
  const { body, token } = options
  const headers = new Headers({ Accept: 'application/json', 'Content-Type': 'application/json' })
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(new URL(path, config.apiBase), {
    method: body ? 'POST' : 'GET',
    headers,
    body: body && JSON.stringify(body),
    redirect: 'error',
    signal: AbortSignal.timeout(8000),
    cache: 'no-store',
  })
  if (!response.ok) throw new PesapalRequestError(response.status)

  const result = await response.json() as (T & ApiResponse) | null
  if (String(result?.status) !== '200' || result?.error?.code || result?.error?.message
    || result?.error?.error_type || result?.error?.type) {
    const status = Number(result?.status)
    throw new PesapalRequestError(status >= 400 && status <= 599 ? status : 502)
  }
  return result as T
}

async function requestToken(config: PesapalConfig) {
  const result = await request<{ token?: string }>(config, 'Auth/RequestToken', {
    body: { consumer_key: config.consumerKey, consumer_secret: config.consumerSecret },
  })
  if (typeof result.token !== 'string' || !result.token) throw new Error('Pesapal did not return an access token')
  return result.token
}

export async function createPesapalCheckout(config: PesapalConfig, reference: string, amount: number, customer: { name: string; email: string }, deposit: boolean) {
  let token: string
  try {
    token = await requestToken(config)
  } catch (cause) {
    throw new PesapalCheckoutRejected('Pesapal authentication failed', { cause })
  }

  const [firstName, ...lastName] = customer.name.split(/\s+/)
  const result = await request<{ order_tracking_id?: string; merchant_reference?: string; redirect_url?: string }>(config, 'Transactions/SubmitOrderRequest', {
    token,
    body: {
      id: reference,
      currency: 'UGX',
      amount,
      description: deposit ? '202One Studio booking deposit' : '202One Studio booking',
      callback_url: `${config.siteOrigin}/book/payment/confirm`,
      notification_id: config.notificationId,
      billing_address: {
        email_address: customer.email,
        country_code: 'UG',
        first_name: firstName,
        last_name: lastName.join(' '),
      },
    },
  }).catch((error: unknown) => {
    if (error instanceof PesapalRequestError && [400, 401, 403, 404, 422].includes(error.status)) {
      throw new PesapalCheckoutRejected(error.message, { cause: error })
    }
    throw error
  })

  const trackingId = readPesapalTrackingId(result.order_tracking_id)
  if (!trackingId || result.merchant_reference !== reference || typeof result.redirect_url !== 'string') {
    throw new Error('Pesapal did not return the expected checkout details')
  }
  const link = new URL(result.redirect_url)
  if (link.origin !== new URL(config.apiBase).origin || link.username || link.password) {
    throw new Error('Unexpected Pesapal checkout URL')
  }
  return { trackingId, url: link.href }
}

export async function verifyPesapalPayment(config: PesapalConfig, trackingId: string, reference: string, amount: number) {
  const token = await requestToken(config)
  const query = new URLSearchParams({ orderTrackingId: trackingId })
  const result = await request<{ status_code?: number | string; merchant_reference?: string; currency?: string; amount?: number | string }>(
    config, `Transactions/GetTransactionStatus?${query}`, { token },
  )
  if (result.merchant_reference !== reference) return null

  switch (String(result.status_code)) {
    case '1':
      return result.currency === 'UGX' && Number(result.amount) === amount ? 'completed' : 'mismatch'
    case '3':
      return 'reversed'
    case '0':
    case '2':
      return 'unpaid'
    default:
      throw new Error('Unknown Pesapal payment status')
  }
}
