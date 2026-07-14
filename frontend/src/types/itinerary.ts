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

export interface Itinerary {
  id: string;
  title: string;
  duration: number;
  destinations: string[];
  travelStyle: string;
  budget: string;
  days: DayPlan[];
}

/** Wizard step state — not persisted, just drives the UI. */
export interface TripPlannerSelections {
  destinations: string[];
  durationBucket: DurationBucket | null;
  travelStyle: TravelStyle | null;
  budget: BudgetTier | null;
}

export const TRIP_PLANNER_STEPS = [
  "destinations",
  "duration",
  "style",
  "budget",
  "result",
] as const;

export type TripPlannerStep = (typeof TRIP_PLANNER_STEPS)[number];
