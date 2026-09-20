import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Whether the current session belongs to the admin.
 *
 * This is for UI decisions only - what to render, where to redirect. It is
 * never the thing protecting data: every admin query is also gated by RLS
 * policies calling public.is_admin(), so a mistake here cannot leak rows.
 *
 * Email OTP lets anyone obtain a valid `authenticated` session for their own
 * address, so "signed in" and "admin" are genuinely different questions.
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;

  return data === true;
}

export async function getSessionEmail(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user?.email ?? null;
}
