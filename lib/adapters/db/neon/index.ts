import { getSql } from '../client'
import type { DbAdapter } from '../interface'
import type {
  Booking, BookingInput, BookingFilter,
  PricingTier, PricingUpdate,
  Promotion, PromotionInput,
  Event, EventInput,
  StudioSession, StudioSessionInput, StudioFeedback,
} from '@/lib/types'

export const neonDb: DbAdapter = {
  async saveFeedback(id: string, message: string): Promise<void> {
    await getSql()`
      INSERT INTO studio_feedback (id, message)
      VALUES (${id}, ${message})
      ON CONFLICT (id) DO NOTHING
    `
  },

  async listFeedback(): Promise<StudioFeedback[]> {
    const rows = await getSql()`
      SELECT id, message, created_at
      FROM studio_feedback
      ORDER BY created_at DESC, id DESC
      LIMIT 100
    `
    return rows as StudioFeedback[]
  },

  // ── Bookings ───────────────────────────────────────────────────────────────

  async createBooking(data: BookingInput): Promise<Booking> {
    const rows = await getSql()`
      INSERT INTO bookings (
        type, artist_name, email, phone, notes,
        starts_at, ends_at,
        rate_per_hour, duration_hours, total_amount, deposit_amount
      ) VALUES (
        ${data.type}, ${data.artist_name}, ${data.email},
        ${data.phone ?? null}, ${data.notes ?? null},
        ${data.starts_at.toISOString()}, ${data.ends_at.toISOString()},
        ${data.rate_per_hour}, ${data.duration_hours}, ${data.total_amount},
        ${data.deposit_amount ?? 10000}
      )
      RETURNING *
    `
    return rows[0] as Booking
  },

  async getBooking(id: string): Promise<Booking | null> {
    const rows = await getSql()`SELECT * FROM bookings WHERE id = ${id}`
    return (rows[0] as Booking) ?? null
  },

  async listBookings(filter?: BookingFilter): Promise<Booking[]> {
    const rows = await getSql()`
      SELECT * FROM bookings
      WHERE
        (${filter?.status ?? null} IS NULL OR status = ${filter?.status ?? null}::booking_status)
        AND (${filter?.type ?? null} IS NULL OR type = ${filter?.type ?? null}::booking_type)
        AND (${filter?.email ?? null} IS NULL OR email = ${filter?.email ?? null})
        AND (${filter?.from?.toISOString() ?? null} IS NULL OR starts_at >= ${filter?.from?.toISOString() ?? null})
        AND (${filter?.to?.toISOString() ?? null} IS NULL OR starts_at <= ${filter?.to?.toISOString() ?? null})
      ORDER BY starts_at DESC
    `
    return rows as Booking[]
  },

  async updateBookingStatus(id: string, status: Booking['status'], adminNotes?: string): Promise<Booking> {
    const rows = await getSql()`
      UPDATE bookings
      SET status = ${status}::booking_status,
          admin_notes = COALESCE(${adminNotes ?? null}, admin_notes),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return rows[0] as Booking
  },

  async updateBookingPayment(id: string, fields: { deposit_paid?: boolean; full_paid?: boolean; payment_ref?: string }): Promise<Booking> {
    const rows = await getSql()`
      UPDATE bookings
      SET deposit_paid = COALESCE(${fields.deposit_paid ?? null}, deposit_paid),
          full_paid    = COALESCE(${fields.full_paid ?? null}, full_paid),
          payment_ref  = COALESCE(${fields.payment_ref ?? null}, payment_ref),
          updated_at   = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return rows[0] as Booking
  },

  // ── Pricing ────────────────────────────────────────────────────────────────

  async listPricing(): Promise<PricingTier[]> {
    const rows = await getSql()`SELECT * FROM pricing ORDER BY id`
    return rows as PricingTier[]
  },

  async updatePricing(tier: string, data: PricingUpdate): Promise<PricingTier> {
    const rows = await getSql()`
      UPDATE pricing
      SET rate        = COALESCE(${data.rate ?? null}, rate),
          note        = COALESCE(${data.note ?? null}, note),
          tagline     = COALESCE(${data.tagline ?? null}, tagline),
          description = COALESCE(${data.description ?? null}, description),
          cta_label   = COALESCE(${data.cta_label ?? null}, cta_label),
          is_featured = COALESCE(${data.is_featured ?? null}, is_featured),
          updated_at  = NOW()
      WHERE tier = ${tier}
      RETURNING *
    `
    return rows[0] as PricingTier
  },

  // ── Promotions ─────────────────────────────────────────────────────────────

  async listActivePromotions(): Promise<Promotion[]> {
    const rows = await getSql()`
      SELECT * FROM promotions
      WHERE is_active = TRUE
        AND starts_at <= NOW()
        AND (ends_at IS NULL OR ends_at >= NOW())
      ORDER BY created_at DESC
    `
    return rows as Promotion[]
  },

  async listAllPromotions(): Promise<Promotion[]> {
    const rows = await getSql()`SELECT * FROM promotions ORDER BY created_at DESC`
    return rows as Promotion[]
  },

  async createPromotion(data: PromotionInput): Promise<Promotion> {
    const rows = await getSql()`
      INSERT INTO promotions (
        name, description, discount_type, discount_value,
        applies_to, badge_label, starts_at, ends_at
      ) VALUES (
        ${data.name}, ${data.description ?? null},
        ${data.discount_type}::discount_type, ${data.discount_value},
        ${data.applies_to ?? null}, ${data.badge_label ?? null},
        ${data.starts_at?.toISOString() ?? 'NOW()'},
        ${data.ends_at?.toISOString() ?? null}
      )
      RETURNING *
    `
    return rows[0] as Promotion
  },

  async deactivatePromotion(id: number): Promise<void> {
    await getSql()`UPDATE promotions SET is_active = FALSE WHERE id = ${id}`
  },

  // ── Events ─────────────────────────────────────────────────────────────────

  async listVisibleEvents(): Promise<Event[]> {
    const rows = await getSql()`
      SELECT * FROM events
      WHERE is_visible = TRUE
      ORDER BY event_date ASC
    `
    return rows as Event[]
  },

  async listAllEvents(): Promise<Event[]> {
    const rows = await getSql()`SELECT * FROM events ORDER BY event_date ASC`
    return rows as Event[]
  },

  async createEvent(data: EventInput): Promise<Event> {
    const rows = await getSql()`
      INSERT INTO events (name, description, event_date, is_free, rsvp_link, is_visible)
      VALUES (
        ${data.name}, ${data.description}, ${data.event_date.toISOString()},
        ${data.is_free ?? true}, ${data.rsvp_link ?? null}, ${data.is_visible ?? true}
      )
      RETURNING *
    `
    return rows[0] as Event
  },

  async updateEvent(id: number, data: Partial<EventInput>): Promise<Event> {
    const rows = await getSql()`
      UPDATE events
      SET name        = COALESCE(${data.name ?? null}, name),
          description = COALESCE(${data.description ?? null}, description),
          event_date  = COALESCE(${data.event_date?.toISOString() ?? null}, event_date),
          is_free     = COALESCE(${data.is_free ?? null}, is_free),
          rsvp_link   = COALESCE(${data.rsvp_link ?? null}, rsvp_link),
          is_visible  = COALESCE(${data.is_visible ?? null}, is_visible),
          updated_at  = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return rows[0] as Event
  },

  async deleteEvent(id: number): Promise<void> {
    await getSql()`DELETE FROM events WHERE id = ${id}`
  },

  // ── Studio Sessions ────────────────────────────────────────────────────────

  async getFeaturedSession(): Promise<StudioSession | null> {
    const rows = await getSql()`
      SELECT * FROM studio_sessions
      WHERE is_featured = TRUE AND is_visible = TRUE
      LIMIT 1
    `
    return (rows[0] as StudioSession) ?? null
  },

  async listAllSessions(): Promise<StudioSession[]> {
    const rows = await getSql()`SELECT * FROM studio_sessions ORDER BY created_at DESC`
    return rows as StudioSession[]
  },

  async createSession(data: StudioSessionInput): Promise<StudioSession> {
    const rows = await getSql()`
      INSERT INTO studio_sessions (title, artist_name, description, video_url, recorded_at, is_featured, is_visible)
      VALUES (
        ${data.title}, ${data.artist_name}, ${data.description},
        ${data.video_url ?? null}, ${data.recorded_at?.toISOString() ?? null},
        ${data.is_featured ?? false}, ${data.is_visible ?? true}
      )
      RETURNING *
    `
    return rows[0] as StudioSession
  },

  async setFeaturedSession(id: number): Promise<void> {
    // Unfeature all, then feature the selected one
    await getSql()`UPDATE studio_sessions SET is_featured = FALSE`
    await getSql()`UPDATE studio_sessions SET is_featured = TRUE WHERE id = ${id}`
  },

  async updateSession(id: number, data: Partial<StudioSessionInput>): Promise<StudioSession> {
    const rows = await getSql()`
      UPDATE studio_sessions
      SET title       = COALESCE(${data.title ?? null}, title),
          artist_name = COALESCE(${data.artist_name ?? null}, artist_name),
          description = COALESCE(${data.description ?? null}, description),
          video_url   = COALESCE(${data.video_url ?? null}, video_url),
          recorded_at = COALESCE(${data.recorded_at?.toISOString() ?? null}, recorded_at),
          is_featured = COALESCE(${data.is_featured ?? null}, is_featured),
          is_visible  = COALESCE(${data.is_visible ?? null}, is_visible),
          updated_at  = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return rows[0] as StudioSession
  },
}
