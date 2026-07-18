"use client";

/**
 * Favorites service — client-side fetch wrapper around /api/favorites.
 *
 * Unlike the previous Supabase version, MongoDB has no client-safe direct
 * query layer (no RLS-protected REST endpoint), so every call here goes
 * through a Next.js API route instead of a database client. The route
 * handler derives the user from the session server-side — callers never
 * pass a userId, which also closes a trust gap the Supabase version had
 * (client-supplied userId, enforced only by RLS).
 */

export async function saveFavoriteDestination(destinationId: string) {
  const res = await fetch("/api/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "destination", destinationId }),
  });
  if (!res.ok) throw new Error("Failed to save favorite destination");
}

export async function saveFavoriteHotel(hotelId: string) {
  const res = await fetch("/api/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "hotel", hotelId }),
  });
  if (!res.ok) throw new Error("Failed to save favorite hotel");
}

export async function removeFavorite(favoriteId: string) {
  const res = await fetch(`/api/favorites?id=${favoriteId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to remove favorite");
}

export async function getUserFavorites() {
  const res = await fetch("/api/favorites");
  if (!res.ok) throw new Error("Failed to load favorites");
  return res.json();
}
