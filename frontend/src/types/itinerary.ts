/**
 * Trip Planner data model.
 * Kept as plain interfaces (no class logic) so this same shape can later be
 * mirrored by a Spring Boot DTO (ItineraryDto, DayPlanDto) without changes
 * on the frontend consuming code — see Architecture doc §10 (CMS thinking).
 */

export type TravelStyle =
  | "Adventure"
  | "Relaxation"
  | "Cultural"
  | "Wildlife"
  | "Family"
  | "Luxury";

export type BudgetTier = "Budget" | "Mid Range" | "Luxury";

/** Duration is presented to the user as a bucket, but stored as a concrete
 * number of days on the Itinerary itself (see DURATION_OPTIONS default days). */
export type DurationBucket = "1-3" | "4-7" | "8-14" | "15+";

export interface DurationOption {
  value: DurationBucket;
  label: string;
  description: string;
  defaultDays: number;
}

export interface TravelStyleOption {
  value: TravelStyle;
  label: string;
  description: string;
}

export interface BudgetTierOption {
  value: BudgetTier;
  label: string;
  description: string;
  dailyRateUsd: number;
}

export interface DayPlan {
  day: number;
  location: string;
  activities: string[];
  estimatedCost: number;
}


/** Wizard step state — not persisted, just drives the UI. */

export interface Vehicle {
  id: string;
  name: string;
  type: "Car" | "Van" | "SUV" | "Minibus";
  seats: number;
  dailyRateUsd: number;
  description: string;
  images: string[]; // base64 strings, like destinations.imageUrl but as an array
  includesDriver: true; // always true — driver is free with any vehicle
}

export interface TripPlannerSelections {
  destinations: string[];
  durationBucket: DurationBucket | null;
  travelStyle: TravelStyle | null;
  vehicleId: string | null;
  hasGuide: boolean;
  budget: BudgetTier | null;
}

export interface Itinerary {
  id: string;
  title: string;
  duration: number;
  destinations: string[];
  travelStyle: string;
  budget: string;
  vehicleId: string | null;
  hasGuide: boolean;
  days: DayPlan[];
}

export const TRIP_PLANNER_STEPS = [
  "destinations",
  "duration",
  "style",
  "vehicle",
  "budget",
  "result",
] as const;

export type TripPlannerStep = (typeof TRIP_PLANNER_STEPS)[number];
