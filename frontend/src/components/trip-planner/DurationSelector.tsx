"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

import { cn } from "@/lib/utils";
import { DURATION_OPTIONS } from "@/lib/constants";
import type { DurationBucket } from "@/types/itinerary";

interface DurationSelectorProps {
  selected: DurationBucket | null;
  onSelect: (value: DurationBucket) => void;
}

export function DurationSelector({ selected, onSelect }: DurationSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {DURATION_OPTIONS.map((option) => {
        const isSelected = selected === option.value;
        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex flex-col gap-2 rounded-xl border p-6 text-left transition-colors",
              isSelected
                ? "border-primary bg-ocean-50 ring-1 ring-primary"
                : "border-border bg-card hover:border-ocean-300"
            )}
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-display text-xl font-semibold">{option.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">{option.description}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
