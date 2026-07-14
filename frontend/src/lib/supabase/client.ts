import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/supabase";

/**
 * Client Component / browser-side Supabase client.
 * Use inside "use client" components and client hooks (e.g. useAuth).
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
