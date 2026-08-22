import type { EmailAdapter } from '../interface'
import type { Booking } from '@/lib/types'

// Logs emails to the console until a real provider is wired up.
export const mockEmail: EmailAdapter = {
  async sendBookingReceived(booking: Booking) {
    console.log(`[EMAIL] Booking received → ${booking.email}`)
    console.log(`  Artist: ${booking.artist_name}`)
    console.log(`  Type: ${booking.type} | Starts: ${booking.starts_at}`)
    console.log(`  Total: UGX ${booking.total_amount.toLocaleString()} | Deposit: UGX ${booking.deposit_amount.toLocaleString()}`)
  },

  async sendBookingConfirmed(booking: Booking) {
    console.log(`[EMAIL] Booking confirmed → ${booking.email}`)
    console.log(`  Booking ID: ${booking.id}`)
  },

  async sendBookingCancelled(booking: Booking) {
    console.log(`[EMAIL] Booking cancelled → ${booking.email}`)
    console.log(`  Booking ID: ${booking.id}`)
  },

  async sendAdminNewBooking(booking: Booking) {
    console.log(`[EMAIL] New booking alert → admin`)
    console.log(`  From: ${booking.artist_name} (${booking.email})`)
    console.log(`  Type: ${booking.type} | Starts: ${booking.starts_at}`)
    console.log(`  Booking ID: ${booking.id}`)
  },
}
