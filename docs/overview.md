# 202One Studio — Project Overview

## What is 202One?

202One is a professional creative studio space based in Kampala, Uganda, built for faith-driven creatives — musicians, producers, artists, storytellers, worship teams, filmmakers, and builders. The mission: **Raised here. Sent everywhere.**

The studio offers four core services:
- **Rehearse** — dedicated space for bands and worship teams
- **Record** — vocals, instruments, full recording sessions
- **Live** — multi-camera live session recordings
- **Produce** — arrangement, mixing, post-production

Beyond the studio, 202One is a community — hosting Open Studio Nights, Poet Nights, Listening Sessions, Masterclasses, and Pre-Concert Shows.

## What this web app does

The website serves two purposes simultaneously:

1. **Marketing / landing page** — introduces the space, the community, the sessions, and pricing to new visitors
2. **Booking platform** — allows artists and teams to reserve studio time, pay a deposit, and manage their session

The admin section gives the 202One team control over what appears on the landing page and how bookings are managed — without touching code.

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) | Full-stack, server actions, easy deployment |
| Styling | CSS Modules | Direct port of the prototype's design system; no utility-class translation needed |
| Fonts | Fraunces + Space Grotesk (via next/font) | Serif for soul, sans for clarity — established in the prototype |
| Database | Adapter pattern (provider TBD) | Easy to swap between Supabase, PlanetScale, Postgres, etc. |
| Email | Adapter pattern (provider TBD) | Swap between Resend, SendGrid, Nodemailer, etc. |
| Payments | Adapter pattern (provider TBD) | Mobile money (MTN/Airtel) + card; provider decided at integration time |
| Auth | TBD | Required for admin section and future user accounts |
| Deployment | TBD (Vercel recommended) | |

## Key design decisions

- The prototype (`studio.html`) is kept as a permanent reference file — do not delete it
- The landing page is **database-driven**: events, pricing, featured sessions, and promotions are all editable by the admin without code changes
- Themes: dark (default) and light — toggled per user, preference saved in localStorage
