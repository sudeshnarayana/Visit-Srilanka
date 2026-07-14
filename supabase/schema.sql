-- Visit Sri Lanka — Supabase schema (Phase 9)
-- Run in Supabase Dashboard → SQL Editor
-- Mirrors frontend types in src/types/ and mock data in src/data/

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type destination_category as enum (
  'Heritage',
  'Wildlife',
  'Beach',
  'Mountains'
);

create type travel_style as enum (
  'Adventure',
  'Relaxation',
  'Cultural',
  'Wildlife',
  'Family',
  'Luxury'
);

create type budget_tier as enum (
  'Budget',
  'Mid Range',
  'Luxury'
);

create type duration_bucket as enum (
  '1-3',
  '4-7',
  '8-14',
  '15+'
);

create type accommodation_type as enum (
  'Budget hotel',
  'Standard hotel',
  'Luxury hotel'
);

create type transport_type as enum (
  'Public Transport',
  'Rental Car',
  'Private Driver',
  'Taxi'
);

create type food_type as enum (
  'Budget meals',
  'Normal meals',
  'Luxury dining'
);

create type activity_type as enum (
  'Entrance fees',
  'Tours',
  'Experiences'
);

create type currency_code as enum ('USD', 'LKR');

-- ---------------------------------------------------------------------------
-- Shared trigger: updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Destinations (Trip Planner subset + future CMS listings)
-- ---------------------------------------------------------------------------
create table public.destinations (
  id text primary key,
  name text not null unique,
  region text not null,
  category destination_category not null,
  description text not null,
  activities text[] not null default '{}',
  image_url text,
  is_featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger destinations_set_updated_at
before update on public.destinations
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Pre-built travel plan templates (from travel-plans.json)
-- ---------------------------------------------------------------------------
create table public.itineraries (
  id text primary key,
  title text not null,
  duration integer not null check (duration > 0),
  destinations text[] not null default '{}',
  travel_style travel_style not null,
  budget budget_tier not null,
  is_template boolean not null default false,
  user_id uuid references auth.users (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint itineraries_template_or_user check (
    (is_template = true and user_id is null)
    or (is_template = false and user_id is not null)
  )
);

create index itineraries_user_id_idx on public.itineraries (user_id);
create index itineraries_is_template_idx on public.itineraries (is_template);

create trigger itineraries_set_updated_at
before update on public.itineraries
for each row execute function public.set_updated_at();

create table public.day_plans (
  id uuid primary key default gen_random_uuid(),
  itinerary_id text not null references public.itineraries (id) on delete cascade,
  day_number integer not null check (day_number > 0),
  location text not null,
  activities text[] not null default '{}',
  estimated_cost numeric(10, 2) not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  unique (itinerary_id, day_number)
);

create index day_plans_itinerary_id_idx on public.day_plans (itinerary_id);

-- ---------------------------------------------------------------------------
-- User-generated trip planner selections (wizard output)
-- ---------------------------------------------------------------------------
create table public.trip_planner_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  destinations text[] not null default '{}',
  duration_bucket duration_bucket not null,
  travel_style travel_style not null,
  budget budget_tier not null,
  generated_itinerary_id text references public.itineraries (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create index trip_planner_sessions_user_id_idx on public.trip_planner_sessions (user_id);

-- ---------------------------------------------------------------------------
-- Budget calculator rates (server-side replacement for budget-rates.ts)
-- ---------------------------------------------------------------------------
create table public.budget_rates (
  id uuid primary key default gen_random_uuid(),
  rate_group text not null,
  rate_key text not null,
  rate_usd numeric(10, 2) not null check (rate_usd >= 0),
  notes text,
  unique (rate_group, rate_key)
);

create table public.fx_rates (
  id uuid primary key default gen_random_uuid(),
  base_currency currency_code not null default 'USD',
  quote_currency currency_code not null,
  rate numeric(12, 4) not null check (rate > 0),
  effective_at timestamptz not null default timezone('utc', now()),
  unique (base_currency, quote_currency)
);

-- ---------------------------------------------------------------------------
-- Saved budget estimates (optional user persistence)
-- ---------------------------------------------------------------------------
create table public.budget_estimates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  travelers integer not null check (travelers > 0),
  days integer not null check (days > 0),
  accommodation accommodation_type not null,
  transport transport_type not null,
  food food_type not null,
  activities activity_type[] not null default '{}',
  currency currency_code not null default 'USD',
  breakdown jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index budget_estimates_user_id_idx on public.budget_estimates (user_id);

-- ---------------------------------------------------------------------------
-- Future: hotels module (placeholder for Phase 2+)
-- ---------------------------------------------------------------------------
create table public.hotels (
  id text primary key,
  name text not null,
  destination_id text references public.destinations (id) on delete set null,
  star_rating integer check (star_rating between 1 and 5),
  price_per_night_usd numeric(10, 2),
  description text,
  amenities text[] not null default '{}',
  image_url text,
  is_featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger hotels_set_updated_at
before update on public.hotels
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.destinations enable row level security;
alter table public.itineraries enable row level security;
alter table public.day_plans enable row level security;
alter table public.trip_planner_sessions enable row level security;
alter table public.budget_rates enable row level security;
alter table public.fx_rates enable row level security;
alter table public.budget_estimates enable row level security;
alter table public.hotels enable row level security;

-- Public read for CMS / marketing content
create policy "Public read destinations"
  on public.destinations for select
  using (true);

create policy "Public read template itineraries"
  on public.itineraries for select
  using (is_template = true);

create policy "Public read day plans for templates"
  on public.day_plans for select
  using (
    exists (
      select 1
      from public.itineraries i
      where i.id = day_plans.itinerary_id
        and i.is_template = true
    )
  );

create policy "Public read budget rates"
  on public.budget_rates for select
  using (true);

create policy "Public read fx rates"
  on public.fx_rates for select
  using (true);

create policy "Public read hotels"
  on public.hotels for select
  using (true);

-- Authenticated users: own saved data
create policy "Users read own itineraries"
  on public.itineraries for select
  using (auth.uid() = user_id);

create policy "Users insert own itineraries"
  on public.itineraries for insert
  with check (auth.uid() = user_id and is_template = false);

create policy "Users update own itineraries"
  on public.itineraries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and is_template = false);

create policy "Users delete own itineraries"
  on public.itineraries for delete
  using (auth.uid() = user_id);

create policy "Users read own day plans"
  on public.day_plans for select
  using (
    exists (
      select 1
      from public.itineraries i
      where i.id = day_plans.itinerary_id
        and i.user_id = auth.uid()
    )
  );

create policy "Users manage own day plans"
  on public.day_plans for all
  using (
    exists (
      select 1
      from public.itineraries i
      where i.id = day_plans.itinerary_id
        and i.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.itineraries i
      where i.id = day_plans.itinerary_id
        and i.user_id = auth.uid()
    )
  );

create policy "Users manage own trip planner sessions"
  on public.trip_planner_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own budget estimates"
  on public.budget_estimates for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Seed: destinations (from trip-planner-destinations.ts)
-- ---------------------------------------------------------------------------
insert into public.destinations (id, name, region, category, description, activities) values
  ('sigiriya', 'Sigiriya', 'Central Province', 'Heritage',
   'Ancient rock fortress rising above the central plains.',
   array['Visit Lion Rock', 'Village tour', 'Sigiriya Museum', 'Pidurangala Rock sunrise hike']),
  ('ella', 'Ella', 'Uva Province', 'Mountains',
   'Hill-country town famous for tea, trains, and viewpoints.',
   array['Nine Arches Bridge', 'Little Adam''s Peak hike', 'Ella Rock trek', 'Tea plantation walk']),
  ('kandy', 'Kandy', 'Central Province', 'Heritage',
   'Sacred hill capital and cultural heart of the island.',
   array['Temple of the Tooth', 'Cultural dance show', 'Royal Botanical Gardens', 'Kandy Lake walk']),
  ('galle', 'Galle', 'Southern Province', 'Heritage',
   'Colonial-era fort city on the southwest coast.',
   array['Galle Fort walking tour', 'Lighthouse viewpoint', 'Dutch Reformed Church', 'Rampart sunset walk']),
  ('mirissa', 'Mirissa', 'Southern Province', 'Beach',
   'Palm-lined beach town known for whale watching.',
   array['Whale watching boat trip', 'Coconut Tree Hill', 'Beach relaxation', 'Snorkeling at the reef']),
  ('yala', 'Yala', 'Southern Province', 'Wildlife',
   'Sri Lanka''s most visited national park, known for leopards.',
   array['Morning safari drive', 'Leopard tracking', 'Bird watching', 'Evening safari drive'])
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Seed: template itineraries (from travel-plans.json)
-- ---------------------------------------------------------------------------
insert into public.itineraries (id, title, duration, destinations, travel_style, budget, is_template) values
  ('plan-adventure-7day', '7 Days Sri Lanka Adventure', 7,
   array['Sigiriya', 'Ella', 'Yala'], 'Adventure', 'Mid Range', true),
  ('plan-beach-5day', '5 Days Beach Escape', 5,
   array['Mirissa', 'Galle'], 'Relaxation', 'Luxury', true),
  ('plan-cultural-10day', '10 Days Cultural Journey', 10,
   array['Kandy', 'Sigiriya', 'Galle'], 'Cultural', 'Budget', true)
on conflict (id) do nothing;

insert into public.day_plans (itinerary_id, day_number, location, activities, estimated_cost) values
  ('plan-adventure-7day', 1, 'Sigiriya', array['Visit Lion Rock', 'Village tour'], 85),
  ('plan-adventure-7day', 2, 'Sigiriya', array['Sigiriya Museum', 'Pidurangala Rock sunrise hike'], 85),
  ('plan-adventure-7day', 3, 'Ella', array['Nine Arches Bridge', 'Little Adam''s Peak hike'], 85),
  ('plan-adventure-7day', 4, 'Ella', array['Ella Rock trek', 'Tea plantation walk'], 85),
  ('plan-adventure-7day', 5, 'Yala', array['Morning safari drive', 'Leopard tracking'], 85),
  ('plan-adventure-7day', 6, 'Yala', array['Bird watching', 'Evening safari drive'], 85),
  ('plan-adventure-7day', 7, 'Sigiriya', array['Visit Lion Rock', 'Village tour'], 85),
  ('plan-beach-5day', 1, 'Mirissa', array['Whale watching boat trip', 'Coconut Tree Hill'], 220),
  ('plan-beach-5day', 2, 'Galle', array['Galle Fort walking tour', 'Lighthouse viewpoint'], 220),
  ('plan-beach-5day', 3, 'Mirissa', array['Beach relaxation', 'Snorkeling at the reef'], 220),
  ('plan-beach-5day', 4, 'Galle', array['Dutch Reformed Church', 'Rampart sunset walk'], 220),
  ('plan-beach-5day', 5, 'Mirissa', array['Whale watching boat trip', 'Beach relaxation'], 220),
  ('plan-cultural-10day', 1, 'Kandy', array['Temple of the Tooth', 'Cultural dance show'], 35),
  ('plan-cultural-10day', 2, 'Kandy', array['Royal Botanical Gardens', 'Kandy Lake walk'], 35),
  ('plan-cultural-10day', 3, 'Kandy', array['Temple of the Tooth', 'Cultural dance show'], 35),
  ('plan-cultural-10day', 4, 'Sigiriya', array['Visit Lion Rock', 'Village tour'], 35),
  ('plan-cultural-10day', 5, 'Sigiriya', array['Sigiriya Museum', 'Pidurangala Rock sunrise hike'], 35),
  ('plan-cultural-10day', 6, 'Galle', array['Galle Fort walking tour', 'Lighthouse viewpoint'], 35),
  ('plan-cultural-10day', 7, 'Galle', array['Dutch Reformed Church', 'Rampart sunset walk'], 35),
  ('plan-cultural-10day', 8, 'Kandy', array['Royal Botanical Gardens', 'Kandy Lake walk'], 35),
  ('plan-cultural-10day', 9, 'Sigiriya', array['Visit Lion Rock', 'Village tour'], 35),
  ('plan-cultural-10day', 10, 'Galle', array['Galle Fort walking tour', 'Rampart sunset walk'], 35);

-- ---------------------------------------------------------------------------
-- Seed: budget rates (from budget-rates.ts + constants.ts)
-- ---------------------------------------------------------------------------
insert into public.budget_rates (rate_group, rate_key, rate_usd) values
  ('accommodation', 'Budget hotel', 15),
  ('accommodation', 'Standard hotel', 35),
  ('accommodation', 'Luxury hotel', 90),
  ('transport', 'Public Transport', 5),
  ('transport', 'Rental Car', 30),
  ('transport', 'Private Driver', 55),
  ('transport', 'Taxi', 40),
  ('food', 'Budget meals', 8),
  ('food', 'Normal meals', 18),
  ('food', 'Luxury dining', 45),
  ('activities', 'Entrance fees', 3),
  ('activities', 'Tours', 10),
  ('activities', 'Experiences', 18),
  ('daily_tier', 'Budget', 35),
  ('daily_tier', 'Mid Range', 85),
  ('daily_tier', 'Luxury', 220)
on conflict (rate_group, rate_key) do nothing;

insert into public.fx_rates (base_currency, quote_currency, rate) values
  ('USD', 'LKR', 300)
on conflict (base_currency, quote_currency) do update
set rate = excluded.rate,
    effective_at = timezone('utc', now());
