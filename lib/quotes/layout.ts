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

/**
 * A stop on the depth curve: what a card looks like at a whole-number offset
 * from the focus. Values between stops are interpolated linearly.
 *
 * These are the design's numbers, not a formula that approximates them:
 *   n    0px      blur 0     op 1
 *   n+1  -185px   blur 1.0   op .60
 *   n+2  -360px   blur 2.4   op .30
 *   n-1  +240px             (walked past, rushing the camera)
 *   n-1.75 +420px           gone
 */
type Stop = { at: number; z: number; blur: number; opacity: number };

const AHEAD_WIDE: Stop[] = [
  { at: 0, z: 0, blur: 0, opacity: 1 },
  { at: 1, z: -185, blur: 1.0, opacity: 0.6 },
  { at: 2, z: -360, blur: 2.4, opacity: 0.3 },
  { at: 3, z: -520, blur: 3.6, opacity: 0.08 },
  { at: 3.5, z: -600, blur: 4, opacity: 0 }
];

const AHEAD_NARROW: Stop[] = [
  { at: 0, z: 0, blur: 0, opacity: 1 },
  { at: 1, z: -140, blur: 1.0, opacity: 0.6 },
  { at: 2, z: -270, blur: 2.4, opacity: 0.3 },
  { at: 3, z: -390, blur: 3.6, opacity: 0.08 },
  { at: 3.5, z: -450, blur: 4, opacity: 0 }
];

/** Past the focus, a card flies at the camera and is gone within two steps. */
const PAST_WIDE: Stop[] = [
  { at: 0, z: 0, blur: 0, opacity: 1 },
  { at: 1, z: 240, blur: 2.5, opacity: 0.35 },
  { at: 1.75, z: 420, blur: 5, opacity: 0 }
];

const PAST_NARROW: Stop[] = [
  { at: 0, z: 0, blur: 0, opacity: 1 },
  { at: 1, z: 190, blur: 2.5, opacity: 0.35 },
  { at: 1.75, z: 330, blur: 5, opacity: 0 }
];

type Drift = { x: number; y: number; yaw: number; yawStep: number; pastX: number; pastY: number };

/** Lateral offset per card, so the stack steps up and to the right. */
const DRIFT_WIDE: Drift = { x: 78, y: -48, yaw: -8, yawStep: -2.2, pastX: 30, pastY: -18 };
const DRIFT_NARROW: Drift = { x: 34, y: -24, yaw: -6, yawStep: -1.6, pastX: 14, pastY: -10 };

function sample(stops: Stop[], at: number): Stop {
  if (at <= stops[0].at) return stops[0];
  const last = stops[stops.length - 1];
  if (at >= last.at) return last;
  for (let i = 1; i < stops.length; i += 1) {
    const b = stops[i];
    if (at > b.at) continue;
    const a = stops[i - 1];
    const t = (at - a.at) / (b.at - a.at);
    return {
      at,
      z: a.z + (b.z - a.z) * t,
      blur: a.blur + (b.blur - a.blur) * t,
      opacity: a.opacity + (b.opacity - a.opacity) * t
    };
  }
  return last;
}

/**
 * Where a card sits, given its signed distance from the focus.
 *
 * `offset` is `index - progress`: 0 is the card being read, positive is still
 * ahead in the stack, negative has been passed. Ahead, a card recedes, dims
 * and blurs so two or three are legible behind the focus at once - that
 * visible stack is what reads as depth. Behind, it rushes the camera and
 * clears out fast, because a card you have read should not hang around.
 */
export function depthAt(offset: number, compact: boolean): Depth {
  const ahead = offset >= 0;
  const stop = sample(ahead ? (compact ? AHEAD_NARROW : AHEAD_WIDE) : compact ? PAST_NARROW : PAST_WIDE, Math.abs(offset));
  const d = compact ? DRIFT_NARROW : DRIFT_WIDE;

  const x = offset * (ahead ? d.x : d.pastX);
  const y = offset * (ahead ? d.y : d.pastY);
  const yaw = d.yaw + offset * d.yawStep;

  return {
    transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${stop.z.toFixed(1)}px) rotateY(${yaw.toFixed(2)}deg) rotateX(2.5deg)`,
    opacity: stop.opacity,
    filter: stop.blur > 0.05 ? `blur(${stop.blur.toFixed(2)}px)` : "none",
    visible: stop.opacity > 0.015
  };
}
