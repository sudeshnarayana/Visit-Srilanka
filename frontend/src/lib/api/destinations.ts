import { createClient } from "@/lib/supabase/server";
import type { Destination, DestinationCategory } from "@/types/destination";

/**
 * Destinations service layer — Supabase-backed.
 *
 * NOTE: the Destinations *page/UI* (listing + detail pages, DestinationCard,
 * filters) referenced in the original project plan was never actually built
 * in this build — only Trip Planner and Budget Calculator were. These
 * functions exist so that module has a real data layer ready the moment
 * the UI is built; they query the `destinations` table defined in
 * docs/database.md.
 */

function mapRow(row: Record<string, unknown>): Destination {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    category: row.category as DestinationCategory,
    region: row.region as string,
    description: row.description as string,
    imageUrl: (row.image_url as string) ?? null,
    activities: (row.activities as string[]) ?? [],
    createdAt: row.created_at as string,
  };
}

export async function getDestinations(category?: DestinationCategory): Promise<Destination[]> {
  const supabase = await createClient();
  let query = supabase.from("destinations").select("*").order("name");

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRow(data) : null;
}

export async function searchDestinations(query: string): Promise<Destination[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("name");

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
