"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TripPlan {
  _id: string;
  title: string;
  duration: number;
  destinations: string[];
  travelStyle: string;
  createdAt: string;
  owner: { name: string; email: string } | null;
}

export default function AdminTripPlansPage() {
  const [plans, setPlans] = useState<TripPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPlans() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/trip-plans");
      if (!res.ok) throw new Error("Failed to load trip plans");
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  async function handleDelete(_id: string) {
    if (!confirm("Delete this trip plan? This can't be undone.")) return;

    const previous = plans;
    setPlans((current) => current.filter((p) => p._id !== _id));

    try {
      const res = await fetch(`/api/admin/trip-plans?id=${_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete trip plan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPlans(previous);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Trip Plans</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        All trip plans saved by users across the platform.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {loading && <p className="text-sm text-muted-foreground">Loading trip plans...</p>}

        {!loading && plans.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No trip plans saved yet.
          </p>
        )}

        {plans.map((plan) => (
          <Card key={plan._id}>
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-base font-semibold">{plan.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" /> {plan.duration} days
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {plan.destinations?.join(", ")}
                  </span>
                  <Badge variant="secondary">{plan.travelStyle}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {plan.owner ? `${plan.owner.name} · ${plan.owner.email}` : "Unknown user"}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => handleDelete(plan._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}