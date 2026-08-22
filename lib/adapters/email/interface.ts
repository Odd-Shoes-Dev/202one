import type { Booking } from '@/lib/types'

export interface EmailAdapter {
  sendBookingReceived(booking: Booking): Promise<void>   // to artist
  sendBookingConfirmed(booking: Booking): Promise<void>  // to artist
  sendBookingCancelled(booking: Booking): Promise<void>  // to artist
  sendAdminNewBooking(booking: Booking): Promise<void>   // to studio admin
}
