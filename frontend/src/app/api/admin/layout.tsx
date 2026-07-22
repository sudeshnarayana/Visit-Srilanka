import { MapPin, Users, Briefcase, LayoutDashboard, Car } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/trip-plans", label: "Trip Plans", icon: Briefcase },
];