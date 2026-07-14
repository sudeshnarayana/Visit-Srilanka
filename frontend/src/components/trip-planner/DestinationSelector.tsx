"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, MapPin, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TRIP_DESTINATIONS } from "@/data/trip-planner-destinations";

interface DestinationSelectorProps {
  selected: string[];
  onToggle: (name: string) => void;
}

export function DestinationSelector({ selected, onToggle }: DestinationSelectorProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TRIP_DESTINATIONS;
    return TRIP_DESTINATIONS.filter(
      (d) => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destinations (e.g. Ella, Wildlife...)"
          className="pl-11"
        />
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((name) => (
            <Badge key={name} variant="secondary" className="gap-1">
              {name}
              <button
                type="button"
                onClick={() => onToggle(name)}
                aria-label={`Remove ${name}`}
                className="ml-1 opacity-80 hover:opacity-100"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((destination) => {
          const isSelected = selected.includes(destination.name);
          return (
            <motion.button
              key={destination.id}
              type="button"
              onClick={() => onToggle(destination.name)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex flex-col gap-2 rounded-xl border p-5 text-left transition-colors",
                isSelected
                  ? "border-primary bg-ocean-50 ring-1 ring-primary"
                  : "border-border bg-card hover:border-ocean-300"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-secondary" />
                  <span className="font-display text-lg font-semibold">{destination.name}</span>
                </div>
                {isSelected && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
              <span className="text-xs font-medium uppercase tracking-wide text-secondary">
                {destination.category} · {destination.region}
              </span>
              <p className="text-sm text-muted-foreground">{destination.description}</p>
            </motion.button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No destinations match &ldquo;{query}&rdquo;. Try another search.
        </p>
      )}
    </div>
  );
}
