import type { PaymentAdapter, PaymentIntent } from '../interface'

// Simulates payment intents for manual booking requests.
export const mockPayment: PaymentAdapter = {
  async createPaymentIntent(amount: number, bookingId: string): Promise<PaymentIntent> {
    console.log(`[PAYMENT] Intent created — UGX ${amount.toLocaleString()} for booking ${bookingId}`)
    return {
      id: `mock_intent_${Date.now()}`,
      amount,
      currency: 'UGX',
      status: 'pending',
      provider_ref: null,
    }
  },

  async getPaymentStatus(intentId: string): Promise<PaymentIntent> {
    console.log(`[PAYMENT] Status check — ${intentId}`)
    return {
      id: intentId,
      amount: 10000,
      currency: 'UGX',
      status: 'pending',
      provider_ref: null,
    }
  },
}
