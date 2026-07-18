"use client";

import type { Itinerary } from "@/types/itinerary";

/** Trip plan persistence — client-side fetch wrapper around /api/trip-plans. */

export async function saveTripPlan(itinerary: Itinerary) {
  const res = await fetch("/api/trip-plans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itinerary),
  });
  if (!res.ok) throw new Error("Failed to save trip plan");
}

export async function getUserTripPlans() {
  const res = await fetch("/api/trip-plans");
  if (!res.ok) throw new Error("Failed to load trip plans");
  return res.json();
}

export async function deleteTripPlan(tripPlanId: string) {
  const res = await fetch(`/api/trip-plans?id=${tripPlanId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete trip plan");
}
