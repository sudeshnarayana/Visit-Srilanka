import {
  ACCOMMODATION_RATES,
  ACTIVITY_RATES,
  FOOD_RATES,
  TRANSPORT_RATES,
  USD_TO_LKR_RATE,
} from "@/lib/budget-rates";
import type { BudgetBreakdown, BudgetInputs } from "@/types/budget";

/**
 * Computes a cost breakdown from budget wizard inputs.
 *
 * Pure client-side math today (Phase 5, "do not connect backend yet").
 * Shaped like a request/response pair on purpose — this is the seam where
 * `POST /api/budget/estimate` plugs in later (e.g. once seasonal pricing or
 * live FX rates move server-side), without useBudgetCalculator or any
 * component needing to change.
 */
export function calculateBudget(inputs: BudgetInputs): BudgetBreakdown {
  const rooms = Math.ceil(inputs.travelers / 2);

  const accommodation = ACCOMMODATION_RATES[inputs.accommodation] * rooms * inputs.days;
  const transport = TRANSPORT_RATES[inputs.transport] * inputs.days;
  const food = FOOD_RATES[inputs.food] * inputs.travelers * inputs.days;
  const activities = inputs.activities.reduce(
    (sum, activity) => sum + ACTIVITY_RATES[activity] * inputs.travelers * inputs.days,
    0
  );

  const totalUsd = accommodation + transport + food + activities;
  const rate = inputs.currency === "LKR" ? USD_TO_LKR_RATE : 1;

  return {
    accommodation: Math.round(accommodation * rate),
    transport: Math.round(transport * rate),
    food: Math.round(food * rate),
    activities: Math.round(activities * rate),
    total: Math.round(totalUsd * rate),
    currency: inputs.currency,
  };
}
