-- Tracks which migrations have run in this database.
-- This is always the first migration — it creates the table that records all others.

CREATE TABLE IF NOT EXISTS migrations_log (
  id          SERIAL PRIMARY KEY,
  filename    TEXT NOT NULL UNIQUE,
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
