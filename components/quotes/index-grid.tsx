import { tierOf } from "@/lib/quotes/layout";
import { attribution } from "@/components/quotes/quote-card";
import type { Quote } from "@/lib/quotes/types";

const SPINE = {
  own: "bg-olive",
  curated: "bg-olive-light",
  visitor: "bg-sand"
} as const;

/**
 * Every quote as plain, server-rendered text.
 *
 * This is what search engines and anyone without JavaScript get, and it is
 * also the fast way around: each entry links to its card's anchor in the deck,
 * so picking one walks the wall straight to it.
 */
export function IndexGrid({ quotes }: { quotes: Quote[] }) {
  return (
    <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {quotes.map((quote) => {
        const tier = tierOf(quote);
        return (
          <li key={quote.id}>
            <a
              href={`#q-${quote.id}`}
              className="relative block h-full overflow-hidden rounded-2xl border border-line bg-surface p-6 pl-7 transition hover:-translate-y-0.5 hover:border-olive/25 hover:shadow-[0_20px_40px_-28px_rgba(35,37,29,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive"
            >
              <span aria-hidden className={`absolute inset-y-0 left-0 w-[3px] ${SPINE[tier]}`} />
              <blockquote>
                <p className={`font-display text-[19px] leading-[1.3] text-ink ${tier === "own" ? "italic" : ""}`}>
                  {quote.body}
                </p>
                <cite className="mt-4 block font-mono text-[10px] not-italic tracking-[0.14em] text-meta">
                  — {attribution({ ...quote, tier })}
                  {/* Only worth saying when the credit line is not already the
                      person who put it up. */}
                  {quote.author_name && quote.posted_by ? (
                    <span className="ml-2 text-muted/70">POSTED BY {quote.posted_by.toUpperCase()}</span>
                  ) : null}
                </cite>
              </blockquote>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
