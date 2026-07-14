"use client";

import { motion } from "framer-motion";
import { Compass, Umbrella, Landmark, PawPrint, Users, Gem, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { TRAVEL_STYLE_OPTIONS } from "@/lib/constants";
import type { TravelStyle } from "@/types/itinerary";

const STYLE_ICONS: Record<TravelStyle, LucideIcon> = {
  Adventure: Compass,
  Relaxation: Umbrella,
  Cultural: Landmark,
  Wildlife: PawPrint,
  Family: Users,
  Luxury: Gem,
};

interface TravelStyleSelectorProps {
  selected: TravelStyle | null;
  onSelect: (value: TravelStyle) => void;
}

export function TravelStyleSelector({ selected, onSelect }: TravelStyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {TRAVEL_STYLE_OPTIONS.map((option) => {
        const Icon = STYLE_ICONS[option.value];
        const isSelected = selected === option.value;
        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-colors",
              isSelected
                ? "border-primary bg-forest-50 ring-1 ring-secondary"
                : "border-border bg-card hover:border-forest-300"
            )}
          >
            <span
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                isSelected ? "bg-secondary text-secondary-foreground" : "bg-muted text-secondary"
              )}
            >
              <Icon className="h-6 w-6" />
            </span>
            <span className="font-display text-base font-semibold">{option.label}</span>
            <p className="text-xs text-muted-foreground">{option.description}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
