"use client";

import { motion } from "framer-motion";
import { Coins } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUDGET_TIER_OPTIONS } from "@/lib/constants";
import type { BudgetTier } from "@/types/itinerary";

interface BudgetSelectorProps {
  selected: BudgetTier | null;
  onSelect: (value: BudgetTier) => void;
}

export function BudgetSelector({ selected, onSelect }: BudgetSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {BUDGET_TIER_OPTIONS.map((option) => {
        const isSelected = selected === option.value;
        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex flex-col gap-3 rounded-xl border p-6 text-left transition-colors",
              isSelected
                ? "border-primary bg-sand-50 ring-1 ring-accent"
                : "border-border bg-card hover:border-sand-300"
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                isSelected ? "bg-accent text-accent-foreground" : "bg-muted text-accent"
              )}
            >
              <Coins className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold">{option.label}</span>
            <p className="text-sm text-muted-foreground">{option.description}</p>
            <p className="text-sm font-medium text-foreground">
              ~${option.dailyRateUsd} / day
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
