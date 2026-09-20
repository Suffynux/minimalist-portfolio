import { createClient } from "@/lib/supabase/server";
import { PUBLIC_COLUMNS, type Quote, type WallSettings } from "@/lib/quotes/types";

/**
 * Every quote on the public wall.
 *
 * No `visible`/`flagged` filter here: RLS already restricts anon to visible,
 * unflagged rows, and anon isn't even granted those columns. Filtering in the
 * client would only duplicate - and risk contradicting - the database.
 */
export async function getQuotes(limit = 120): Promise<Quote[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quotes")
    .select(PUBLIC_COLUMNS)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getQuotes failed:", error.message);
    return [];
  }

  return (data ?? []) as Quote[];
}

export async function getWallSettings(): Promise<WallSettings> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("wall_settings")
    .select("instant_publish,accepting")
    .eq("id", true)
    .single();

  return data ?? { instant_publish: true, accepting: true };
}
