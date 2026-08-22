-- Core bookings table. Everything in the system originates from a booking.

CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'failed',
  'blocked'
);

CREATE TYPE booking_type AS ENUM (
  'space',
  'session',
  'production',
  'event',
  'blocked'
);

CREATE TABLE IF NOT EXISTS bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            booking_type    NOT NULL,
  status          booking_status  NOT NULL DEFAULT 'pending',

  -- who is booking
  artist_name     TEXT            NOT NULL,
  email           TEXT            NOT NULL,
  phone           TEXT,
  notes           TEXT,

  -- when
  starts_at       TIMESTAMPTZ     NOT NULL,
  ends_at         TIMESTAMPTZ     NOT NULL,

  -- pricing at time of booking (snapshot — not a live FK, so price changes don't affect past bookings)
  rate_per_hour   INTEGER         NOT NULL, -- in UGX
  duration_hours  NUMERIC(4,1)    NOT NULL,
  total_amount    INTEGER         NOT NULL, -- in UGX
  deposit_amount  INTEGER         NOT NULL DEFAULT 10000, -- in UGX

  -- payment
  deposit_paid    BOOLEAN         NOT NULL DEFAULT FALSE,
  full_paid       BOOLEAN         NOT NULL DEFAULT FALSE,
  payment_ref     TEXT,

  -- admin
  admin_notes     TEXT,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_status   ON bookings (status);
CREATE INDEX idx_bookings_starts_at ON bookings (starts_at);
CREATE INDEX idx_bookings_email    ON bookings (email);
