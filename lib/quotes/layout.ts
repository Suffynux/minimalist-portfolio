import type { Quote } from "@/lib/quotes/types";

export type Tier = "own" | "curated" | "visitor";

export type Placed = Quote & {
  tier: Tier;
  /** World-space position in the WebGL scene. */
  worldX: number;
  worldY: number;
  worldZ: number;
  fontSize: number;
  maxWidth: number;
  attributionOffset: number;
  opacity: number;
  /** Ring index, used by the orbit controls to step between quotes. */
  ring: number;
};

/**
 * Deterministic pseudo-random stream from a quote's stored seed.
 *
 * Positions must be stable across reloads: a wall that reshuffles itself never
 * feels like a place you're moving through.
 */
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
 * Arranges quotes on nested cylindrical rings around the camera.
 *
 * A cylinder rather than a scattered cloud, because it gives the scene a
 * centre: you rotate to browse, and every quote eventually faces you. Tier
 * decides the radius, so the author's own lines orbit closest.
 */
export function placeQuotes(quotes: Quote[]): Placed[] {
  const byTier: Record<Tier, Quote[]> = { own: [], curated: [], visitor: [] };
  quotes.forEach((q) => byTier[tierOf(q)].push(q));

  const RINGS: Record<Tier, { radius: number; size: number; ring: number }> = {
    own: { radius: 6.5, size: 0.52, ring: 0 },
    curated: { radius: 11, size: 0.42, ring: 1 },
    visitor: { radius: 15.5, size: 0.34, ring: 2 }
  };

  const placed: Placed[] = [];

  (Object.keys(RINGS) as Tier[]).forEach((tier) => {
    const group = byTier[tier];
    if (group.length === 0) return;

    const { radius, size, ring } = RINGS[tier];

    group.forEach((quote, i) => {
      const rand = stream(quote.seed);

      // Even angular spacing keeps quotes from stacking, with a little jitter
      // so the ring doesn't look mechanical.
      const angle = (i / group.length) * Math.PI * 2 + (rand() - 0.5) * 0.28;
      const r = radius + (rand() - 0.5) * 2.2;

      // Stagger height so a ring reads as a band of quotes, not a flat hoop.
      const height = (rand() - 0.5) * 7.5;

      // Longer quotes get a wider box and slightly smaller type, so a
      // 100-character line doesn't dwarf a 24-character one.
      const lengthFactor = Math.min(quote.body.length / 60, 1.6);
      const fontSize = size * (1 - (lengthFactor - 1) * 0.12);

      placed.push({
        ...quote,
        tier,
        worldX: Math.sin(angle) * r,
        worldY: height,
        worldZ: Math.cos(angle) * r,
        fontSize,
        maxWidth: 4.6 + lengthFactor * 1.4,
        attributionOffset: 0.55 + lengthFactor * 0.42,
        opacity: tier === "visitor" ? 0.72 : tier === "curated" ? 0.88 : 1,
        ring
      });
    });
  });

  return placed;
}
