import { createClient } from "@/lib/supabase/server";
import type { Hotel, HotelTier } from "@/types/hotel";

/**
 * Hotels service layer — Supabase-backed.
 * Same caveat as lib/api/destinations.ts: the Hotels UI module wasn't
 * actually built in this project yet, but this data layer is ready for it.
 */

function mapRow(row: Record<string, unknown>): Hotel {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    location: row.location as string,
    tier: row.tier as HotelTier,
    pricePerNightUsd: row.price_per_night_usd as number,
    rating: row.rating as number,
    reviewCount: row.review_count as number,
    imageUrl: (row.image_url as string) ?? null,
    amenities: (row.amenities as string[]) ?? [],
    createdAt: row.created_at as string,
  };
}

export async function getHotels(tier?: HotelTier): Promise<Hotel[]> {
  const supabase = await createClient();
  let query = supabase.from("hotels").select("*").order("rating", { ascending: false });

  if (tier) {
    query = query.eq("tier", tier);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRow(data) : null;
}

export async function getHotelsNearDestination(region: string): Promise<Hotel[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("location", region)
    .order("rating", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
