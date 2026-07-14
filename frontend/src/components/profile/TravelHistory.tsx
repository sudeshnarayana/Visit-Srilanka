"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

import type { TravelHistoryEntry } from "@/types/user";

interface TravelHistoryProps {
  entries: TravelHistoryEntry[];
}

export function TravelHistory({ entries }: TravelHistoryProps) {
  if (entries.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No travel history recorded yet.
      </p>
    );
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(b.visitedOn).getTime() - new Date(a.visitedOn).getTime()
  );

  return (
    <ol className="relative flex flex-col gap-6 border-l border-border pl-6">
      {sorted.map((entry, index) => (
        <motion.li
          key={entry.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="relative"
        >
          <span className="absolute -left-[1.85rem] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MapPin className="h-3 w-3" />
          </span>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <p className="font-display text-base font-semibold">{entry.destination}</p>
              <span className="text-xs text-muted-foreground">
                {new Date(entry.visitedOn).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            {entry.note && <p className="text-sm text-muted-foreground">{entry.note}</p>}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
