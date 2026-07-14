"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Favorites service — backs FavoritePlaces on the profile page.
 * Client-side (not server) because it's called directly from interactive
 * buttons (heart/save icons) throughout the site, always for the signed-in
 * user's own row — RLS policies in docs/database.md enforce that.
 */

export async function saveFavoriteDestination(userId: string, destinationId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, destination_id: destinationId, type: "destination" });
  if (error) throw error;
}

export async function saveFavoriteHotel(userId: string, hotelId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, hotel_id: hotelId, type: "hotel" });
  if (error) throw error;
}

export async function removeFavorite(favoriteId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("favorites").delete().eq("id", favoriteId);
  if (error) throw error;
}

export async function getUserFavorites(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("favorites")
    .select("*, destinations(*), hotels(*)")
    .eq("user_id", userId);
  if (error) throw error;
  return data ?? [];
}
