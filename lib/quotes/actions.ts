"use server";

import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { screen } from "@/lib/quotes/screen";
import { submissionSchema } from "@/lib/quotes/types";

export type SubmitState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Set when the quote was held back for review rather than published. */
  held?: boolean;
  fieldErrors?: Partial<Record<"body" | "author_name" | "posted_by", string>>;
};

/**
 * Hashes the caller's IP with a server-side salt.
 *
 * We store a hash rather than the address itself: rate limiting only needs
 * equality, and an IP is personal data that this site has no reason to keep.
 */
async function ipHash() {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const salt = process.env.SUBMISSION_SALT ?? "quote-wall";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function submitQuote(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  const parsed = submissionSchema.safeParse({
    body: formData.get("body"),
    author_name: formData.get("author_name") ?? "",
    posted_by: formData.get("posted_by") ?? "",
    website: formData.get("website") ?? ""
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    // The honeypot is invisible to people, so a failure there is a bot. Return
    // the success shape rather than explaining what gave it away.
    if (flat.website) return { status: "success", message: "Thanks - your words are on the wall." };
    return {
      status: "error",
      message: "Have another look at that.",
      fieldErrors: {
        body: flat.body?.[0],
        author_name: flat.author_name?.[0],
        posted_by: flat.posted_by?.[0]
      }
    };
  }

  const { body, author_name, posted_by } = parsed.data;
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("wall_settings")
    .select("instant_publish,accepting")
    .eq("id", true)
    .single();

  if (settings && !settings.accepting) {
    return { status: "error", message: "The wall is closed to new quotes right now. Check back soon." };
  }

  const { data: rate, error: rateError } = await supabase.rpc("check_submission_rate", {
    p_ip_hash: await ipHash(),
    p_limit: 5
  });

  if (rateError) {
    return { status: "error", message: "Something went wrong on my end. Try again in a moment." };
  }

  const gate = Array.isArray(rate) ? rate[0] : rate;
  if (gate && !gate.allowed) {
    return {
      status: "error",
      message: "That's a few in a row - give it an hour and add another."
    };
  }

  const verdict = screen(body, [author_name, posted_by].filter(Boolean).join(" "));
  // Flagged quotes, and everything when instant publishing is off, are stored
  // hidden. Nothing is ever silently discarded.
  const hold = verdict.flagged || settings?.instant_publish === false;

  // Insert and hide in one statement. A plain insert() followed by an update
  // would leave a flagged quote publicly visible in between - precisely the
  // window that matters for content we want held back.
  const { error } = await supabase.rpc("submit_quote", {
    p_body: body,
    p_author_name: author_name && author_name.length > 0 ? author_name : null,
    p_posted_by: posted_by && posted_by.length > 0 ? posted_by : null,
    p_flagged: verdict.flagged,
    p_flag_reason: verdict.reason,
    p_hold: hold
  });

  if (error) {
    return { status: "error", message: "That didn't save. Try again?" };
  }

  revalidatePath("/quotes");

  return {
    status: "success",
    held: hold,
    message: hold
      ? "Thanks - I'll read this one before it goes up."
      : "Thanks - your words are on the wall."
  };
}
