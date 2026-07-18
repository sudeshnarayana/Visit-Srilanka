# Visit Sri Lanka — Frontend

A tourism platform helping travelers discover Sri Lanka's beaches, wildlife,
heritage sites, and mountains — plan itineraries, estimate trip budgets, and
manage a travel profile.

> **Honest status check**: this README describes what's actually built, not
> the full original product vision. See "What's not here yet" below and
> `../docs/architecture.md` for the complete gap list.

## Features (built)

- **Trip Planner** — 5-step wizard (destinations → duration → travel style
  → budget → generated day-by-day itinerary)
- **Budget Calculator** — live cost breakdown by category, USD/LKR toggle,
  boarding-pass-style summary card
- **Authentication** — login/register UI wired to real Auth.js (NextAuth v5)
  + MongoDB Credentials auth (bcrypt-hashed passwords, JWT sessions),
  profile page shows the real signed-in user
- **About & Contact pages** — mission, stats, team sections; validated
  contact form
- **SEO** — sitemap.xml, robots.txt, per-page metadata, Open Graph/Twitter
  cards, Organization JSON-LD, schema builders ready for Destinations/Hotels
  detail pages
- **Error handling** — custom 404, global loading state, error boundary

## Features (planned, not built)

- Destinations & Hotels listing/detail pages (data layer exists in
  `lib/api/destinations.ts` / `hotels.ts`, no UI consumes it yet)
- Global Header/Footer navigation
- Home page real content (currently a Phase 0 verification placeholder)
- PWA, i18n (next-intl), Spring Boot API integration

## Tech Stack

- **Framework**: Next.js 15 (App Router), TypeScript, React 19
- **Styling**: Tailwind CSS v3, shadcn/ui (new-york style)
- **Motion**: Framer Motion
- **Icons**: Lucide React
- **Validation**: Zod
- **Backend**: MongoDB + Auth.js (NextAuth v5) — see `../docs/database.md`
- **Analytics**: Vercel Analytics + Google Analytics 4 (optional, env-gated)
- **Fonts**: Playfair Display (headings), Inter (body)

## Installation

```bash
npm install
cp .env.example .env.local
# fill in MONGODB_URI and AUTH_SECRET
# (see ../docs/database.md to set up the MongoDB Atlas cluster first)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without `MONGODB_URI` set, the app still builds and most pages render —
Trip Planner and Budget Calculator work with zero backend since they're
pure client-side logic — but Login/Register/Profile will fail at runtime.

## Screenshots

_Add screenshots here after your first deploy — none are included in this
scaffold since there's no rendering environment available to generate real
ones._

## Deployment

See `../docs/deployment.md` for the full Vercel + MongoDB Atlas production
checklist.

## Folder Structure

See `../docs/architecture.md` for the current, accurate structure and data
flow diagrams.

## Design Tokens

Defined as CSS variables in `src/app/globals.css`, exposed as Tailwind
utilities in `tailwind.config.ts`:

- `bg-ocean-500`, `text-ocean-700` — beaches, water, primary actions
- `bg-forest-600`, `text-forest-700` — wildlife, nature, secondary actions
- `bg-sand-500`, `text-sand-600` — heritage, luxury, accents
- `font-display` (Playfair Display) for headings, `font-sans` (Inter) for body
