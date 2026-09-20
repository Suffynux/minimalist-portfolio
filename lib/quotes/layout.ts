import type { Quote } from "@/lib/quotes/types";

export type Tier = "own" | "curated" | "visitor";

export type Placed = Quote & {
  tier: Tier;
  worldX: number;
  worldY: number;
  worldZ: number;
  fontSize: number;
  maxWidth: number;
  attributionOffset: number;
  opacity: number;
  ring: number;
};

/** Golden angle: the spacing that keeps points from ever lining up. */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

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

export type LayoutOptions = {
  /** Viewport aspect ratio, so the field fills wide screens and tightens on phones. */
  aspect: number;
  /** True below ~640px: fewer rings, closer in, larger type. */
  compact: boolean;
};

/**
 * Distributes quotes over a sphere using Fibonacci spacing.
 *
 * A sphere rather than stacked rings: rings leave the poles empty, which is
 * what produced the void above the quotes and the cluster below it. Fibonacci
 * placement gives near-uniform density in every direction, so wherever the
 * camera turns there is something to read and no obvious seam.
 */
export function placeQuotes(quotes: Quote[], options: LayoutOptions): Placed[] {
  const { aspect, compact } = options;

  const ordered = [...quotes].sort((a, b) => {
    // Own words first so they take the nearest shell.
    const rank = (q: Quote) => (tierOf(q) === "own" ? 0 : tierOf(q) === "curated" ? 1 : 2);
    return rank(a) - rank(b) || a.seed - b.seed;
  });

  const count = ordered.length;
  // Wider viewports can carry a deeper field without text shrinking.
  const baseRadius = compact ? 7.4 : 8.6 + Math.min(aspect, 2.2) * 1.1;

  return ordered.map((quote, i) => {
    const rand = stream(quote.seed);
    const tier = tierOf(quote);

    // Fibonacci sphere: y walks evenly from top to bottom, and the golden
    // angle rotates each successive point so they never form visible bands.
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN_ANGLE * i;

    // Tier nudges the shell in or out without breaking the even spread.
    const shell = tier === "own" ? 0.82 : tier === "curated" ? 1 : 1.16;
    const r = baseRadius * shell * (0.94 + rand() * 0.12);

    // Squash vertically: a perfect sphere puts quotes directly overhead and
    // underfoot, which nobody looks at. This keeps them nearer eye level.
    const verticalSquash = compact ? 0.46 : 0.58;

    const lengthFactor = Math.min(quote.body.length / 60, 1.7);
    // Longer quotes get smaller type and a wider box, so a 100-character line
    // occupies roughly the same visual area as a 24-character one.
    const sizeBase = compact ? 0.44 : 0.5;
    const fontSize = (sizeBase / shell) * (1 - (lengthFactor - 1) * 0.14);

    return {
      ...quote,
      tier,
      worldX: Math.cos(theta) * radiusAtY * r,
      worldY: y * r * verticalSquash,
      worldZ: Math.sin(theta) * radiusAtY * r,
      fontSize,
      maxWidth: (compact ? 3.8 : 4.8) + lengthFactor * 1.3,
      attributionOffset: 0.5 + lengthFactor * 0.4,
      opacity: tier === "visitor" ? 0.74 : tier === "curated" ? 0.9 : 1,
      ring: tier === "own" ? 0 : tier === "curated" ? 1 : 2
    };
  });
}
