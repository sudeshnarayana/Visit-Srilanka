import Link from "next/link";
import { Compass } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

/**
 * Shared split-panel shell for /login and /register.
 * The left panel carries the brand gradient (ocean -> forest -> sand) as a
 * quiet signature — no imagery needed, and it reinforces the palette in a
 * moment that's otherwise just a plain form.
 */
export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-ocean-700 via-ocean-500 to-forest-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link href="/" className="flex items-center gap-2 text-white">
          <Compass className="h-6 w-6" />
          <span className="font-display text-xl font-semibold">Visit Sri Lanka</span>
        </Link>
        <div className="flex flex-col gap-4 text-white">
          <p className="font-display text-3xl font-semibold leading-tight">
            Beaches, wildlife, heritage, and hill country — one island, endlessly worth planning.
          </p>
          <p className="max-w-sm text-white/80">
            Save destinations, build itineraries, and track your Sri Lanka journey in one place.
          </p>
        </div>
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sand-500/30 blur-3xl"
        />
      </div>

      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex flex-col gap-2 lg:hidden">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <Compass className="h-5 w-5" />
              <span className="font-display text-lg font-semibold">Visit Sri Lanka</span>
            </Link>
          </div>
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
