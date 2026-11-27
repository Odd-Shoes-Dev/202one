'use server'

import { pesapalConfig } from '@/lib/pesapal'
import { startStudioPayment } from '@/lib/studio-payments'

export async function openStudioCheckout(input: Parameters<typeof startStudioPayment>[1]): ReturnType<typeof startStudioPayment> {
  const config = pesapalConfig()
  if (!config) return { error: 'Pesapal checkout is unavailable.' }

  try {
    return await startStudioPayment(config, input)
  } catch {
    console.error('Could not start the Pesapal studio checkout')
    return { error: 'We could not open checkout. Please try again.' }
  }
}
