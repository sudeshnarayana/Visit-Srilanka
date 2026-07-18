# API Layer

Three things now answer to "API" in this project: the internal frontend
service functions (`lib/api/`), the Next.js Route Handlers backing the
client-side ones (`app/api/`), and the future Spring Boot REST API
(planned, not built — see `/backend`).

## Route Handlers (`frontend/src/app/api/`)

Real HTTP endpoints — these exist because MongoDB, unlike Supabase, has no
client-safe direct-query layer. Every one derives the current user from
the Auth.js session server-side; none trust a client-supplied user id.

```
POST   /api/register        Create a user (bcrypt-hashes the password)
GET    /api/favorites       List the signed-in user's favorites
POST   /api/favorites       Add a favorite ({ type, destinationId | hotelId })
DELETE /api/favorites?id=   Remove a favorite (id must belong to the caller)
GET    /api/trip-plans      List the signed-in user's saved itineraries
POST   /api/trip-plans      Save an itinerary
DELETE /api/trip-plans?id=  Delete a saved itinerary
*      /api/auth/[...nextauth]   Auth.js's own sign-in/sign-out/session endpoints
```

## Internal service layer (`frontend/src/lib/api/`)

Plain async functions called from components — never call MongoDB or
`fetch()` directly from a component; go through these.

### `itinerary.ts` — pure logic, no DB
```ts
generateItinerary(params: GenerateItineraryParams): Itinerary
```

### `budget.ts` — pure logic, no DB
```ts
calculateBudget(inputs: BudgetInputs): BudgetBreakdown
```

### `destinations.ts` — MongoDB-backed, **server-only**, no consuming UI yet
```ts
getDestinations(category?: DestinationCategory): Promise<Destination[]>
getDestinationBySlug(slug: string): Promise<Destination | null>
searchDestinations(query: string): Promise<Destination[]>
```
Queries MongoDB directly — only call from Server Components or Route
Handlers, never from a `"use client"` file.

### `hotels.ts` — MongoDB-backed, **server-only**, no consuming UI yet
```ts
getHotels(tier?: HotelTier): Promise<Hotel[]>
getHotelBySlug(slug: string): Promise<Hotel | null>
getHotelsNearDestination(region: string): Promise<Hotel[]>
```

### `favorites.ts` — `"use client"`, calls `/api/favorites`
```ts
saveFavoriteDestination(destinationId: string): Promise<void>
saveFavoriteHotel(hotelId: string): Promise<void>
removeFavorite(favoriteId: string): Promise<void>
getUserFavorites(): Promise<Favorite[]>
```
No `userId` parameter — the route handler reads it from the session.
Built, but **not called from the profile page yet** (see architecture.md).

### `tripPlans.ts` — `"use client"`, calls `/api/trip-plans`
```ts
saveTripPlan(itinerary: Itinerary): Promise<void>
getUserTripPlans(): Promise<TripPlan[]>
deleteTripPlan(tripPlanId: string): Promise<void>
```
Same status as `favorites.ts` — built, not wired into any button yet.

## Future: Spring Boot REST API (`/backend`)

Currently a boot-only skeleton with a single verification endpoint:

```
GET /api/health  →  { status, service, timestamp }
```

Planned endpoints once backend work actually starts (see
`backend/README.md`):

```
GET    /api/destinations
GET    /api/destinations/:slug
GET    /api/hotels
GET    /api/hotels/:slug
POST   /api/trip-plans
GET    /api/trip-plans          (authenticated)
POST   /api/budget/estimate
POST   /api/auth/login
POST   /api/auth/register
```

Whether the frontend keeps using Auth.js + MongoDB directly, or routes
through this Spring Boot API instead, is an open decision — don't half-wire
both. If the Spring Boot API is built out, the natural split is: Spring
Boot owns `destinations`/`hotels`/`reviews` (content that benefits from a
real backend's business logic), while Auth.js keeps owning auth directly
against MongoDB (simpler, no reason to proxy auth through a second
service unless there's a specific need to).
