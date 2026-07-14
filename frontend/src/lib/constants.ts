import type { BudgetTierOption, DurationOption, TravelStyleOption } from "@/types/itinerary";

export const DURATION_OPTIONS: DurationOption[] = [
  { value: "1-3", label: "1–3 Days", description: "A quick coastal or hill-country escape", defaultDays: 3 },
  { value: "4-7", label: "4–7 Days", description: "A well-rounded island introduction", defaultDays: 6 },
  { value: "8-14", label: "8–14 Days", description: "Time to combine beaches, wildlife and heritage", defaultDays: 11 },
  { value: "15+", label: "15+ Days", description: "The full island, at an unhurried pace", defaultDays: 18 },
];

export const TRAVEL_STYLE_OPTIONS: TravelStyleOption[] = [
  { value: "Adventure", label: "Adventure", description: "Hikes, treks, and outdoor thrills" },
  { value: "Relaxation", label: "Relaxation", description: "Beaches, spas, and slow mornings" },
  { value: "Cultural", label: "Cultural", description: "Temples, heritage sites, and local traditions" },
  { value: "Wildlife", label: "Wildlife", description: "Safaris, national parks, and nature" },
  { value: "Family", label: "Family", description: "Easy-going, kid-friendly itineraries" },
  { value: "Luxury", label: "Luxury", description: "Premium stays and curated experiences" },
];

export const BUDGET_TIER_OPTIONS: BudgetTierOption[] = [
  { value: "Budget", label: "Budget", description: "Guesthouses, local transport, street food", dailyRateUsd: 35 },
  { value: "Mid Range", label: "Mid Range", description: "3-star hotels, private drivers, sit-down meals", dailyRateUsd: 85 },
  { value: "Luxury", label: "Luxury", description: "Boutique villas, chauffeurs, fine dining", dailyRateUsd: 220 },
];
