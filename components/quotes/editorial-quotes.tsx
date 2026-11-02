"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Plus,
  Search,
  X,
} from "lucide-react";
import { tierOf, type Tier } from "@/lib/quotes/layout";
import type { Quote } from "@/lib/quotes/types";
import { SubmitDialog } from "@/components/quotes/submit-dialog";

const filters: { key: "all" | Tier; label: string }[] = [
  { key: "all", label: "All words" },
  { key: "own", label: "My writing" },
  { key: "curated", label: "Collected" },
  { key: "visitor", label: "From you" },
];
const labels: Record<Tier, string> = {
  own: "My writing",
  curated: "Collected",
  visitor: "From the community",
};
const pad = (n: number) => String(n).padStart(2, "0");
function credit(quote: Quote) {
  return (
    quote.author_name ||
    (quote.source === "owner" ? "Sufiyan Ali" : quote.posted_by || "Anonymous")
  );
}

export function EditorialQuotes({
  quotes: initial,
  accepting,
}: {
  quotes: Quote[];
  accepting: boolean;
}) {
  const [quotes, setQuotes] = useState(initial);
  const [filter, setFilter] = useState<"all" | Tier>("all");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(12);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [selected, setSelected] = useState<Quote | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitOpen, setSubmitOpen] = useState(false);
  const reader = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const featured = useMemo(() => {
    const picked = quotes.filter((q) => q.featured);
    return picked.length ? picked : quotes.slice(0, 6);
  }, [quotes]);
  const current = featured[featuredIndex % Math.max(1, featured.length)];
  const counts = useMemo(
    () => ({
      all: quotes.length,
      own: quotes.filter((q) => tierOf(q) === "own").length,
      curated: quotes.filter((q) => tierOf(q) === "curated").length,
      visitor: quotes.filter((q) => tierOf(q) === "visitor").length,
    }),
    [quotes],
  );
  const visible = useMemo(
    () =>
      quotes.filter(
        (q) =>
          (filter === "all" || tierOf(q) === filter) &&
          `${q.body} ${credit(q)}`
            .toLocaleLowerCase()
            .includes(search.trim().toLocaleLowerCase()),
      ),
    [quotes, filter, search],
  );

  function openQuote(quote: Quote) {
    returnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setSelected(quote);
    setFeedback("");
    reader.current?.showModal();
  }
  // Existing quote links keep working, including quotes outside the current filter.
  useEffect(() => {
    const readHash = () => {
      if (!window.location.hash.startsWith("#q-")) return;
      const quote = quotes.find((q) => q.id === window.location.hash.slice(3));
      if (quote) openQuote(quote);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [quotes]);
  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(""), 3500);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  async function copyQuote(quote: Quote) {
    try {
      await navigator.clipboard.writeText(`“${quote.body}” — ${credit(quote)}`);
      setFeedback("Quote copied.");
    } catch {
      setFeedback("Copy unavailable. You can select and copy the quote text.");
    }
  }
  function nextReading(direction: number) {
    if (!selected || !quotes.length) return;
    const index = quotes.findIndex((q) => q.id === selected.id);
    setSelected(quotes[(index + direction + quotes.length) % quotes.length]);
    setFeedback("");
  }

  return (
    <>
      <section className="q-hero" aria-labelledby="quotes-heading">
        <div className="q-kicker">
          <span>
            <i /> THE PERSONAL NOTEBOOK
          </span>
          <span>SUFIYAN ALI / WORDS & REFLECTIONS</span>
        </div>
        <div className="q-hero-layout">
          <h1 id="quotes-heading">
            WORDS
            <br />
            THAT{" "}
            <span>
              STAY
              <svg viewBox="0 0 520 45" aria-hidden="true">
                <path d="M5 31C130 8 333 5 512 16M82 39C222 23 357 23 462 28" />
              </svg>
            </span>
            <span className="q-period">.</span>
          </h1>
          <div className="q-intro">
            <span className="q-quote-mark" aria-hidden="true">
              “
            </span>
            <p>
              A few things I’ve written.
              <br />A few things I keep coming back to.
            </p>
            <p>On building, becoming, and figuring life out along the way.</p>
            <a href="#collection">
              TAKE A MOMENT <ArrowDown size={17} />
            </a>
          </div>
        </div>
        <div className="q-hero-foot">
          <span>LESS NOISE. A LITTLE MORE MEANING.</span>
          <a href="#collection">
            {pad(quotes.length)} WORDS WORTH KEEPING <ArrowDown size={14} />
          </a>
        </div>
      </section>

      {current && (
        <section className="q-spotlight" aria-label="Featured quotes">
          <div className="q-spotlight-aside">
            <p className="q-mono">
              <span className="q-spark">✳</span> A LINE TO SIT WITH
            </p>
            <span className="q-big-mark" aria-hidden="true">
              “
            </span>
            <p className="q-spotlight-note">
              Sometimes, one sentence
              <br />
              is enough.
            </p>
          </div>
          <div className="q-spotlight-main">
            <div
              className="q-featured-text"
              key={current.id}
              aria-live="polite"
              aria-atomic="true"
            >
              <blockquote>{current.body}</blockquote>
              <p className="q-credit">
                — {credit(current)} <span>{labels[tierOf(current)]}</span>
              </p>
            </div>
            <div className="q-spotlight-controls">
              <button
                type="button"
                className="q-text-button"
                onClick={() => openQuote(current)}
              >
                READ THIS LINE <ArrowUpRight size={17} />
              </button>
              <div>
                <span className="q-mono">
                  {pad((featuredIndex % featured.length) + 1)}{" "}
                  <span className="q-muted">/ {pad(featured.length)}</span>
                </span>
                <button
                  type="button"
                  aria-label="Previous featured quote"
                  disabled={featured.length < 2}
                  onClick={() =>
                    setFeaturedIndex(
                      (i) => (i - 1 + featured.length) % featured.length,
                    )
                  }
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next featured quote"
                  disabled={featured.length < 2}
                  onClick={() =>
                    setFeaturedIndex((i) => (i + 1) % featured.length)
                  }
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        id="collection"
        className="q-collection"
        aria-labelledby="collection-heading"
      >
        <div className="q-collection-title">
          <div>
            <p className="q-mono">
              THE ONGOING COLLECTION / {pad(quotes.length)} ENTRIES
            </p>
            <h2 id="collection-heading">
              A thought. <span>A pause.</span>
            </h2>
          </div>
          <p>
            Read slowly. Keep what resonates.
            <br />
            Leave the rest.
          </p>
        </div>
        <div className="q-toolbar">
          <div className="q-filters" role="group" aria-label="Filter quotes">
            {filters.map((f) => (
              <button
                type="button"
                key={f.key}
                aria-pressed={filter === f.key}
                onClick={() => {
                  setFilter(f.key);
                  setLimit(12);
                }}
              >
                {f.label}
                <span>{pad(counts[f.key])}</span>
              </button>
            ))}
          </div>
          <label className="q-search">
            <Search size={16} />
            <span className="sr-only">Search quotes or authors</span>
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setLimit(12);
              }}
              placeholder="Find a word, a thought…"
            />
          </label>
        </div>
        <p className="q-results q-mono" role="status">
          {visible.length === quotes.length
            ? "ALL ENTRIES"
            : `${visible.length} ${visible.length === 1 ? "ENTRY" : "ENTRIES"}`}
          <span>OPEN A LINE TO READ IT</span>
        </p>
        <div className="q-grid">
          {visible.slice(0, limit).map((quote) => (
            <article
              key={quote.id}
              className={`q-card${quote.featured ? " q-card-featured" : ""}`}
            >
              <div className="q-card-top">
                <span>
                  /{pad(quotes.findIndex((q) => q.id === quote.id) + 1)}
                </span>
                <span>{labels[tierOf(quote)]}</span>
                {quote.featured && (
                  <span className="q-card-star" aria-label="Featured">
                    ✳
                  </span>
                )}
              </div>
              <blockquote>
                <p>{quote.body}</p>
                <cite>— {credit(quote)}</cite>
              </blockquote>
              <button
                type="button"
                className="q-card-open"
                onClick={() => openQuote(quote)}
                aria-label={`Read quote: ${quote.body}`}
              >
                <ArrowUpRight size={20} />
              </button>
            </article>
          ))}
        </div>
        {!visible.length && (
          <div className="q-empty">
            <span aria-hidden="true">“ ”</span>
            <h3>
              {search
                ? "No words found. Yet."
                : filter === "own"
                  ? "A page still being written."
                  : "A little room for more."}
            </h3>
            <p>
              {search
                ? "Try another word or an author’s name."
                : filter === "own"
                  ? "My own writing will live here. In the meantime, explore the words I’ve collected."
                  : "There are no quotes in this collection yet."}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
            >
              View all words <ArrowRight size={16} />
            </button>
          </div>
        )}
        {visible.length > limit && (
          <div className="q-load">
            <button type="button" onClick={() => setLimit((n) => n + 12)}>
              A FEW MORE WORDS <Plus size={17} />
            </button>
            <span className="q-mono">
              {Math.min(limit, visible.length)} OF {visible.length}
            </span>
          </div>
        )}
      </section>

      <section className="q-leave">
        <span className="q-spark" aria-hidden="true">
          ✳
        </span>
        <div>
          <p className="q-mono">A NOTE BEFORE YOU GO</p>
          <h2>
            {accepting ? (
              <>
                Some words deserve
                <br />a place to stay.
              </>
            ) : (
              <>
                There’s more
                <br />
                between the lines.
              </>
            )}
          </h2>
          <p>
            {accepting
              ? "Have a line you wrote, or one you never forgot? Leave it here for the next person."
              : "The notebook keeps growing. Come back for another thought, or see what I’ve been building."}
          </p>
        </div>
        {accepting ? (
          <button type="button" onClick={() => setSubmitOpen(true)}>
            LEAVE A QUOTE <Plus size={20} />
          </button>
        ) : (
          <Link href="/projects">
            EXPLORE THE WORK <ArrowUpRight size={20} />
          </Link>
        )}
      </section>

      <dialog
        ref={reader}
        className="q-reader"
        aria-label="Quote reading view"
        onClose={() => {
          setSelected(null);
          setFeedback("");
          returnFocus.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) reader.current?.close();
        }}
      >
        {selected && (
          <div className="q-reader-sheet" data-lenis-prevent>
            <div className="q-reader-top">
              <span className="q-mono">
                SUFFYNUX / {labels[tierOf(selected)]}
              </span>
              <button
                type="button"
                aria-label="Close reading view"
                onClick={() => reader.current?.close()}
              >
                <X size={22} />
              </button>
            </div>
            <span className="q-reader-mark" aria-hidden="true">
              “
            </span>
            <blockquote>
              <p>{selected.body}</p>
              <cite>— {credit(selected)}</cite>
            </blockquote>
            <div className="q-reader-bottom">
              <button type="button" onClick={() => copyQuote(selected)}>
                {feedback === "Quote copied." ? (
                  <Check size={17} />
                ) : (
                  <Copy size={17} />
                )}
                COPY WORDS
              </button>
              <div>
                <button
                  type="button"
                  aria-label="Previous quote"
                  disabled={quotes.length < 2}
                  onClick={() => nextReading(-1)}
                >
                  <ArrowLeft size={19} />
                </button>
                <span className="q-mono">
                  {pad(quotes.findIndex((q) => q.id === selected.id) + 1)} /{" "}
                  {pad(quotes.length)}
                </span>
                <button
                  type="button"
                  aria-label="Next quote"
                  disabled={quotes.length < 2}
                  onClick={() => nextReading(1)}
                >
                  <ArrowRight size={19} />
                </button>
              </div>
            </div>
            <p className="q-copy-status" role="status">
              {feedback}
            </p>
          </div>
        )}
      </dialog>
      {submitOpen && (
        <div className="q-contribution">
          <SubmitDialog
            open
            onClose={() => setSubmitOpen(false)}
            onPosted={(quote) => {
              setQuotes((previous) =>
                previous.some((q) => q.id === quote.id)
                  ? previous
                  : [quote, ...previous],
              );
              setFilter("all");
              setSearch("");
            }}
          />
        </div>
      )}
    </>
  );
}
