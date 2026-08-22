# Technical Architecture

## Core Principle: Booking as the Aggregate Root

Everything in this system originates from a booking. All other features — payments, email notifications, calendar slots, events, content visibility — are reactions to booking events. This is not incidental; it is the deliberate design of the system.

```
createBooking()
    ├── writes to DB
    ├── triggers payment request (mobile money / card)
    ├── on payment confirmed → emits booking.confirmed
    │       ├── sends email notification (artist + studio admin)
    │       ├── creates/blocks the calendar slot
    │       └── fires any future webhooks (Slack, sheets, etc.)
    └── on payment failed → emits booking.failed
            └── sends failure notification, releases the slot
```

**The rule:** `createBooking` is the only door in. Nothing writes a booking except through this function.

---

## Folder Structure

```
202one/
├── app/                        ← Next.js app (routing, pages, components)
│   ├── components/             ← UI components (one file + one CSS module each)
│   ├── admin/                  ← Admin section (protected routes)
│   ├── actions/                ← Server actions (thin — only translate request → service call)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── lib/                        ← All business logic (knows nothing about Next.js)
│   ├── services/
│   │   ├── booking.service.ts  ← Core booking logic lives here
│   │   ├── content.service.ts  ← Landing page content (events, pricing, promos)
│   │   └── admin.service.ts    ← Admin operations
│   └── adapters/
│       ├── db/                 ← Database adapter interface + implementations
│       ├── email/              ← Email adapter interface + implementations
│       └── payment/            ← Payment adapter interface + implementations
│
├── docs/                       ← Project documentation (this folder)
├── studio.html                 ← Original prototype — permanent reference, do not delete
└── public/
```

---

## The Adapter Pattern

Each external provider (database, email, payments) sits behind an interface. The service layer only talks to the interface — it never imports a specific provider directly.

```typescript
// The interface — defined once
interface DbAdapter {
  createBooking(data: BookingInput): Promise<Booking>
  getBooking(id: string): Promise<Booking | null>
  listBookings(filter?: BookingFilter): Promise<Booking[]>
  updateBookingStatus(id: string, status: BookingStatus): Promise<Booking>
}

// An implementation — swappable
class SupabaseDbAdapter implements DbAdapter { ... }
class PostgresDbAdapter implements DbAdapter { ... }

// The service only sees the interface
class BookingService {
  constructor(private db: DbAdapter, private email: EmailAdapter, private payment: PaymentAdapter) {}
  async create(data: BookingInput) { ... }
}
```

**Swapping a provider = one file change.** The service and the rest of the app are untouched.

---

## Separating the Backend Later

This structure is intentionally backend-agnostic. The rule that makes this possible:

> **Nothing in `app/` contains business logic. Nothing in `lib/` knows about Next.js.**

`app/actions/` are thin translators:
```typescript
// app/actions/booking.ts
'use server'
export async function bookStudio(data: BookingInput) {
  return bookingService.create(data)  // all logic is in the service
}
```

When a separate backend is needed:
1. Copy `lib/services/` and `lib/adapters/` into the new backend project
2. Write new entry points (Express routes, Fastify handlers, etc.) that call the same service functions
3. Switch the frontend from calling server actions to calling the API

No business logic needs to be rewritten. The shape of the data stays the same.

---

## Booking Status Flow

```
pending → confirmed → completed
    └──→ cancelled
    └──→ failed (payment)
```

Every other feature in the system reads or reacts to these statuses. The admin can also manually move a booking between statuses where appropriate.

---

## Content Architecture

The landing page is not hardcoded. Content that the admin can change is stored in the database and fetched at request time (or cached with revalidation):

| Content | Controlled by |
|---|---|
| Pricing tiers (rates, labels) | Admin → DB |
| Active promotions / discounts | Admin → DB (with expiry date) |
| Featured session (Sessions section) | Admin → DB |
| Upcoming events (Community section) | Admin → DB |
| Hero tagline / subtext | Admin → DB |
| Promo banners | Admin → DB |

Static content (the studio's story, pillars, space features) remains in code — it rarely changes and doesn't need admin control.
