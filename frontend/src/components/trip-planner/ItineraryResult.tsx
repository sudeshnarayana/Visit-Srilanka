"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, RotateCcw, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Itinerary } from "@/types/itinerary";

interface ItineraryResultProps {
  itinerary: Itinerary;
  onReset: () => void;
}

export function ItineraryResult({ itinerary, onReset }: ItineraryResultProps) {
  const totalCost = itinerary.days.reduce((sum, day) => sum + day.estimatedCost, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="h-6 w-6" />
        </span>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{itinerary.title}</h2>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="outline" className="gap-1">
            <CalendarDays className="h-3 w-3" /> {itinerary.duration} days
          </Badge>
          <Badge variant="secondary">{itinerary.travelStyle}</Badge>
          <Badge variant="accent">{itinerary.budget}</Badge>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {itinerary.days.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ocean-50 font-display text-sm font-semibold text-primary">
                    {day.day}
                  </span>
                  <div>
                    <CardTitle className="text-lg">Day {day.day}</CardTitle>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {day.location}
                    </p>
                  </div>
                </div>
                <span className="whitespace-nowrap text-sm font-semibold text-secondary">
                  ~${day.estimatedCost}
                </span>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-1.5">
                  {day.activities.map((activity) => (
                    <li key={activity} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-primary bg-ocean-50">
        <CardContent className="flex items-center justify-between p-6">
          <span className="font-display text-lg font-semibold">Estimated Total</span>
          <span className="font-display text-2xl font-bold text-primary">${totalCost}</span>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Create Another Itinerary
        </Button>
      </div>
    </div>
  );
}
