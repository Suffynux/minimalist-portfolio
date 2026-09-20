import type { Placed, Tier } from "@/lib/quotes/layout";
import type { Quote } from "@/lib/quotes/types";

const SPINE: Record<Tier, string> = {
  own: "bg-olive",
  curated: "bg-olive-light",
  visitor: "bg-sand"
};

const CHIP: Record<Tier, string> = {
  own: "border-olive/30 text-olive",
  curated: "border-olive/25 text-olive",
  visitor: "border-[#8A6E32]/35 text-[#7A5E22]"
};

const CHIP_LABEL: Record<Tier, string> = {
  own: "MINE",
  curated: "COLLECTED",
  visitor: "YOURS"
};

/** Who to credit on the face of the card. Shared with the index below it. */
export function attribution(quote: Quote & { tier: Tier }) {
  if (quote.author_name) return quote.author_name.toUpperCase();
  if (quote.tier === "own") return "SUFIYAN";
  if (quote.posted_by) return `VIA ${quote.posted_by.toUpperCase()}`;
  return "ANONYMOUS";
}

/**
 * One quote as a lit paper card.
 *
 * The surface is the whole point: ink on paper reads at 13.9:1 where the old
 * bone-in-fog text managed about 1.4:1 one step out. Depth is applied by the
 * deck through the wrapper, never here - this component has no idea where in
 * the stack it is.
 */
export function QuoteCard({ quote, onOpen }: { quote: Placed; onOpen?: (quote: Placed) => void }) {
  // Surface, extrude and shadow are the card-anatomy values from the design.
  return (
    <article className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(158deg,#FAF8F1,#EBE8DB)] shadow-[0_2px_0_rgba(255,255,255,0.9)_inset,0_8px_0_-2px_#C4C1AE,0_52px_96px_-24px_rgba(0,0,0,0.92),0_16px_38px_-16px_rgba(0,0,0,0.6)]">
      <span aria-hidden className={`absolute inset-y-0 left-0 w-[5px] ${SPINE[quote.tier]}`} />
      <span aria-hidden className="deck-sheen pointer-events-none absolute inset-x-0 top-0 h-[120px]" />

      <blockquote className="flex flex-col gap-7 px-[clamp(28px,4vw,56px)] py-[clamp(30px,3.6vw,52px)]">
        <p
          className={`font-display text-[clamp(26px,3.4vw,46px)] leading-[1.14] tracking-[-0.015em] text-ink ${
            quote.tier === "own" ? "italic" : ""
          }`}
        >
          {quote.body}
        </p>
        <footer className="flex flex-wrap items-center justify-between gap-3">
          <cite className="font-mono text-[clamp(10px,1.1vw,12px)] not-italic tracking-[0.18em] text-olive">
            — {attribution(quote)}
          </cite>
          <span
            className={`rounded-full border px-3 py-[6px] font-mono text-[10px] tracking-[0.14em] ${CHIP[quote.tier]}`}
          >
            {CHIP_LABEL[quote.tier]}
          </span>
        </footer>
      </blockquote>

      {onOpen ? (
        <button
          type="button"
          onClick={() => onOpen(quote)}
          className="absolute inset-0 rounded-[22px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive-light"
        >
          <span className="sr-only">Hold this quote: {quote.body}</span>
        </button>
      ) : null}
    </article>
  );
}
