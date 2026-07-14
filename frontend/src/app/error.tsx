"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: send to an error reporting service (Sentry, etc.) in production.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-8 w-8" />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-semibold">Something went wrong</h1>
        <p className="max-w-md text-muted-foreground">
          An unexpected error occurred. You can try again, or head back to the homepage.
        </p>
      </div>
      <Button size="lg" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
