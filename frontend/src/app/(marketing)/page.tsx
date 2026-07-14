import { Button } from "@/components/ui/button";

/**
 * Phase 0 placeholder.
 * This page exists only to verify the project boots correctly:
 * fonts, Tailwind tokens, and shadcn/ui primitives all wired up.
 * Real Home page sections (Hero, Search, Popular Destinations, etc.)
 * are built in Phase 2 — see Architecture doc.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Phase 0 — Setup Verification
      </p>
      <h1 className="font-display text-4xl font-semibold text-primary sm:text-5xl">
        Visit Sri Lanka
      </h1>
      <p className="max-w-md text-muted-foreground">
        Project scaffold is live. Fonts, Tailwind design tokens, and shadcn/ui
        components are configured and ready for Phase 1.
      </p>
      <div className="flex gap-3">
        <Button variant="default">Ocean Primary</Button>
        <Button variant="secondary">Forest Secondary</Button>
        <Button variant="accent">Sand Accent</Button>
      </div>
    </main>
  );
}
