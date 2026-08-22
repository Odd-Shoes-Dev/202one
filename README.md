# 202One Studio

A professional creative studio platform for faith-driven creatives in Kampala, Uganda.

**Raised here. Sent everywhere.**

---

## What this is

A Next.js web app that serves as both a marketing landing page and a booking platform for 202One Studio. Artists, musicians, producers, and worship teams can discover the space, explore pricing, and book studio time — while the 202One team manages everything through an admin section.

See [`docs/overview.md`](docs/overview.md) for the full project brief.

---

## Documentation

| Doc | What it covers |
|---|---|
| [`docs/overview.md`](docs/overview.md) | Project overview, tech stack, key decisions |
| [`docs/architecture.md`](docs/architecture.md) | Booking as aggregate root, adapter pattern, folder structure, backend separation strategy |
| [`docs/admin.md`](docs/admin.md) | Admin section — booking management, content control, pricing & promotions |

---

## Project Structure

```
202one/
├── app/                  ← Next.js pages and components
│   ├── components/       ← UI components (component + CSS module pairs)
│   ├── admin/            ← Admin section (protected)
│   ├── actions/          ← Server actions (thin wrappers over services)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/                  ← Business logic (Next.js-agnostic)
│   ├── services/         ← Core logic (booking, content, admin)
│   └── adapters/         ← Swappable providers (db, email, payment)
├── docs/                 ← Project documentation
├── public/
└── studio.html           ← Original design prototype — permanent reference
```

---

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Key Design Decisions

- **Booking is the aggregate root** — payments, notifications, calendar slots, and events all originate from a booking event
- **Adapter pattern** for all external providers — swap database, email, or payment provider with a one-file change
- **Backend-agnostic** — `lib/` contains no Next.js imports; it can be lifted into a separate backend without rewriting business logic
- **CSS Modules** — faithful to the prototype's design system; no utility-class translation
- **Database-driven landing page** — events, pricing, promotions, and featured sessions are all editable by the admin
