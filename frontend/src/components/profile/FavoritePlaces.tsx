"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Hotel, MapPin, Star, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FavoriteDestination, FavoriteHotel } from "@/types/user";

interface FavoritePlacesProps {
  destinations: FavoriteDestination[];
  hotels: FavoriteHotel[];
  onRemoveDestination?: (id: string) => void;
  onRemoveHotel?: (id: string) => void;
}

type Tab = "destinations" | "hotels";

export function FavoritePlaces({
  destinations,
  hotels,
  onRemoveDestination,
  onRemoveHotel,
}: FavoritePlacesProps) {
  const [tab, setTab] = useState<Tab>("destinations");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-fit rounded-full border border-border bg-muted p-1">
        {(
          [
            { key: "destinations", label: `Destinations (${destinations.length})` },
            { key: "hotels", label: `Hotels (${hotels.length})` },
          ] as { key: Tab; label: string }[]
        ).map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setTab(option.key)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              tab === option.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {tab === "destinations" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {destinations.length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No favorite destinations yet.
            </p>
          )}
          {destinations.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ocean-50 text-ocean-700">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium">{d.name}</p>
                      <Badge variant="outline" className="mt-1">
                        {d.category}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${d.name} from favorites`}
                    onClick={() => onRemoveDestination?.(d.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {tab === "hotels" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {hotels.length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No favorite hotels yet.
            </p>
          )}
          {hotels.map((h, i) => (
            <motion.div key={h.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-50 text-forest-700">
                      <Hotel className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium">{h.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{h.location}</span>
                        <span className="flex items-center gap-0.5 text-sand-600">
                          <Star className="h-3 w-3 fill-current" /> {h.rating}
                        </span>
                        <span>${h.pricePerNightUsd}/night</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${h.name} from favorites`}
                    onClick={() => onRemoveHotel?.(h.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
