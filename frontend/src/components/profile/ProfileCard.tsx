"use client";

import { motion } from "framer-motion";
import { LogOut, MapPin, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { User } from "@/types/user";

interface ProfileCardProps {
  user: User;
  onLogout?: () => void;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const ROLE_LABELS: Record<User["role"], string> = {
  TOURIST: "Traveler",
  HOTEL_PARTNER: "Hotel Partner",
  ADMIN: "Admin",
};

export function ProfileCard({ user, onLogout }: ProfileCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-ocean-600 via-ocean-500 to-forest-600" />
        <CardContent className="flex flex-col gap-4 pt-0">
          <div className="-mt-10 flex items-end justify-between">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-card bg-sand-500 font-display text-2xl font-semibold text-white">
              {initials(user.name)}
            </span>
            <Button variant="outline" size="sm" className="gap-2">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="font-display text-xl font-semibold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
            {user.country && (
              <Badge variant="outline" className="gap-1">
                <MapPin className="h-3 w-3" /> {user.country}
              </Badge>
            )}
            <Badge variant="muted">
              Member since {new Date(user.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </Badge>
          </div>

          <Button variant="ghost" size="sm" onClick={onLogout} className="mt-2 w-fit gap-2 text-muted-foreground">
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
