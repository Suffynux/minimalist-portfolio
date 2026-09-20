import type { Quote } from "@/lib/quotes/types";

export type Placed = Quote & {
  /** Percentage across the field. */
  x: number;
  /** Percentage down the field. */
  y: number;
  /** Depth in px; negative is further away. */
  z: number;
  rotateY: number;
  rotateX: number;
  /** Font size in px, derived from depth so near quotes genuinely read larger. */
  size: number;
  blur: number;
  opacity: number;
  driftX: number;
  driftY: number;
  driftDuration: number;
  driftDelay: number;
  tier: "own" | "curated" | "visitor";
};

/**
 * Deterministic pseudo-random stream from a quote's stored seed.
 *
 * Positions must be stable: a quote that jumps to a new spot on every reload
 * makes the wall feel arbitrary, and breaks the sense that it's a real place
 * you're moving through.
 */
function stream(seed: number) {
  let s = Math.floor(seed * 1_000_000) % 2_147_483_647;
  if (s <= 0) s += 2_147_483_646;
  return () => {
    s = (s * 16_807) % 2_147_483_647;
    return (s - 1) / 2_147_483_646;
  };
}

function tierOf(quote: Quote): Placed["tier"] {
  if (quote.source === "visitor") return "visitor";
  return quote.author_name ? "curated" : "own";
}

/**
 * Distributes quotes through the depth field.
 *
 * Layout is by tier rather than uniformly random: the author's own writing sits
 * nearest and largest, curated quotes fill the middle, and visitor submissions
 * drift furthest back. That way the hierarchy is legible before you read a word.
 */
export function placeQuotes(quotes: Quote[]): Placed[] {
  // Deal quotes into columns so they spread across the field instead of
  // clumping wherever the seeds happen to fall.
  const columns = 5;
  const byTier: Record<Placed["tier"], Quote[]> = { own: [], curated: [], visitor: [] };
  quotes.forEach((q) => byTier[tierOf(q)].push(q));

  const placed: Placed[] = [];
  let index = 0;

  (["own", "curated", "visitor"] as const).forEach((tier) => {
    const group = byTier[tier];

    group.forEach((quote, i) => {
      const rand = stream(quote.seed);

      // Depth bands per tier, with jitter so rows don't line up.
      const band =
        tier === "own" ? { near: 60, far: -220 } : tier === "curated" ? { near: -260, far: -700 } : { near: -700, far: -1180 };

      const t = group.length === 1 ? 0.5 : i / (group.length - 1);
      const z = band.near + (band.far - band.near) * (t * 0.7 + rand() * 0.3);

      // Spread across columns, then jitter within the cell.
      const column = (index * 7 + i * 3) % columns;
      const cellWidth = 100 / columns;
      const x = column * cellWidth + cellWidth * (0.15 + rand() * 0.7);

      // Vertical position walks down the field as depth increases, so scrolling
      // through reveals quotes progressively rather than all at once.
      const y = 8 + ((index * 13.7 + rand() * 22) % 84);

      // Nearer quotes are larger. Clamped so the furthest stay readable.
      const depthRatio = (z + 1180) / 1240;
      const size = 15 + depthRatio * 22;

      placed.push({
        ...quote,
        x,
        y,
        z,
        rotateY: (rand() - 0.5) * 16,
        rotateX: (rand() - 0.5) * 8,
        size,
        blur: z < -700 ? 1.4 : z < -400 ? 0.6 : 0,
        opacity: tier === "visitor" ? 0.55 + depthRatio * 0.25 : 0.7 + depthRatio * 0.3,
        driftX: (rand() - 0.5) * 18,
        driftY: -6 - rand() * 16,
        driftDuration: 14 + rand() * 16,
        driftDelay: -rand() * 12,
        tier
      });

      index += 1;
    });
  });

  // Painter's order: furthest first, so nearer quotes overlap correctly in
  // browsers that flatten some of the 3D context.
  return placed.sort((a, b) => a.z - b.z);
}
