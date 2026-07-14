"use client";

import { useCallback, useMemo, useState } from "react";

import { generateItinerary } from "@/lib/api/itinerary";
import type {
  BudgetTier,
  DurationBucket,
  Itinerary,
  TravelStyle,
  TripPlannerSelections,
} from "@/types/itinerary";

const INITIAL_SELECTIONS: TripPlannerSelections = {
  destinations: [],
  durationBucket: null,
  travelStyle: null,
  budget: null,
};

export function useItinerary() {
  const [selections, setSelections] = useState<TripPlannerSelections>(INITIAL_SELECTIONS);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const toggleDestination = useCallback((name: string) => {
    setSelections((prev) => {
      const exists = prev.destinations.includes(name);
      return {
        ...prev,
        destinations: exists
          ? prev.destinations.filter((d) => d !== name)
          : [...prev.destinations, name],
      };
    });
  }, []);

  const setDuration = useCallback((durationBucket: DurationBucket) => {
    setSelections((prev) => ({ ...prev, durationBucket }));
  }, []);

  const setTravelStyle = useCallback((travelStyle: TravelStyle) => {
    setSelections((prev) => ({ ...prev, travelStyle }));
  }, []);

  const setBudget = useCallback((budget: BudgetTier) => {
    setSelections((prev) => ({ ...prev, budget }));
  }, []);

  const canGenerate = useMemo(
    () =>
      selections.destinations.length > 0 &&
      selections.durationBucket !== null &&
      selections.travelStyle !== null &&
      selections.budget !== null,
    [selections]
  );

  const generate = useCallback(() => {
    if (!canGenerate) return null;
    const result = generateItinerary({
      destinations: selections.destinations,
      durationBucket: selections.durationBucket as DurationBucket,
      travelStyle: selections.travelStyle as TravelStyle,
      budget: selections.budget as BudgetTier,
    });
    setItinerary(result);
    return result;
  }, [canGenerate, selections]);

  const reset = useCallback(() => {
    setSelections(INITIAL_SELECTIONS);
    setItinerary(null);
  }, []);

  return {
    selections,
    itinerary,
    toggleDestination,
    setDuration,
    setTravelStyle,
    setBudget,
    canGenerate,
    generate,
    reset,
  };
}
