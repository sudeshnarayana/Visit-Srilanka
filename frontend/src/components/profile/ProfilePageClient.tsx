"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { ProfileCard } from "@/components/profile/ProfileCard";
import { SavedTrips } from "@/components/profile/SavedTrips";
import { FavoritePlaces } from "@/components/profile/FavoritePlaces";
import { TravelHistory } from "@/components/profile/TravelHistory";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getUserTripPlans, deleteTripPlan } from "@/lib/api/tripPlans";
import type { SavedTrip } from "@/types/user";
import {
  MOCK_FAVORITE_DESTINATIONS,
  MOCK_FAVORITE_HOTELS,
  MOCK_TRAVEL_HISTORY,
} from "@/data/mock-user";

/**
 * ProfileCard shows the real signed-in user (via useAuth / Auth.js session).
 * SavedTrips now fetches real data from /api/trip-plans and supports delete.
 * FavoritePlaces/TravelHistory still render mock data — wiring those up to
 * /api/favorites is a follow-up step.
 */

type Tab = "trips" | "favorites" | "history";

const TABS: { key: Tab; label: string }[] = [
  { key: "trips", label: "Planned Trips" },
  { key: "favorites", label: "Favorites" },
  { key: "history", label: "Travel History" },
];

export function ProfilePageClient() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("trips");
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    async function loadTrips() {
      try {
        const data = await getUserTripPlans();
        if (!cancelled) setTrips(data);
      } catch (err) {
        console.error("Failed to load trip plans", err);
      } finally {
        if (!cancelled) setTripsLoading(false);
      }
    }

    loadTrips();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  async function handleRemoveTrip(id: string) {
    const previous = trips;
    setTrips((current) => current.filter((trip) => trip.id !== id));

    try {
      await deleteTripPlan(id);
    } catch (err) {
      console.error("Failed to delete trip plan", err);
      setTrips(previous);
    }
  }

  if (isLoading || !user) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm">Loading your profile...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-16 sm:py-20">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <ProfileCard user={user} onLogout={handleLogout} />

        <div className="flex flex-col gap-6">
          <div className="flex gap-2 overflow-x-auto border-b border-border">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                  tab === t.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "trips" && <SavedTrips trips={trips} onRemove={handleRemoveTrip} />}
          {tab === "favorites" && (
            <FavoritePlaces
              destinations={MOCK_FAVORITE_DESTINATIONS}
              hotels={MOCK_FAVORITE_HOTELS}
            />
          )}
          {tab === "history" && <TravelHistory entries={MOCK_TRAVEL_HISTORY} />}
        </div>
      </div>
    </main>
  );
}