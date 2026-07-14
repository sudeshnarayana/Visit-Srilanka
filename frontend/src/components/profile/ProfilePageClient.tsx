"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ProfileCard } from "@/components/profile/ProfileCard";
import { SavedTrips } from "@/components/profile/SavedTrips";
import { FavoritePlaces } from "@/components/profile/FavoritePlaces";
import { TravelHistory } from "@/components/profile/TravelHistory";
import { cn } from "@/lib/utils";
import {
  MOCK_USER,
  MOCK_FAVORITE_DESTINATIONS,
  MOCK_FAVORITE_HOTELS,
  MOCK_SAVED_TRIPS,
  MOCK_TRAVEL_HISTORY,
} from "@/data/mock-user";

/**
 * Phase 6: UI-only profile page, seeded with mock data.
 * Phase 9 replaces MOCK_USER / MOCK_* with a session-derived user and
 * Supabase queries against `favorites`, `trip_plans`, and a travel-history
 * table — same component props, different data source.
 */

type Tab = "trips" | "favorites" | "history";

const TABS: { key: Tab; label: string }[] = [
  { key: "trips", label: "Planned Trips" },
  { key: "favorites", label: "Favorites" },
  { key: "history", label: "Travel History" },
];

export function ProfilePageClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("trips");

  function handleLogout() {
    // TODO Phase 9: await supabase.auth.signOut()
    router.push("/");
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-16 sm:py-20">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <ProfileCard user={MOCK_USER} onLogout={handleLogout} />

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
