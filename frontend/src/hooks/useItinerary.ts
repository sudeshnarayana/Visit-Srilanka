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
  vehicleId: null,
  hasGuide: false,
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

  const setVehicle = useCallback((vehicleId: string) => {
    setSelections((prev) => ({ ...prev, vehicleId }));
  }, []);

  const toggleGuide = useCallback(() => {
    setSelections((prev) => ({ ...prev, hasGuide: !prev.hasGuide }));
  }, []);

  const setBudget = useCallback((budget: BudgetTier) => {
    setSelections((prev) => ({ ...prev, budget }));
  }, []);

  const canGenerate = useMemo(
    () =>
      selections.destinations.length > 0 &&
      selections.durationBucket !== null &&
      selections.travelStyle !== null &&
      selections.vehicleId !== null &&
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
    const withVehicle: Itinerary = {
      ...result,
      vehicleId: selections.vehicleId,
      hasGuide: selections.hasGuide,
    };
    setItinerary(withVehicle);
    return withVehicle;
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
    setVehicle,
    toggleGuide,
    setBudget,
    canGenerate,
    generate,
    reset,
  };
}