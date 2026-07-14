import { Loader2 } from "lucide-react";

/**
 * Global fallback shown while a route segment's data/render is in flight.
 * Next.js automatically wraps the segment in a Suspense boundary using this.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-sm">Loading Visit Sri Lanka...</p>
    </div>
  );
}
