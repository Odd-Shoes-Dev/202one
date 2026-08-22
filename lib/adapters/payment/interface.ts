export interface PaymentIntent {
  id: string
  amount: number       // in UGX
  currency: string
  status: 'pending' | 'paid' | 'failed'
  provider_ref: string | null
}

export interface PaymentAdapter {
  createPaymentIntent(amount: number, bookingId: string): Promise<PaymentIntent>
  getPaymentStatus(intentId: string): Promise<PaymentIntent>
}
