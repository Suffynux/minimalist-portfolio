import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client, used for realtime subscriptions on the quote wall
 * so new submissions appear without a refresh.
 *
 * Only ever carries the publishable key, which is safe to expose: it grants
 * exactly what the RLS policies allow an anonymous visitor to do.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
