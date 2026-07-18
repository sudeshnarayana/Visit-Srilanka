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
import {
  MOCK_FAVORITE_DESTINATIONS,
  MOCK_FAVORITE_HOTELS,
  MOCK_SAVED_TRIPS,
  MOCK_TRAVEL_HISTORY,
} from "@/data/mock-user";

/**
 * ProfileCard now shows the real signed-in user (via useAuth / Auth.js
 * session). SavedTrips/FavoritePlaces/TravelHistory still render mock
 * data — /api/trip-plans and /api/favorites exist (lib/api/tripPlans.ts,
 * favorites.ts) but nothing on this page calls them yet. Wiring that up
 * is the next real step, not done here to keep this migration scoped to
 * "move auth + data layer to MongoDB" rather than also building out
 * profile data fetching.
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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  async function handleLogout() {
    await logout();
    router.push("/");
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

          {tab === "trips" && <SavedTrips trips={MOCK_SAVED_TRIPS} />}
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

