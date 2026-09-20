import { z } from "zod";

export type QuoteSource = "owner" | "visitor";

/** The seven columns anon is granted. Nothing here is sensitive. */
export type Quote = {
  id: string;
  body: string;
  /** Who said or wrote it. Null means the poster's own words. */
  author_name: string | null;
  /** Who put it on the wall. Null means anonymous. */
  posted_by: string | null;
  source: QuoteSource;
  featured: boolean;
  seed: number;
  created_at: string;
};

/** Adds the moderation columns, which only an authenticated admin can read. */
export type AdminQuote = Quote & {
  visible: boolean;
  flagged: boolean;
  flag_reason: string | null;
  updated_at: string;
};

export type WallSettings = {
  instant_publish: boolean;
  accepting: boolean;
};

export const MAX_BODY = 280;
export const MAX_AUTHOR = 60;

/**
 * Submission schema. Mirrors the database CHECK constraints, because a client
 * limit is advisory - this runs server-side and the DB backs it up.
 */
export const submissionSchema = z.object({
  body: z
    .string()
    .trim()
    .min(3, "That's a little short - say a bit more.")
    .max(MAX_BODY, `Keep it under ${MAX_BODY} characters.`),
  author_name: z
    .string()
    .trim()
    .max(MAX_AUTHOR, `Names need to be under ${MAX_AUTHOR} characters.`)
    .optional()
    .or(z.literal("")),
  posted_by: z
    .string()
    .trim()
    .max(MAX_AUTHOR, `Names need to be under ${MAX_AUTHOR} characters.`)
    .optional()
    .or(z.literal("")),
  // Honeypot: a real person never sees or fills this.
  website: z.string().max(0, "Rejected.").optional()
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const PUBLIC_COLUMNS = "id,body,author_name,posted_by,source,featured,seed,created_at";
