"use client";

import { motion } from "framer-motion";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { TEAM_MEMBERS } from "@/data/team";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export function TeamSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20">
      <SectionHeading
        eyebrow="The Team"
        title="People behind Visit Sri Lanka"
        subtitle="A small team based across the island, building the platform we wished existed when planning our own trips."
      />
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM_MEMBERS.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
          >
            <Card className="h-full">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-50 font-display text-lg font-semibold text-forest-700">
                  {initials(member.name)}
                </span>
                <div>
                  <p className="font-display text-base font-semibold">{member.name}</p>
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary">
                    {member.role}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
