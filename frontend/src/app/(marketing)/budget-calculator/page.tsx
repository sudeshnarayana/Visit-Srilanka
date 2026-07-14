import type { Metadata } from "next";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { BudgetCalculator } from "@/components/budget/BudgetCalculator";

export const metadata: Metadata = {
  title: "Calculate Sri Lanka Travel Budget",
  description:
    "Estimate your Sri Lanka trip cost — accommodation, transport, food and activities — in USD or LKR, based on travelers, trip length and comfort level.",
};

export default function BudgetCalculatorPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-16 sm:py-24">
      <div className="mx-auto mb-12 max-w-2xl">
        <SectionHeading
          eyebrow="Budget Calculator"
          title="What will your trip cost?"
          subtitle="Adjust travelers, trip length, and comfort level to get a realistic estimate — updated instantly as you go."
        />
      </div>
      <BudgetCalculator />
    </main>
  );
}
