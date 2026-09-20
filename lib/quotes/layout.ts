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

/**
 * Fraction of the viewport you scroll to advance the deck by one card.
 *
 * Mirrored by `--deck-step` in globals.css. The CSS value sizes the track;
 * this one converts scroll pixels back into a card offset. They have to agree
 * or the last card settles off the end of the track.
 */
export const DECK_STEP_VH = 0.55;

/** How many cards either side of the focus are worth drawing. */
export const DECK_WINDOW = 3;

export type Depth = {
  transform: string;
  opacity: number;
  filter: string;
  /** False once the card has faded out; the caller stops drawing it. */
  visible: boolean;
};

type Tuning = {
  /** Z per card for the stack still ahead of the reader. */
  back: number;
  /** Z per card for a card that has been walked past, toward the camera. */
  past: number;
  /** Lateral and vertical offset per card in the stack. */
  x: number;
  y: number;
  /** Damped offsets once a card is past focus - it mostly flies at you. */
  pastX: number;
  pastY: number;
  yaw: number;
  yawStep: number;
};

const WIDE: Tuning = { back: 185, past: 240, x: 78, y: -48, pastX: 30, pastY: -18, yaw: -8, yawStep: -2.2 };
const NARROW: Tuning = { back: 140, past: 190, x: 34, y: -24, pastX: 14, pastY: -10, yaw: -6, yawStep: -1.6 };

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * Where a card sits, given its signed distance from the focus.
 *
 * `offset` is `index - progress`: 0 is the card being read, positive is still
 * ahead in the stack, negative has been passed. Ahead, a card recedes, dims
 * and blurs gently, so two or three are legible behind the focus at once -
 * that visible stack is what reads as depth. Behind, it rushes the camera and
 * clears out fast, because a card you have read should not hang around.
 */
export function depthAt(offset: number, compact: boolean): Depth {
  const t = compact ? NARROW : WIDE;
  const ahead = offset >= 0;

  const z = ahead ? -offset * t.back : -offset * t.past;
  const x = offset * (ahead ? t.x : t.pastX);
  const y = offset * (ahead ? t.y : t.pastY);
  const yaw = t.yaw + offset * t.yawStep;

  // Falloff is deliberately slow going back: two cards behind the focus have
  // to stay legibly PAPER, not grey ghosts, or the stack stops reading as
  // depth and starts reading as smudge. Going forward it is fast.
  const opacity = clamp01(ahead ? 1 - offset / 3.8 : 1 + offset / 0.9);
  const blur = ahead ? offset * 0.55 : -offset * 5;

  return {
    transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${yaw.toFixed(2)}deg) rotateX(2.5deg)`,
    opacity,
    filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none",
    visible: opacity > 0.015
  };
}
