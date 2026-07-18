# Deployment

## Frontend → Vercel

1. Push `frontend/` to a Git repository (or connect the monorepo and set
   Vercel's **Root Directory** to `frontend/`)
2. Import the repo in Vercel → Framework preset auto-detects Next.js
3. Set environment variables in **Project Settings → Environment Variables**
   (Production + Preview):

   ```
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   MONGODB_URI=mongodb+srv://...
   AUTH_SECRET=                    (generate with: npx auth secret)
   NEXT_PUBLIC_GA_ID=              (optional)
   ```

4. Build settings: defaults are correct (`next build`, output detected
   automatically). No custom build command needed.
5. Domain: add your custom domain under **Project Settings → Domains**,
   update DNS per Vercel's instructions, and update
   `NEXT_PUBLIC_SITE_URL` to match (this feeds `sitemap.ts`, `robots.ts`,
   and Open Graph URLs). Auth.js infers its own callback URL from the
   incoming request on Vercel, so `AUTH_URL` usually isn't needed there.
6. Vercel Analytics: enable in **Project Settings → Analytics** — the
   `<Analytics />` component is already in `layout.tsx`, it just needs the
   project-level toggle on.

## Database → MongoDB Atlas

1. Create a **production** Atlas cluster (separate from any dev/staging
   cluster) at mongodb.com/atlas
2. Create a database user with a strong, generated password (not the same
   one used for dev)
3. Under **Network Access**, add Vercel's IP ranges or (simpler, common
   for serverless platforms) allow access from anywhere (`0.0.0.0/0`) —
   MongoDB auth still requires the correct username/password either way,
   but restrict further if your Atlas tier supports VPC peering
4. Copy the connection string from **Connect → Drivers** into Vercel's
   `MONGODB_URI`
5. Create the indexes listed in `docs/database.md` (`mongosh` or Compass)
   — MongoDB doesn't enforce uniqueness (e.g. on `users.email`) without an
   explicit unique index
6. Storage: MongoDB has no built-in object storage — decide on S3,
   Cloudinary, or similar before real destination/hotel photos are needed,
   and add that host to `next.config.ts`'s `images.remotePatterns`

## Backend (Spring Boot) — not yet deployed

The `/backend` skeleton isn't part of this deployment yet (frontend doesn't
call it). When it's built out, any JVM-friendly host works (Railway,
Render, Fly.io, or a traditional VPS) — document the chosen host here once
decided.

## Pre-launch checklist

- [ ] All env vars set in Vercel (Production **and** Preview environments),
      especially `AUTH_SECRET` — Auth.js refuses to start in production
      without one
- [ ] MongoDB Atlas Network Access configured (not left wide open without
      understanding the tradeoff)
- [ ] Unique index on `users.email` created — without it, duplicate
      accounts can be created if two requests race
- [ ] `NEXT_PUBLIC_SITE_URL` matches the real domain
- [ ] Run `npm run build` locally at least once to catch build-time errors
      the dev server doesn't surface
- [ ] Test on mobile viewport (not just resized desktop browser)
- [ ] Test the full auth loop: register → auto-signed-in → profile → logout → login again
- [ ] Confirm `/sitemap.xml` and `/robots.txt` resolve correctly in production
- [ ] Lighthouse pass on Home, Trip Planner, and Budget Calculator (target
      LCP < 2.5s — see Architecture doc §7)
- [ ] 404 and error pages render correctly (visit a bad URL, throw a test error)

## Future improvements

- Build the Destinations/Hotels UI against the data layer that already
  exists (`lib/api/destinations.ts`, `hotels.ts`)
- Wire `SavedTrips`/`FavoritePlaces` on the profile page to the
  already-built `/api/favorites` and `/api/trip-plans` routes instead of
  mock data
- Add password reset and email verification — neither exists with the
  current Credentials-only Auth.js setup
- Add a `robots.ts` / `sitemap.ts` entry per destination/hotel slug once
  that content exists
- CI: add a GitHub Actions workflow running `npm run lint` and
  `npm run build` on every PR before Vercel preview deploys
