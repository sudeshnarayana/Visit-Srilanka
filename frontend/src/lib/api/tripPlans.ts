"use client";

import { createClient } from "@/lib/supabase/client";
import type { Itinerary } from "@/types/itinerary";

/** Persists/retrieves generated itineraries against the `trip_plans` table. */

export async function saveTripPlan(userId: string, itinerary: Itinerary) {
  const supabase = createClient();
  const { error } = await supabase.from("trip_plans").insert({
    user_id: userId,
    title: itinerary.title,
    duration: itinerary.duration,
    destinations: itinerary.destinations,
    travel_style: itinerary.travelStyle,
    budget_tier: itinerary.budget,
    days: itinerary.days,
  });
  if (error) throw error;
}

export async function getUserTripPlans(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("trip_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function deleteTripPlan(tripPlanId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("trip_plans").delete().eq("id", tripPlanId);
  if (error) throw error;
}
