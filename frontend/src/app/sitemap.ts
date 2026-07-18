import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://visitsrilanka.com";

/**
 * Static routes only for now. Once Destinations/Hotels have real UI pages
 * backed by lib/api/destinations.ts and hotels.ts (MongoDB), extend this
 * with generated entries per destination/hotel slug — see
 * docs/architecture.md.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/contact",
    "/trip-planner",
    "/budget-calculator",
    "/login",
    "/register",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
