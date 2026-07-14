import Link from "next/link";
import { Compass, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

import { NAV_LINKS } from "@/lib/constants";

const SOCIAL_LINKS = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter / X", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <Compass className="h-5 w-5" />
            <span className="font-display text-base font-semibold">Visit Sri Lanka</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Beaches, wildlife, heritage, and hill country — planned honestly.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Explore</p>
          {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-primary">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Legal</p>
          {LEGAL_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-primary">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Follow</p>
          <div className="flex gap-2">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">
        © {year} Visit Sri Lanka. All rights reserved.
      </div>
    </footer>
  );
}
