"use client";

import type { LucideIcon } from "lucide-react";
import { Hotel, Car, UtensilsCrossed, Ticket, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import type { BudgetBreakdown, Currency } from "@/types/budget";

interface BudgetSummaryProps {
  breakdown: BudgetBreakdown;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

interface Row {
  icon: LucideIcon;
  label: string;
  amount: number;
  accent: "ocean" | "forest" | "sand";
}

const ACCENT_CLASSES: Record<Row["accent"], string> = {
  ocean: "bg-ocean-50 text-ocean-700",
  forest: "bg-forest-50 text-forest-700",
  sand: "bg-sand-50 text-sand-700",
};

function formatAmount(amount: number, currency: Currency) {
  const formatted = amount.toLocaleString(currency === "LKR" ? "en-LK" : "en-US");
  return currency === "USD" ? `$${formatted}` : `Rs. ${formatted}`;
}

export function BudgetSummary({ breakdown, currency, onCurrencyChange }: BudgetSummaryProps) {
  const rows: Row[] = [
    { icon: Hotel, label: "Accommodation", amount: breakdown.accommodation, accent: "ocean" },
    { icon: Car, label: "Transport", amount: breakdown.transport, accent: "forest" },
    { icon: UtensilsCrossed, label: "Food", amount: breakdown.food, accent: "sand" },
    { icon: Ticket, label: "Activities", amount: breakdown.activities, accent: "ocean" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Boarding-pass card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
        {/* Header stub */}
        <div className="flex items-center justify-between bg-primary px-6 py-5 text-primary-foreground">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <span className="font-display text-lg font-semibold">Trip Budget</span>
          </div>
          <div className="flex overflow-hidden rounded-full bg-white/15 p-0.5 text-xs font-semibold">
            {(["USD", "LKR"] as Currency[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onCurrencyChange(c)}
                className={cn(
                  "rounded-full px-3 py-1.5 transition-colors",
                  currency === c
                    ? "bg-white text-primary"
                    : "text-primary-foreground/80 hover:text-primary-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Line items */}
        <div className="flex flex-col gap-1 px-6 py-5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    ACCENT_CLASSES[row.accent]
                  )}
                >
                  <row.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-foreground">{row.label}</span>
              </div>
              <span className="font-display text-sm font-semibold text-foreground">
                {formatAmount(row.amount, currency)}
              </span>
            </div>
          ))}
        </div>

        {/* Perforation */}
        <div className="relative">
          <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
          <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
          <div
            className="mx-6 border-t border-dashed border-border"
            aria-hidden="true"
          />
        </div>

        {/* Total */}
        <div className="flex items-center justify-between bg-sand-50 px-6 py-6">
          <span className="font-display text-base font-semibold text-foreground">
            Estimated Total
          </span>
          <span className="font-display text-2xl font-bold text-accent-foreground">
            {formatAmount(breakdown.total, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
