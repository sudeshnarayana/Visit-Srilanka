"use client";

import { motion } from "framer-motion";
import { Landmark, Trees, Waves, Sparkles } from "lucide-react";

const STATS = [
  { icon: Landmark, value: "8", label: "UNESCO Heritage Sites" },
  { icon: Trees, value: "26", label: "National Parks" },
  { icon: Waves, value: "1,340 km", label: "of Coastline & Beaches" },
  { icon: Sparkles, value: "2,500+", label: "Years of Recorded History" },
];

export function StatsSection() {
  return (
    <section className="bg-ocean-700 py-16 text-white">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 sm:grid-cols-4">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="flex flex-col items-center gap-2 text-center"
          >
            <stat.icon className="h-6 w-6 text-sand-300" />
            <span className="font-display text-3xl font-bold sm:text-4xl">{stat.value}</span>
            <span className="text-sm text-white/75">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
