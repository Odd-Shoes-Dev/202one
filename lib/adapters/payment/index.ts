import { mockPayment } from './mock'
import type { PaymentAdapter } from './interface'

// Swap this import when a real provider (Flutterwave, DPO Pay, etc.) is ready.
export const payment: PaymentAdapter = mockPayment
