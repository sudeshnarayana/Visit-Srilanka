import type {
  BudgetTier,
  DurationBucket,
  Itinerary,
  DayPlan,
  TravelStyle,
} from "@/types/itinerary";
import { BUDGET_TIER_OPTIONS, DURATION_OPTIONS } from "@/lib/constants";
import { getTripDestinationByName } from "@/data/trip-planner-destinations";

export interface GenerateItineraryParams {
  destinations: string[];
  durationBucket: DurationBucket;
  travelStyle: TravelStyle;
  budget: BudgetTier;
}

/**
 * Generates a day-by-day itinerary from wizard selections.
 *
 * This is a pure client-side mock today (Phase 5, "do not connect backend
 * yet"). The signature is intentionally shaped like a request/response pair
 * so it can be swapped later for `POST /api/itineraries` against the
 * Spring Boot API — no change needed in TripPlannerWizard or useItinerary.
 */
export function generateItinerary(params: GenerateItineraryParams): Itinerary {
  const { destinations, durationBucket, travelStyle, budget } = params;

  const durationOption = DURATION_OPTIONS.find((d) => d.value === durationBucket);
  const budgetOption = BUDGET_TIER_OPTIONS.find((b) => b.value === budget);

  const totalDays = durationOption?.defaultDays ?? 7;
  const dailyRate = budgetOption?.dailyRateUsd ?? 85;

  const days: DayPlan[] = buildDayPlans(destinations, totalDays, dailyRate);

  const title = buildTitle(destinations, totalDays, travelStyle);

  return {
    id: `itinerary-${Date.now()}`,
    title,
    duration: totalDays,
    destinations,
    travelStyle,
    budget,
    days,
  };
}

/** Distributes `totalDays` across the selected destinations in round-robin
 * order, so every chosen place gets at least one day whenever there are
 * enough days to go around. */
function buildDayPlans(destinations: string[], totalDays: number, dailyRate: number): DayPlan[] {
  if (destinations.length === 0) return [];

  const days: DayPlan[] = [];
  const activityCursor: Record<string, number> = {};

  for (let i = 0; i < totalDays; i++) {
    const location = destinations[i % destinations.length];
    const destinationData = getTripDestinationByName(location);
    const pool = destinationData?.activities ?? ["Explore the area", "Local sightseeing"];

    const cursor = activityCursor[location] ?? 0;
    const activities = [pool[cursor % pool.length], pool[(cursor + 1) % pool.length]];
    activityCursor[location] = cursor + 2;

    days.push({
      day: i + 1,
      location,
      activities,
      estimatedCost: dailyRate,
    });
  }

  return days;
}

function buildTitle(destinations: string[], totalDays: number, travelStyle: TravelStyle): string {
  const place = destinations[0] ?? "Sri Lanka";
  const extra = destinations.length > 1 ? ` & ${destinations.length - 1} more` : "";
  return `${totalDays}-Day ${travelStyle} Trip: ${place}${extra}`;
}
