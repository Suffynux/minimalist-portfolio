import type { Quote } from "@/lib/quotes/types";

export type Tier = "own" | "curated" | "visitor";

export type Placed = Quote & {
  tier: Tier;
  /** Position in the deck, 0 = the card on top. */
  index: number;
};

export function tierOf(quote: Quote): Tier {
  if (quote.source === "visitor") return "visitor";
  return quote.author_name ? "curated" : "own";
}

export function placeQuotes(quotes: Quote[]): Placed[] {
  return quotes.map((quote, index) => ({ ...quote, tier: tierOf(quote), index }));
}

/** How many cards either side of the focus are worth drawing. */
export const DECK_WINDOW = 3;

export type Depth = {
  transform: string;
  opacity: number;
  filter: string;
  /** False once the card has faded out; the caller stops drawing it. */
  visible: boolean;
};

/** Keep each quote still around its anchor, with an eased handoff between cards. */
export function readingProgress(progress: number): number {
  const base = Math.floor(progress);
  const t = Math.max(0, Math.min(1, (progress - base - 0.2) / 0.6));
  return base + t * t * (3 - 2 * t);
}

/** Opaque paper prevents the text of stacked quotes bleeding through the reader. */
export function depthAt(offset: number, compact: boolean): Depth {
  const ahead = Math.max(0, offset);
  const past = Math.max(0, -offset);
  const x = ahead * (compact ? 34 : 78);
  const y = ahead * (compact ? -24 : -48);
  const z = -ahead * (compact ? 140 : 185);
  // The outgoing card slides clear before fading; the incoming card stays sharp.
  const exit = Math.min(1, past / 0.8);
  const opacity = past > 0.65 ? Math.max(0, (0.8 - past) / 0.15) : 1;
  const blur = Math.max(0, ahead - 0.65) * 1.2;
  const brightness = Math.max(0.45, 1 - Math.max(0, ahead - 0.5) * 0.22);
  return {
    transform: `translate3d(calc(${x.toFixed(1)}px - ${exit.toFixed(4)} * min(110vw, 1100px)), ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${(-8 - ahead * 2.2).toFixed(2)}deg) rotateX(2.5deg)`,
    opacity,
    filter: blur > 0 ? `brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(2)}px)` : "none",
    visible: offset <= DECK_WINDOW && opacity > 0.015
  };
}
