CREATE TABLE IF NOT EXISTS studio_feedback (
  id          UUID PRIMARY KEY,
  message     TEXT NOT NULL CHECK (char_length(btrim(message)) BETWEEN 1 AND 2000),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS studio_feedback_created_at_idx
  ON studio_feedback (created_at DESC);
