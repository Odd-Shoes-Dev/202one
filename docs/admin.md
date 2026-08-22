# Admin Section

## Purpose

The admin section gives the 202One team full control over bookings and the public-facing content of the landing page — without touching code or redeploying.

Access is restricted to authenticated admin users. Route: `/admin`.

---

## Sections

### 1. Booking Management (`/admin/bookings`)

The primary view. Every booking flows through here.

**Calendar view**
- Visual grid of all slots: available, pending, confirmed, blocked
- Click a slot to see booking details or block it manually

**List view**
- Filter by status (pending / confirmed / completed / cancelled / failed)
- Filter by date range or service type (Space / Session / Production)
- Search by artist name or contact

**Booking detail**
- Artist name, contact, service type, date/time, duration
- Payment status (reservation paid / full payment / outstanding)
- Notes from the booking form
- Actions: Confirm, Cancel, Reschedule, Add note

**Manual controls**
- Block a slot (maintenance, private hold, admin reservation)
- Override payment status if payment was received outside the system

---

### 2. Content Management (`/admin/content`)

Controls what appears on the landing page. Changes go live immediately.

**Featured Session** (Sessions section on landing page)
- Title, artist name, description
- Video embed URL or upload
- Toggle: show / hide

**Upcoming Events** (Community section)
- Create, edit, delete events
- Fields: date, name, description, type (free / ticketed), RSVP link
- Toggle: show / hide individual events
- Events are also bookable/RSVP-able slots connected to the booking system

**Hero Text**
- Subheading below "Create here."
- The verb list (Rehearse · Record · Produce · Perform) — can add/remove verbs
- Mission statement (bottom of hero)

**Community Tags**
- The pill tags in the Community section (Open Studio Nights, Poet Nights, etc.)
- Add, remove, reorder

---

### 3. Pricing & Promotions (`/admin/pricing`)

**Base Rates**
- Edit rate for each tier: Space / Session / Production
- Edit the reservation fee (currently UGX 10,000)
- Changes apply to all future bookings immediately

**Active Promotions**
- Create a promotion: name, discount type (% or fixed amount), value, applicable tiers
- Set start and end date — promotion auto-expires
- A visible badge/label appears on the landing page while the promotion is active (e.g. "STUDENT DISCOUNT — OCT ONLY")
- Multiple promotions can be active simultaneously; the booking flow applies the best match

**Pricing Notes**
- The small note under each price card ("Tentative — subject to confirmation", "From — custom quote for full projects")
- Editable per tier

---

### 4. Sessions (`/admin/sessions`)

Manage the 202One Sessions series (the live recording content).

- Add a new session: title, artist, description, video URL, date recorded
- Set the featured session (which one shows on the landing page)
- Archive old sessions (hidden from landing page, kept in record)

---

## How Admin Connects to the Booking System

The admin section does not bypass the booking system — it works through the same service layer:

- Confirming a booking → calls `bookingService.updateStatus('confirmed')` → triggers email notification
- Blocking a slot → creates a booking with status `blocked` (same DB table, different type)
- Adding a promo → writes to the promotions table → booking flow reads it on next request
- Adding an event → creates an event record → landing page reads it, booking system exposes it as a bookable slot

---

## Auth

Admin routes (`/admin/*`) are protected. A non-authenticated request redirects to `/admin/login`.

Auth provider is TBD — decision deferred until the adapter layer is in place. The auth adapter will follow the same interface pattern as DB/email/payment.

Only one role for now: **admin**. Multi-role (e.g. engineer, manager) can be added later without structural changes.
