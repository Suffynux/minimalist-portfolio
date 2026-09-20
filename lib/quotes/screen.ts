import "server-only";

import {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers
} from "obscenity";

/**
 * Screens a submission before it goes live.
 *
 * Deliberately does NOT reject: a flagged quote is stored hidden and waits for
 * a human. A false positive delays someone's genuine submission rather than
 * silently destroying it, and the Scunthorpe problem guarantees false
 * positives eventually.
 *
 * The transformers handle obfuscation (leetspeak, padded characters, repeated
 * letters), which a plain wordlist misses.
 */
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers
});

const censor = new TextCensor();

/** Links are the main spam vector on a public form. */
const LINK_PATTERN = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|ru|cn|xyz|top|link)\b)/i;

/** A wall of capitals is shouting, not a quote. */
function isShouting(text: string) {
  const letters = text.replace(/[^a-z]/gi, "");
  if (letters.length < 12) return false;
  const upper = letters.replace(/[^A-Z]/g, "").length;
  return upper / letters.length > 0.8;
}

export type ScreenResult = {
  flagged: boolean;
  reason: string | null;
  /** Profanity masked out, for safe display in the admin queue. */
  preview: string;
};

export function screen(body: string, authorName?: string | null): ScreenResult {
  const combined = [body, authorName ?? ""].join(" ");
  const reasons: string[] = [];

  const matches = matcher.getAllMatches(body, true);
  if (matches.length > 0) reasons.push("profanity");
  if (matcher.hasMatch(authorName ?? "")) reasons.push("profanity in name");
  if (LINK_PATTERN.test(combined)) reasons.push("contains a link");
  if (isShouting(body)) reasons.push("all caps");

  // Repeated characters well past what writing needs: "aaaaaaaaaaa".
  if (/(.)\1{9,}/.test(body)) reasons.push("repeated characters");

  return {
    flagged: reasons.length > 0,
    reason: reasons.length > 0 ? reasons.join(", ") : null,
    preview: matches.length > 0 ? censor.applyTo(body, matches) : body
  };
}
