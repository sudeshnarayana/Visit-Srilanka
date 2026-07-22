"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Users2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Vehicle {
  _id: string;
  id: string;
  name: string;
  type: string;
  seats: number;
  dailyRateUsd: number;
  description: string;
  images: string[];
}

interface VehicleSelectorProps {
  selected: string | null;
  onSelect: (id: string) => void;
  hasGuide: boolean;
  onToggleGuide: () => void;
}

function VehicleImageCarousel({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="h-36 w-full rounded-lg bg-muted" />;
  }

  function prev(e: React.MouseEvent) {
    e.stopPropagation();
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function next(e: React.MouseEvent) {
    e.stopPropagation();
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    <div className="relative h-36 w-full overflow-hidden rounded-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[index]} alt={name} className="h-full w-full object-cover" />
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  i === index ? "bg-white" : "bg-white/40"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function VehicleSelector({ selected, onSelect, hasGuide, onToggleGuide }: VehicleSelectorProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then(setVehicles)
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center text-sm text-muted-foreground">Loading vehicles...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {vehicles.map((vehicle) => {
          const isSelected = selected === vehicle.id;
          return (
            <motion.button
              key={vehicle.id}
              type="button"
              onClick={() => onSelect(vehicle.id)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex flex-col gap-3 rounded-xl border p-4 text-left transition-colors",
                isSelected
                  ? "border-primary bg-ocean-50 ring-1 ring-primary"
                  : "border-border bg-card hover:border-ocean-300"
              )}
            >
              <VehicleImageCarousel images={vehicle.images} name={vehicle.name} />
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-semibold">{vehicle.name}</span>
                <Badge variant="secondary">{vehicle.type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{vehicle.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Users2 className="h-3.5 w-3.5" /> {vehicle.seats} seats · Driver included
                </span>
                <span className="font-semibold text-foreground">${vehicle.dailyRateUsd}/day</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-4">
        <input
          type="checkbox"
          checked={hasGuide}
          onChange={onToggleGuide}
          className="h-5 w-5 rounded border-input accent-primary"
        />
        <div className="flex flex-col">
          <span className="font-medium">Add a Guide</span>
          <span className="text-sm text-muted-foreground">
            Optional — a local guide will accompany your trip for an extra cost.
          </span>
        </div>
      </label>
    </div>
  );
}