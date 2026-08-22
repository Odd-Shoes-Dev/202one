import { mockEmail } from './mock'
import type { EmailAdapter } from './interface'

// Swap this import when a real provider (Resend, SendGrid, etc.) is ready.
export const email: EmailAdapter = mockEmail
