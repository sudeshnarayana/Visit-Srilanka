import type { Metadata } from "next";

import { TripPlannerWizard } from "@/components/trip-planner/TripPlannerWizard";

export const metadata: Metadata = {
  title: "Plan Your Sri Lanka Trip",
  description:
    "Build a personalized Sri Lanka itinerary in minutes — choose destinations, trip length, travel style and budget, and get a day-by-day plan.",
};

export default function TripPlannerPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-16 sm:py-24">
      <TripPlannerWizard />
    </main>
  );
}
