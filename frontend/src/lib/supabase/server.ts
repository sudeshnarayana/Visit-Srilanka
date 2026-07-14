import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/types/supabase";

/**
 * Server Component / Route Handler Supabase client.
 * Reads/writes the auth cookie via Next's cookies() store. The `setAll`
 * write can throw when called from a Server Component render (which can't
 * set cookies) — safe to swallow as long as `middleware.ts` is refreshing
 * the session on every request, which it does in this project.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component render — ignore; middleware
            // refreshes the session on the next request instead.
          }
        },
      },
    }
  );
}
