/**
 * Placeholder for Supabase's generated database types.
 *
 * Once the project exists, generate the real file with:
 *   npx supabase gen types typescript --project-id <project-id> > src/types/supabase.ts
 *
 * Until then, `Database` is loosely typed so lib/supabase/client.ts and
 * server.ts compile — every table query in lib/api/ still gets type
 * checking against the interfaces in types/destination.ts, types/hotel.ts,
 * etc. on the way in/out, just not against the raw DB row shape.
 */
export type Database = {
  public: {
    Tables: Record<string, { Row: Record<string, unknown> }>;
  };
};
