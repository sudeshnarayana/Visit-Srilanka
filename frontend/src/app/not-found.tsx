import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ocean-50 text-primary">
        <Compass className="h-8 w-8" />
      </span>
      <div className="flex flex-col gap-2">
        <p className="font-display text-6xl font-bold text-primary">404</p>
        <h1 className="font-display text-2xl font-semibold">Looks like you have wandered off the map</h1>
        <p className="max-w-md text-muted-foreground">
          The page you are looking for does not exist — maybe it moved, or the trail ends here.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild size="lg">
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/trip-planner">Plan a Trip</Link>
        </Button>
      </div>
    </main>
  );
}
