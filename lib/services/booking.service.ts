import { db } from '@/lib/adapters/db'
import { email } from '@/lib/adapters/email'
import { payment } from '@/lib/adapters/payment'
import type { Booking, BookingInput, BookingFilter } from '@/lib/types'

export const bookingService = {

  async create(data: BookingInput): Promise<{ booking: Booking; paymentIntent: { id: string; amount: number } }> {
    // 1. Create the booking in DB (status: pending)
    const booking = await db.createBooking(data)

    // 2. Create a payment intent for the deposit
    const intent = await payment.createPaymentIntent(booking.deposit_amount, booking.id)

    // 3. Notify the artist — booking received, payment instructions to follow
    await email.sendBookingReceived(booking)

    // 4. Notify the studio admin
    await email.sendAdminNewBooking(booking)

    return {
      booking,
      paymentIntent: { id: intent.id, amount: intent.amount },
    }
  },

  async confirm(id: string, adminNotes?: string): Promise<Booking> {
    const booking = await db.updateBookingStatus(id, 'confirmed', adminNotes)
    await email.sendBookingConfirmed(booking)
    return booking
  },

  async cancel(id: string, adminNotes?: string): Promise<Booking> {
    const booking = await db.updateBookingStatus(id, 'cancelled', adminNotes)
    await email.sendBookingCancelled(booking)
    return booking
  },

  async markDepositPaid(id: string, paymentRef: string): Promise<Booking> {
    return db.updateBookingPayment(id, {
      deposit_paid: true,
      payment_ref: paymentRef,
    })
  },

  async markFullyPaid(id: string): Promise<Booking> {
    return db.updateBookingPayment(id, { full_paid: true })
  },

  async complete(id: string): Promise<Booking> {
    return db.updateBookingStatus(id, 'completed')
  },

  async get(id: string): Promise<Booking | null> {
    return db.getBooking(id)
  },

  async list(filter?: BookingFilter): Promise<Booking[]> {
    return db.listBookings(filter)
  },

  // Returns pricing for a given tier, including any active promotions applied
  async calculateTotal(tier: string, durationHours: number): Promise<{
    rate: number
    duration: number
    subtotal: number
    discount: number
    total: number
    deposit: number
    promoApplied: string | null
  }> {
    const [pricingList, activePromos] = await Promise.all([
      db.listPricing(),
      db.listActivePromotions(),
    ])

    const pricing = pricingList.find(p => p.tier === tier)
    if (!pricing) throw new Error(`Unknown pricing tier: ${tier}`)

    const subtotal = pricing.rate * durationHours

    // Find the best applicable promotion
    const promo = activePromos.find(p =>
      p.applies_to === null || p.applies_to.includes(tier)
    ) ?? null

    let discount = 0
    if (promo) {
      discount = promo.discount_type === 'percentage'
        ? Math.round(subtotal * promo.discount_value / 100)
        : promo.discount_value
    }

    const total = Math.max(0, subtotal - discount)

    return {
      rate: pricing.rate,
      duration: durationHours,
      subtotal,
      discount,
      total,
      deposit: 10000,
      promoApplied: promo?.name ?? null,
    }
  },
}
