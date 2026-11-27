import { mockPayment } from './mock'
import type { PaymentAdapter } from './interface'

// The manual booking request flow uses the mock. Studio checkout is handled in lib/studio-payments.ts.
export const payment: PaymentAdapter = mockPayment
