# Visit Sri Lanka — Website (Phase 0)

Modern tourism platform for Sri Lanka. This is the Phase 0 scaffold: project
structure, design tokens, and base layout — no page designs yet (see the
Architecture & Development Roadmap document for the full plan).

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v3 + shadcn/ui (new-york style)
- Framer Motion, Lucide React
- Fonts: Playfair Display (headings) + Inter (body)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) — you should see a
   verification page confirming fonts, color tokens, and shadcn/ui Button
   variants (ocean / forest / sand) are working.

## Adding more shadcn/ui components later

This project is already configured for the shadcn CLI (`components.json`).
Once you have network access, add more primitives with:

```bash
npx shadcn@latest add input dialog dropdown-menu select badge avatar
```

They'll land in `src/components/ui/` alongside the existing `button.tsx` and
`card.tsx`, using the same design tokens automatically.

## Folder Structure

See the Architecture doc for the full rationale. Summary:

```
src/
├── app/                  # Routes ((marketing) and (auth) route groups)
├── components/
│   ├── ui/               # shadcn primitives
│   ├── layout/            # Header, Footer, MobileNav
│   ├── home/              # Home page sections
│   ├── destinations/
│   ├── hotels/
│   ├── trip-planner/
│   ├── budget/
│   ├── shared/            # SectionHeading, RatingStars, PriceTag, etc.
│   └── forms/
├── lib/
│   ├── api/                # Data-fetching abstraction (swappable backend)
│   └── validations/        # zod schemas
├── types/                  # Shared TypeScript interfaces
├── data/                   # Mock JSON until Supabase is wired (Phase 9)
├── hooks/
└── styles/
```

## Design Tokens

Defined as CSS variables in `src/app/globals.css` and exposed as Tailwind
utilities in `tailwind.config.ts`:

- `bg-ocean-500`, `text-ocean-700`, etc. — beaches, water, primary actions
- `bg-forest-600`, `text-forest-700`, etc. — wildlife, nature, secondary actions
- `bg-sand-500`, `text-sand-600`, etc. — heritage, luxury, accents
- `font-display` (Playfair Display) for headings, `font-sans` (Inter) for body

## What's Not Here Yet

- Page designs (Home, Destinations, Hotels, etc.) — Phase 2+
- PWA (`next-pwa`/Serwist), i18n (`next-intl`), Analytics — later phases per
  the roadmap
- Real data (Supabase) — currently no `data/*.json` populated yet either;
  add mock content when building Phase 3+
