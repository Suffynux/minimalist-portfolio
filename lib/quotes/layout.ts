import type { Quote } from "@/lib/quotes/types";

export type Tier = "own" | "curated" | "visitor";

export type Placed = Quote & {
  tier: Tier;
  /** Position in the procession, 0 = first. */
  index: number;
  /** World position. The corridor runs along -Z. */
  worldX: number;
  worldY: number;
  worldZ: number;
};

/** Distance between consecutive quotes along the corridor. */
export const STEP = 9;
/** How far in front of the camera a quote sits when it is the one in focus. */
export const FOCAL = 6.2;

function stream(seed: number) {
  let s = Math.floor(seed * 1_000_000) % 2_147_483_647;
  if (s <= 0) s += 2_147_483_646;
  return () => {
    s = (s * 16_807) % 2_147_483_647;
    return (s - 1) / 2_147_483_646;
  };
}

export function tierOf(quote: Quote): Tier {
  if (quote.source === "visitor") return "visitor";
  return quote.author_name ? "curated" : "own";
}

/**
 * Lays quotes out one after another along a corridor.
 *
 * The camera walks forward through them, so at any moment exactly one quote
 * is at reading distance and the rest are ahead in the fog or already passed.
 * That is what makes this readable on a phone: the composition is always a
 * single line of text sized to the screen, never a field of fragments.
 *
 * The small lateral drift keeps the walk from feeling like a slideshow on
 * rails, while staying well inside the readable zone.
 */
export function placeQuotes(quotes: Quote[]): Placed[] {
  return quotes.map((quote, index) => {
    const rand = stream(quote.seed);
    return {
      ...quote,
      tier: tierOf(quote),
      index,
      worldX: (rand() - 0.5) * 1.6,
      worldY: (rand() - 0.5) * 0.9,
      worldZ: -index * STEP
    };
  });
}

/** Camera Z for a given (fractional) position in the procession. */
export function cameraZ(progress: number) {
  return -progress * STEP + FOCAL;
}
