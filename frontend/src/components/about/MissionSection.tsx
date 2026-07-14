"use client";

import { motion } from "framer-motion";
import { Compass, Heart, ShieldCheck } from "lucide-react";

import { SectionHeading } from "@/components/shared/SectionHeading";

const PILLARS = [
  {
    icon: Compass,
    title: "Show the real island",
    description:
      "Beyond the postcard shots — practical, honest information about beaches, wildlife, heritage and hill country.",
  },
  {
    icon: Heart,
    title: "Support local communities",
    description:
      "We prioritize local guides, family-run hotels, and community-based tourism wherever we can.",
  },
  {
    icon: ShieldCheck,
    title: "Make planning trustworthy",
    description:
      "Transparent pricing, realistic itineraries, and no inflated claims — plan with confidence.",
  },
];

export function MissionSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20">
      <SectionHeading
        eyebrow="Our Mission"
        title="Making Sri Lanka easy to plan, honest to explore"
        subtitle="We started Visit Sri Lanka because planning a trip here — across nine provinces, dozens of climates and cultures — was harder than it should be."
      />
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {PILLARS.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ocean-50 text-primary">
              <pillar.icon className="h-6 w-6" />
            </span>
            <h3 className="font-display text-lg font-semibold">{pillar.title}</h3>
            <p className="text-sm text-muted-foreground">{pillar.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
