"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SavedTrip } from "@/types/user";

interface SavedTripsProps {
  trips: SavedTrip[];
  onRemove?: (id: string) => void;
}

export function SavedTrips({ trips, onRemove }: SavedTripsProps) {
  if (trips.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No saved trips yet. Build one in the Trip Planner and it will show up here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {trips.map((trip, index) => (
        <motion.div
          key={trip.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card>
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-base font-semibold">{trip.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" /> {trip.duration} days
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {trip.destinations.join(", ")}
                  </span>
                  <Badge variant="secondary">{trip.travelStyle}</Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remove ${trip.title}`}
                onClick={() => onRemove?.(trip.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
