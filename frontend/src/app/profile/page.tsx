import type { Metadata } from "next";

import { ProfilePageClient } from "@/components/profile/ProfilePageClient";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View your saved trips, favorite destinations and hotels, and travel history.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
