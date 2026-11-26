CREATE TABLE studio_checkout_payments (
  booking_id UUID PRIMARY KEY REFERENCES bookings(id) ON DELETE CASCADE,
  request_hash TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  items JSONB NOT NULL,
  hold_until TIMESTAMPTZ NOT NULL,
  checkout_url TEXT,
  state TEXT NOT NULL DEFAULT 'pending' CHECK (state IN ('pending', 'paid', 'review')),
  flutterwave_id TEXT UNIQUE,
  verified_at TIMESTAMPTZ
);
