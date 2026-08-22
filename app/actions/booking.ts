'use server'

import { bookingService } from '@/lib/services/booking.service'
import type { BookingInput } from '@/lib/types'

export async function createBooking(data: BookingInput) {
  try {
    const result = await bookingService.create(data)
    return { success: true, data: result }
  } catch (err) {
    console.error('[createBooking]', err)
    return { success: false, error: 'Failed to create booking. Please try again.' }
  }
}

export async function calculateBookingTotal(tier: string, durationHours: number) {
  try {
    const result = await bookingService.calculateTotal(tier, durationHours)
    return { success: true, data: result }
  } catch (err) {
    console.error('[calculateBookingTotal]', err)
    return { success: false, error: 'Failed to calculate total.' }
  }
}
