-- Promotions / discounts. Admin creates these with an expiry. The booking flow reads active ones.

CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');

CREATE TABLE IF NOT EXISTS promotions (
  id              SERIAL PRIMARY KEY,
  name            TEXT            NOT NULL,
  description     TEXT,
  discount_type   discount_type   NOT NULL,
  discount_value  INTEGER         NOT NULL, -- % or UGX fixed amount
  applies_to      TEXT[],                   -- array of tier names, NULL means all tiers
  badge_label     TEXT,                     -- text shown on landing page e.g. 'STUDENT DISCOUNT — OCT ONLY'
  is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
  starts_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  ends_at         TIMESTAMPTZ,              -- NULL means no expiry
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_promotions_active ON promotions (is_active, starts_at, ends_at);
