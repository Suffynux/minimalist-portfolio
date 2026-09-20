import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Request-scoped Supabase client for Server Components and Server Actions.
 *
 * Built fresh per request on purpose: Fluid Compute reuses function instances
 * across concurrent requests, so a module-level client would leak one visitor's
 * session into another's.
 *
 * This uses the publishable key, so every query runs as `anon` (or as the
 * signed-in user) and RLS applies. There is deliberately no service-role client
 * anywhere in this codebase - that key bypasses RLS entirely, which would make
 * application code the only thing standing between the internet and the table.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // Safe to ignore: middleware refreshes the session instead.
          }
        }
      }
    }
  );
}
