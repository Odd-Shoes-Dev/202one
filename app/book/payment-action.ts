'use server'

import { flutterwaveConfig } from '@/lib/flutterwave'
import { startStudioPayment } from '@/lib/studio-payments'

export async function openStudioCheckout(input: Parameters<typeof startStudioPayment>[1]): ReturnType<typeof startStudioPayment> {
  const config = flutterwaveConfig()
  if (!config) return { error: 'Flutterwave test checkout is unavailable.' }

  try {
    return await startStudioPayment(config, input)
  } catch {
    console.error('Could not start the studio test checkout')
    return { error: 'We could not open the test checkout. Please try again.' }
  }
}
