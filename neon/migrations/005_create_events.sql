-- Community events. Admin creates these. They appear on the landing page
-- and connect to the booking system as RSVP-able slots.

CREATE TABLE IF NOT EXISTS events (
  id          SERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  description TEXT        NOT NULL,
  event_date  TIMESTAMPTZ NOT NULL,
  is_free     BOOLEAN     NOT NULL DEFAULT TRUE,
  rsvp_link   TEXT,
  is_visible  BOOLEAN     NOT NULL DEFAULT TRUE,  -- admin can hide without deleting
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_date    ON events (event_date);
CREATE INDEX idx_events_visible ON events (is_visible);
