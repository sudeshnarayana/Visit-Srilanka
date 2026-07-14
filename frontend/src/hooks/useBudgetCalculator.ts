"use client";

import { useCallback, useMemo, useState } from "react";

import { calculateBudget } from "@/lib/api/budget";
import type {
  AccommodationType,
  ActivityType,
  BudgetBreakdown,
  BudgetInputs,
  Currency,
  FoodType,
  TransportType,
} from "@/types/budget";

const INITIAL_INPUTS: BudgetInputs = {
  travelers: 2,
  days: 5,
  accommodation: "Standard hotel",
  transport: "Rental Car",
  food: "Normal meals",
  activities: ["Entrance fees", "Tours"],
  currency: "USD",
};

export function useBudgetCalculator(initial: Partial<BudgetInputs> = {}) {
  const [inputs, setInputs] = useState<BudgetInputs>({ ...INITIAL_INPUTS, ...initial });

  const setTravelers = useCallback((travelers: number) => {
    setInputs((prev) => ({ ...prev, travelers: Math.max(1, travelers) }));
  }, []);

  const setDays = useCallback((days: number) => {
    setInputs((prev) => ({ ...prev, days: Math.max(1, days) }));
  }, []);

  const setAccommodation = useCallback((accommodation: AccommodationType) => {
    setInputs((prev) => ({ ...prev, accommodation }));
  }, []);

  const setTransport = useCallback((transport: TransportType) => {
    setInputs((prev) => ({ ...prev, transport }));
  }, []);

  const setFood = useCallback((food: FoodType) => {
    setInputs((prev) => ({ ...prev, food }));
  }, []);

  const toggleActivity = useCallback((activity: ActivityType) => {
    setInputs((prev) => {
      const exists = prev.activities.includes(activity);
      return {
        ...prev,
        activities: exists
          ? prev.activities.filter((a) => a !== activity)
          : [...prev.activities, activity],
      };
    });
  }, []);

  const setCurrency = useCallback((currency: Currency) => {
    setInputs((prev) => ({ ...prev, currency }));
  }, []);

  const breakdown: BudgetBreakdown = useMemo(() => calculateBudget(inputs), [inputs]);

  return {
    inputs,
    breakdown,
    setTravelers,
    setDays,
    setAccommodation,
    setTransport,
    setFood,
    toggleActivity,
    setCurrency,
  };
}
