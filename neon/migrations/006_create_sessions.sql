-- 202One Sessions — the live recording series featured on the landing page.

CREATE TABLE IF NOT EXISTS studio_sessions (
  id            SERIAL PRIMARY KEY,
  title         TEXT        NOT NULL,
  artist_name   TEXT        NOT NULL,
  description   TEXT        NOT NULL,
  video_url     TEXT,
  recorded_at   TIMESTAMPTZ,
  is_featured   BOOLEAN     NOT NULL DEFAULT FALSE, -- only one should be TRUE at a time
  is_visible    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed the placeholder session from the prototype
INSERT INTO studio_sessions (title, artist_name, description, is_featured, is_visible) VALUES
  ('Steady', 'Naomi K.', 'A single take, one mic, the room lights low. Recorded live in the main studio as part of the ongoing 202One Sessions series.', TRUE, TRUE);
