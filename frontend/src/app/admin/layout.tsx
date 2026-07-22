import type { ReactNode } from "react";
import Link from "next/link";

import { redirect } from "next/navigation";
import { MapPin, Users, Briefcase, LayoutDashboard, Car } from "lucide-react";

import { auth } from "@/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/trip-plans", label: "Trip Plans", icon: Briefcase },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // Belt-and-braces: middleware already blocks non-admins from /admin,
  // but this catches direct server-side renders/edge cases too.
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl gap-8 px-4 py-10">
      <aside className="w-56 shrink-0">
        <h2 className="mb-6 font-display text-lg font-semibold">Admin</h2>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1">{children}</div>
    </div>
  );
}