# Database Structure — MongoDB

Migrated from the original Supabase/PostgreSQL plan. Same seven logical
entities, expressed as MongoDB collections instead of SQL tables. No
foreign keys or Row Level Security exist in MongoDB — every access rule
that RLS used to enforce is now enforced in application code (the API
route handlers under `src/app/api/`), not the database.

## `users`

Created by `POST /api/register` (see `app/api/register/route.ts`), read by
Auth.js's Credentials provider (`src/auth.ts`) on every login.

```ts
{
  _id: ObjectId,
  name: string,
  email: string,          // unique — enforce with an index, see below
  passwordHash: string,   // bcrypt hash, never store plaintext
  country?: string,
  role: "TOURIST" | "HOTEL_PARTNER" | "ADMIN",
  createdAt: Date,
}
```

```js
db.users.createIndex({ email: 1 }, { unique: true });
```

Auth.js's MongoDB adapter also creates its own `accounts`, `sessions`, and
`verificationTokens` collections automatically the first time an OAuth
provider or database session is used. They're unused right now (JWT
session strategy + Credentials provider only), but will populate once
Google/Facebook login is wired up for real (see
`components/auth/SocialLoginButtons.tsx`).

## `destinations`

```ts
{
  _id: ObjectId,
  slug: string,            // unique
  name: string,
  category: "Beach" | "Wildlife" | "Heritage" | "Mountains",
  region: string,
  description: string,
  imageUrl?: string,
  activities: string[],
  createdAt: Date,
}
```

```js
db.destinations.createIndex({ slug: 1 }, { unique: true });
db.destinations.createIndex({ category: 1 });
```

Read via `lib/api/destinations.ts` — no UI consumes this yet (see
`docs/architecture.md`).

## `hotels`

```ts
{
  _id: ObjectId,
  slug: string,            // unique
  name: string,
  location: string,
  tier: "Budget" | "Standard" | "Luxury",
  pricePerNightUsd: number,
  rating: number,
  reviewCount: number,
  imageUrl?: string,
  amenities: string[],
  createdAt: Date,
}
```

```js
db.hotels.createIndex({ slug: 1 }, { unique: true });
db.hotels.createIndex({ location: 1 });
```

## `favorites`

```ts
{
  _id: ObjectId,
  userId: string,           // Auth.js session user id, as a string
  type: "destination" | "hotel",
  destinationId?: string,
  hotelId?: string,
  createdAt: Date,
}
```

```js
db.favorites.createIndex({ userId: 1 });
```

Every read/write goes through `app/api/favorites/route.ts`, which derives
`userId` from the server-side session (`auth()`) — never from the request
body. This is the MongoDB equivalent of what a Supabase RLS policy
(`auth.uid() = user_id`) used to guarantee at the database layer; here
it's guaranteed by the route handler instead, so **that check must never
be removed or bypassed** when this route is extended.

## `reviews`

```ts
{
  _id: ObjectId,
  userId: string,
  destinationId?: string,
  hotelId?: string,
  rating: number,           // 1-5
  comment?: string,
  createdAt: Date,
}
```

No API route built yet — add one following the same "derive userId from
`auth()`, never trust the body" pattern as `favorites`.

## `trip_plans`

Stores generated Trip Planner itineraries (see `types/itinerary.ts`).

```ts
{
  _id: ObjectId,
  userId: string,
  title: string,
  duration: number,
  destinations: string[],
  travelStyle: string,
  budgetTier: string,
  days: {                  // array of DayPlan
    day: number,
    location: string,
    activities: string[],
    estimatedCost: number,
  }[],
  createdAt: Date,
}
```

```js
db.trip_plans.createIndex({ userId: 1 });
```

Read/write via `app/api/trip-plans/route.ts` and `lib/api/tripPlans.ts` —
built, but **not called from the Trip Planner UI yet**. `ItineraryResult`
still only shows the generated plan in-memory; "save this trip" isn't
wired to a button anywhere.

## `budgets`

Optional — for a future "save this estimate" feature on the Budget
Calculator (not built).

```ts
{
  _id: ObjectId,
  userId: string,
  travelers: number,
  days: number,
  accommodationType: string,
  transportType: string,
  foodType: string,
  activities: string[],
  currency: "USD" | "LKR",
  breakdown: { accommodation: number, transport: number, food: number, activities: number, total: number },
  createdAt: Date,
}
```

## Setting this up

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
   (or run `mongod` locally for dev)
2. Create a database user and get the connection string from **Connect →
   Drivers**
3. Put it in `.env.local` as `MONGODB_URI=mongodb+srv://...`
4. Run the `createIndex` calls above once, either in `mongosh` connected
   to your cluster, or via MongoDB Compass's index UI
5. Generate an Auth.js secret: `npx auth secret` — put the output in
   `AUTH_SECRET` in `.env.local`

No SQL migration tool is set up — collections are created implicitly the
first time a document is inserted (e.g. the first `/api/register` call
creates `users`). For seeding `destinations`/`hotels` with sample data,
either insert manually via Compass/mongosh, or write a one-off seed script
under `scripts/` (not included here).
