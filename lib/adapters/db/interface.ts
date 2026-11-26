import type {
  Booking, BookingInput, BookingFilter,
  PricingTier, PricingUpdate,
  Promotion, PromotionInput,
  Event, EventInput,
  StudioSession, StudioSessionInput, StudioFeedback,
} from '@/lib/types'

export interface DbAdapter {
  // Visitor Feedback
  saveFeedback(id: string, message: string): Promise<void>
  listFeedback(): Promise<StudioFeedback[]>

  // Bookings
  createBooking(data: BookingInput): Promise<Booking>
  getBooking(id: string): Promise<Booking | null>
  listBookings(filter?: BookingFilter): Promise<Booking[]>
  updateBookingStatus(id: string, status: Booking['status'], adminNotes?: string): Promise<Booking>
  updateBookingPayment(id: string, fields: { deposit_paid?: boolean; full_paid?: boolean; payment_ref?: string }): Promise<Booking>

  // Pricing
  listPricing(): Promise<PricingTier[]>
  updatePricing(tier: string, data: PricingUpdate): Promise<PricingTier>

  // Promotions
  listActivePromotions(): Promise<Promotion[]>
  listAllPromotions(): Promise<Promotion[]>
  createPromotion(data: PromotionInput): Promise<Promotion>
  deactivatePromotion(id: number): Promise<void>

  // Events
  listVisibleEvents(): Promise<Event[]>
  listAllEvents(): Promise<Event[]>
  createEvent(data: EventInput): Promise<Event>
  updateEvent(id: number, data: Partial<EventInput>): Promise<Event>
  deleteEvent(id: number): Promise<void>

  // Studio Sessions
  getFeaturedSession(): Promise<StudioSession | null>
  listAllSessions(): Promise<StudioSession[]>
  createSession(data: StudioSessionInput): Promise<StudioSession>
  setFeaturedSession(id: number): Promise<void>
  updateSession(id: number, data: Partial<StudioSessionInput>): Promise<StudioSession>
}
