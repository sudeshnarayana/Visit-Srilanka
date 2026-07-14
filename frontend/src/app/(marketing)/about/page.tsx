import type { Metadata } from "next";
import Link from "next/link";
import { Umbrella, PawPrint, Landmark, Mountain } from "lucide-react";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { MissionSection } from "@/components/about/MissionSection";
import { StatsSection } from "@/components/about/StatsSection";
import { TeamSection } from "@/components/about/TeamSection";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Visit Sri Lanka's mission to make planning a trip to Sri Lanka honest, simple, and community-focused.",
};

const REASONS = [
  "Nine climate zones packed into one island the size of West Virginia",
  "Over 2,500 years of continuous recorded history and living heritage",
  "Leopards, elephants, whales, and over 400 bird species in a handful of parks",
  "A coastline offering both world-class surf breaks and calm swimming bays",
];

const CATEGORIES = [
  { icon: Umbrella, label: "Beach", href: "/destinations?category=beach", accent: "ocean" as const },
  { icon: PawPrint, label: "Wildlife", href: "/destinations?category=wildlife", accent: "forest" as const },
  { icon: Landmark, label: "Heritage", href: "/destinations?category=heritage", accent: "sand" as const },
  { icon: Mountain, label: "Mountains", href: "/destinations?category=mountains", accent: "forest" as const },
];

const ACCENT_CLASSES = {
  ocean: "bg-ocean-50 text-ocean-700 hover:border-ocean-300",
  forest: "bg-forest-50 text-forest-700 hover:border-forest-300",
  sand: "bg-sand-50 text-sand-700 hover:border-sand-300",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-b from-ocean-50 to-background px-4 py-20 text-center sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary">About Us</p>
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-semibold sm:text-5xl">
          A small team, obsessed with one island
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Visit Sri Lanka helps travelers — local and foreign — discover the island honestly, plan
          confidently, and support the communities that make it worth visiting.
        </p>
      </section>

      <MissionSection />

      {/* Why Visit Sri Lanka */}
      <section className="bg-muted/40 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Why Visit Sri Lanka" title="More packed into one island than most continents" />
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {REASONS.map((reason) => (
              <li
                key={reason}
                className="rounded-xl border border-border bg-card p-5 text-sm text-foreground"
              >
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tourism Categories */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <SectionHeading eyebrow="Explore by Category" title="Four ways to experience the island" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.label}
              href={category.href}
              className={`flex flex-col items-center gap-3 rounded-xl border border-border p-6 text-center transition-colors ${ACCENT_CLASSES[category.accent]}`}
            >
              <category.icon className="h-7 w-7" />
              <span className="font-display font-semibold">{category.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <StatsSection />
      <TeamSection />
    </main>
  );
}
