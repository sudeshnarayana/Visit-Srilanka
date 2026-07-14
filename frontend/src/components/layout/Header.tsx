"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <Compass className="h-6 w-6" />
          <span className="font-display text-lg font-semibold">Visit Sri Lanka</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-ocean-50 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!isLoading && isAuthenticated ? (
            <Button asChild size="sm">
              <Link href="/profile">My Profile</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium",
                  pathname === link.href
                    ? "bg-ocean-50 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {!isLoading && isAuthenticated ? (
              <Button asChild size="sm" onClick={() => setMobileOpen(false)}>
                <Link href="/profile">My Profile</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" onClick={() => setMobileOpen(false)}>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild size="sm" onClick={() => setMobileOpen(false)}>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
