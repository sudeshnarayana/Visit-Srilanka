"use client";

import { motion } from "framer-motion";

import { useBudgetCalculator } from "@/hooks/useBudgetCalculator";
import { BudgetInputForm } from "./BudgetInputForm";
import { BudgetSummary } from "./BudgetSummary";

export function BudgetCalculator() {
  const {
    inputs,
    breakdown,
    setTravelers,
    setDays,
    setAccommodation,
    setTransport,
    setFood,
    toggleActivity,
    setCurrency,
  } = useBudgetCalculator();

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
      >
        <BudgetInputForm
          inputs={inputs}
          onTravelersChange={setTravelers}
          onDaysChange={setDays}
          onAccommodationChange={setAccommodation}
          onTransportChange={setTransport}
          onFoodChange={setFood}
          onActivityToggle={toggleActivity}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="lg:sticky lg:top-24"
      >
        <BudgetSummary
          breakdown={breakdown}
          currency={inputs.currency}
          onCurrencyChange={setCurrency}
        />
        <p className="mx-auto mt-4 max-w-md text-center text-xs text-muted-foreground">
          Estimates only — actual costs vary by season, availability, and negotiation.
          {inputs.currency === "LKR" && " Converted at an approximate rate, not a live FX feed."}
        </p>
      </motion.div>
    </div>
  );
}
