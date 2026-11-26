# Database Migrations

## Setup

1. Create a Neon project at [neon.tech](https://neon.tech)
2. Copy the connection string from Neon dashboard → Connection Details
3. Paste it into `.env.local`:
   ```
   DATABASE_URL=postgresql://...
   ```

Each environment (dev, staging, prod) has its own `.env.local` pointing to its own Neon database. The runner always hits exactly the database you point it at.

---

## Running migrations

```bash
npm run migrate
```

The runner will:
1. Connect to the database in `DATABASE_URL`
2. Check which migrations have already been applied (tracked in `migrations_log` table)
3. Apply only the pending ones, in order
4. Stop immediately if any migration fails — the failed migration is not recorded, so you can fix and re-run

---

## Adding a new migration

1. Create a new file in `neon/migrations/` with the next number:
   ```
   007_add_column_to_bookings.sql
   ```
2. Write the SQL
3. Run `npm run migrate`

**Rules:**
- Files are numbered sequentially: `001_`, `002_`, `003_`, ...
- Once a file has been committed and run in any environment, **never edit it**
- If you need to change something, write a new migration file
- Never use the runner in a way that skips files — the order matters

---

## Migration files

| File | What it creates |
|---|---|
| `001_create_migrations_log.sql` | The `migrations_log` table that tracks what has run |
| `002_create_bookings.sql` | Core `bookings` table — the aggregate root |
| `003_create_pricing.sql` | Pricing tiers with default seed data |
| `004_create_promotions.sql` | Promotions and discounts |
| `005_create_events.sql` | Community events |
| `006_create_sessions.sql` | 202One Sessions (live recordings) |
| `007_create_feedback.sql` | Visitor submissions shown under Admin → Feedback |
| `008_create_studio_checkout_payments.sql` | Checkout holds, itemized quotes, and verified Flutterwave test payments |

---

## How the runner tracks what has run

Each database has a `migrations_log` table:

```sql
SELECT * FROM migrations_log ORDER BY applied_at;

 id | filename                          | applied_at
----+-----------------------------------+------------------------
  1 | 001_create_migrations_log.sql     | 2026-08-22 10:00:00+00
  2 | 002_create_bookings.sql           | 2026-08-22 10:00:01+00
  3 | 003_create_pricing.sql            | 2026-08-22 10:00:01+00
```

This table is per-database — prod and dev track independently. A migration that has run in prod will not re-run. A migration that is missing from dev will be applied when you run `npm run migrate` against dev.
