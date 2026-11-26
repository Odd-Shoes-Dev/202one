// ── Bookings ──────────────────────────────────────────────────────────────────

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'failed' | 'blocked'
export type BookingType = 'space' | 'session' | 'production' | 'event' | 'blocked'

export interface Booking {
  id: string
  type: BookingType
  status: BookingStatus
  artist_name: string
  email: string
  phone: string | null
  notes: string | null
  starts_at: Date
  ends_at: Date
  rate_per_hour: number
  duration_hours: number
  total_amount: number
  deposit_amount: number
  deposit_paid: boolean
  full_paid: boolean
  payment_ref: string | null
  admin_notes: string | null
  created_at: Date
  updated_at: Date
}

export interface BookingInput {
  type: BookingType
  artist_name: string
  email: string
  phone?: string
  notes?: string
  starts_at: Date
  ends_at: Date
  rate_per_hour: number
  duration_hours: number
  total_amount: number
  deposit_amount?: number
}

export interface BookingFilter {
  status?: BookingStatus
  type?: BookingType
  from?: Date
  to?: Date
  email?: string
}

// ── Pricing ───────────────────────────────────────────────────────────────────

export interface PricingTier {
  id: number
  tier: string
  label: string
  tagline: string
  description: string
  rate: number
  note: string | null
  cta_label: string
  is_featured: boolean
  updated_at: Date
}

export interface PricingUpdate {
  rate?: number
  note?: string
  tagline?: string
  description?: string
  cta_label?: string
  is_featured?: boolean
}

// ── Promotions ────────────────────────────────────────────────────────────────

export type DiscountType = 'percentage' | 'fixed'

export interface Promotion {
  id: number
  name: string
  description: string | null
  discount_type: DiscountType
  discount_value: number
  applies_to: string[] | null
  badge_label: string | null
  is_active: boolean
  starts_at: Date
  ends_at: Date | null
  created_at: Date
}

export interface PromotionInput {
  name: string
  description?: string
  discount_type: DiscountType
  discount_value: number
  applies_to?: string[]
  badge_label?: string
  starts_at?: Date
  ends_at?: Date
}

// ── Events ────────────────────────────────────────────────────────────────────

export interface Event {
  id: number
  name: string
  description: string
  event_date: Date
  is_free: boolean
  rsvp_link: string | null
  is_visible: boolean
  created_at: Date
  updated_at: Date
}

export interface EventInput {
  name: string
  description: string
  event_date: Date
  is_free?: boolean
  rsvp_link?: string
  is_visible?: boolean
}

// ── Studio Sessions ───────────────────────────────────────────────────────────

export interface StudioFeedback {
  id: string
  message: string
  created_at: string
}

export interface StudioSession {
  id: number
  title: string
  artist_name: string
  description: string
  video_url: string | null
  recorded_at: Date | null
  is_featured: boolean
  is_visible: boolean
  created_at: Date
  updated_at: Date
}

export interface StudioSessionInput {
  title: string
  artist_name: string
  description: string
  video_url?: string
  recorded_at?: Date
  is_featured?: boolean
  is_visible?: boolean
}
