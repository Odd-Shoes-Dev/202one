-- Pricing tiers. Admin can update rates and notes. Changes apply to future bookings only.

CREATE TABLE IF NOT EXISTS pricing (
  id          SERIAL PRIMARY KEY,
  tier        TEXT    NOT NULL UNIQUE, -- 'space' | 'session' | 'production'
  label       TEXT    NOT NULL,        -- display name e.g. 'SPACE'
  tagline     TEXT    NOT NULL,        -- e.g. 'Come use the room.'
  description TEXT    NOT NULL,
  rate        INTEGER NOT NULL,        -- per hour in UGX
  note        TEXT,                    -- e.g. 'Tentative — subject to confirmation'
  cta_label   TEXT    NOT NULL,        -- button label e.g. 'Book Space'
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default pricing
INSERT INTO pricing (tier, label, tagline, description, rate, note, cta_label, is_featured) VALUES
  ('space',      'SPACE',      'Come use the room.',      'For rehearsals, songwriting, practice and self-directed sessions. Bring your own instruments or use ours.',                               35000, 'Tentative — subject to confirmation',          'Book Space',      FALSE),
  ('session',    'SESSION',    'Come make the record.',   'Studio time plus engineer and producer assistance. For recording vocals, instruments and full songs.',                                   60000, 'Tentative — subject to confirmation',          'Book a Session',  TRUE),
  ('production', 'PRODUCTION', 'Come finish the work.',   'Full recording, editing, arrangement, vocal tuning and mixing. For complete, release-ready tracks.',                                   100000, 'From — custom quote for full projects',        'Talk to Us',      FALSE);
