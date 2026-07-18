# Architecture

## Overview

Visit Sri Lanka is a Next.js 15 (App Router) frontend, designed to plug
into a Spring Boot REST API later. Auth and data persistence run on
**MongoDB + Auth.js (NextAuth v5)** — migrated from an earlier
Supabase/PostgreSQL version; see git history if you need the old
Supabase-based files for reference.

## What's actually built vs. originally planned

Being direct about this, since project docs referenced phases as
"completed" ahead of when they were actually built in this conversation:

| Module | Status |
|---|---|
| Project setup, design tokens, base layout | Built |
| Trip Planner | Built (full wizard + mock generation logic) |
| Budget Calculator | Built (full calculator + boarding-pass summary) |
| Header / Footer / global navigation | Built — `(marketing)` and `/profile` routes share a `SiteChrome` (Header + Footer); `(auth)` routes intentionally opt out (full-bleed split layout) |
| Auth (Login/Register/Profile) | Built — real Auth.js + MongoDB Credentials auth (register → hash password → auto sign-in → /profile) |
| About / Contact pages | Built |
| SEO (sitemap, robots, JSON-LD, 404/error/loading) | Built |
| MongoDB client + Auth.js config + middleware | Built |
| Destinations / Hotels **data layer** (MongoDB queries) | Built |
| Destinations / Hotels **UI** (listing/detail pages, cards, filters) | **Not built** — no page consumes the data layer above yet |
| Favorites / Trip-plan **persistence API** (`/api/favorites`, `/api/trip-plans`) | Built |
| Profile page **actually calling** those APIs | **Not built** — `SavedTrips`/`FavoritePlaces`/`TravelHistory` still render mock data; only `ProfileCard` uses the real session user |
| Home page real content (hero, search, popular destinations, etc.) | **Not built** — still the Phase 0 verification placeholder |

## Data flow

```
Component
   │
   ▼
lib/api/*.ts
   │
   ├── destinations.ts, hotels.ts   → direct MongoDB queries (server-only)
   ├── favorites.ts, tripPlans.ts   → fetch() calls to /api/* route handlers
   └── budget.ts, itinerary.ts      → pure client-side logic, no DB at all
```

Important difference from the old Supabase version: **MongoDB has no
client-safe direct-query layer** (no RLS-protected REST endpoint the way
Supabase's PostgREST provides). `destinations.ts`/`hotels.ts` query MongoDB
directly but must only ever be called from Server Components or Route
Handlers — never from a `"use client"` component. `favorites.ts` and
`tripPlans.ts` are `"use client"` files precisely because they're called
from interactive components, so they go through `/api/favorites` and
`/api/trip-plans` instead, which derive the current user from the
server-side session rather than trusting a client-supplied id.

## Auth flow

```
RegisterForm
   │
   ▼
POST /api/register  →  bcrypt.hash(password)  →  insert into `users`
   │
   ▼
useAuth().register() then calls signIn("credentials", ...) automatically
   │
   ▼
LoginForm / any later login
   │
   ▼
hooks/useAuth.ts (next-auth/react useSession/signIn/signOut)
   │
   ▼
src/auth.ts Credentials.authorize() → bcrypt.compare() against `users.passwordHash`
   │
   ▼
JWT session (no `sessions` collection involved — see docs/database.md)
   │
   ▼
middleware.ts (`export { auth as middleware }`) protects/refreshes on every request
```

There's no email-confirmation step — Credentials-based auth doesn't have
one built in the way Supabase Auth did. Adding real email verification is
listed under "Known gaps" below.

## Folder structure

See the root Architecture doc for the full original rationale; current
additions on top of that plan:

```
src/
├── auth.ts                    # Auth.js config (Credentials provider, MongoDB adapter)
├── middleware.ts               # `export { auth as middleware }`
├── lib/
│   ├── mongodb.ts              # MongoClient singleton (dev-safe, lazy-fails if unconfigured)
│   ├── seo/
│   │   └── schema.ts           # JSON-LD builders
│   └── api/
│       ├── destinations.ts     # MongoDB-backed, server-only (no UI yet)
│       ├── hotels.ts           # MongoDB-backed, server-only (no UI yet)
│       ├── favorites.ts        # "use client" fetch wrapper → /api/favorites
│       ├── tripPlans.ts        # "use client" fetch wrapper → /api/trip-plans
│       ├── budget.ts           # pure logic, no DB
│       └── itinerary.ts        # pure logic, no DB
├── app/
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── register/route.ts
│       ├── favorites/route.ts
│       └── trip-plans/route.ts
└── types/
    └── next-auth.d.ts          # Session/User/JWT type augmentation
```

## Known gaps before production

1. No Destinations/Hotels UI, despite the data layer existing
2. Profile page doesn't call `/api/favorites` or `/api/trip-plans` yet —
   `ProfileCard` shows the real user, but the three tabs below it are mock
3. No email verification on registration (Credentials auth has none built
   in — would need a custom token + email-sending step)
4. No password reset flow
5. `src/auth.ts` / MongoDB queries are written correctly against current
   library APIs but genuinely untested — no network access in the build
   environment to run this against a real MongoDB Atlas cluster
6. Home page is still the Phase 0 placeholder, not real hero/search/content
7. `AUTH_SECRET` must be set before deploying — Auth.js will refuse to
   start in production without one (dev auto-generates a throwaway one)
