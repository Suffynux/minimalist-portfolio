"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Plus, X } from "lucide-react";
import {
  DECK_STEP_VH,
  DECK_WINDOW,
  depthAt,
  placeQuotes,
  tierOf,
  type Placed,
  type Tier
} from "@/lib/quotes/layout";
import type { Quote } from "@/lib/quotes/types";
import { QuoteCard, attribution } from "@/components/quotes/quote-card";
import { SubmitDialog } from "@/components/quotes/submit-dialog";

const FILTERS: { key: Tier | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "own", label: "Mine" },
  { key: "curated", label: "Collected" },
  { key: "visitor", label: "Yours" }
];

const clamp = (n: number, min: number, max: number) => (n < min ? min : n > max ? max : n);

/**
 * The wall: a deck of quote cards laid out along Z, walked by page scroll.
 *
 * The stage is sticky inside a track that is one `--deck-step` tall per quote,
 * so scroll offset maps straight onto a position in the deck. Nothing here
 * animates on a timer - the reader's scroll IS the animation, which makes the
 * walk reversible, interruptible and deep-linkable, and leaves the page with
 * exactly one scroll axis instead of a drag fighting the browser.
 *
 * Card transforms are written to the DOM from a rAF loop rather than through
 * React state: at 120 quotes a re-render per frame is not affordable, and only
 * transform/opacity/filter change, so the deck stays on the compositor.
 */
export function Wall({ quotes: initial, accepting }: { quotes: Quote[]; accepting: boolean }) {
  const reduceMotion = useReducedMotion();
  const [quotes, setQuotes] = useState(initial);
  const [filter, setFilter] = useState<Tier | "all">("all");
  const [focused, setFocused] = useState(0);
  const [open, setOpen] = useState<Placed | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const visible = useMemo(() => {
    const kept = filter === "all" ? quotes : quotes.filter((q) => tierOf(q) === filter);
    return placeQuotes(kept);
  }, [quotes, filter]);

  const count = visible.length;
  const still = Boolean(reduceMotion);

  // The walk. Recreated whenever the deck's length changes, because the track
  // height - and so the scroll-to-progress mapping - changes with it.
  useEffect(() => {
    const track = trackRef.current;
    if (still || !track || count === 0) return;

    let frame = 0;
    let trackTop = 0;
    let stepPx = 1;
    let lastFocus = -1;

    const measure = () => {
      stepPx = Math.max(window.innerHeight * DECK_STEP_VH, 1);
      trackTop = track.getBoundingClientRect().top + window.scrollY;
    };

    const draw = () => {
      frame = 0;
      const progress = clamp((window.scrollY - trackTop) / stepPx, 0, count - 1);
      const narrow = window.innerWidth < 640;

      for (let i = 0; i < count; i += 1) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const offset = i - progress;
        // Cards well outside the window cannot be seen; taking them out of the
        // layer tree keeps the frame cost flat however long the wall gets.
        if (Math.abs(offset) > DECK_WINDOW) {
          if (el.style.display !== "none") el.style.display = "none";
          continue;
        }

        const depth = depthAt(offset, narrow);
        if (!depth.visible) {
          el.style.display = "none";
          continue;
        }

        el.style.display = "";
        el.style.transform = depth.transform;
        el.style.opacity = depth.opacity.toFixed(3);
        el.style.filter = depth.filter;
        // `filter` flattens each card into its own plane, so sibling order is
        // not sorted by Z for us. Paint order is set explicitly instead.
        el.style.zIndex = String(1000 - Math.round(Math.abs(offset) * 10));
        // Only the card actually in focus should take a click.
        el.style.pointerEvents = Math.abs(offset) < 0.5 ? "auto" : "none";
      }

      const next = clamp(Math.round(progress), 0, count - 1);
      if (next !== lastFocus) {
        lastFocus = next;
        setFocused(next);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const remeasure = () => {
      measure();
      schedule();
    };

    measure();
    draw();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
    };
  }, [still, count]);

  // A link into the deck (#q-<id>, from the index below) always lands, even
  // when the quote it names is filtered out of the current view.
  useEffect(() => {
    const fromHash = () => {
      if (!window.location.hash.startsWith("#q-")) return;
      setFilter("all");
      setPendingId(window.location.hash.slice(3));
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // Runs after the deck has re-rendered with the target in it, so the anchor
  // exists and sits at its final offset.
  useEffect(() => {
    if (!pendingId) return;
    document.getElementById(`q-${pendingId}`)?.scrollIntoView({ block: "start" });
    setPendingId(null);
  }, [pendingId, visible]);

  const closeOpen = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeOpen();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeOpen]);

  const applyFilter = useCallback((key: Tier | "all") => {
    setFilter(key);
    setFocused(0);
    const track = trackRef.current;
    if (track) window.scrollTo({ top: track.getBoundingClientRect().top + window.scrollY });
  }, []);

  /** A freshly posted quote joins the deck and the walk turns to face it. */
  const handlePosted = useCallback((quote: Quote) => {
    setQuotes((prev) => [...prev, quote]);
    setFilter("all");
    setPendingId(quote.id);
  }, []);

  if (count === 0) {
    return (
      <div className="relative z-10 mx-auto max-w-[1200px] px-5 py-20 text-center sm:px-8">
        <p className="font-display text-[26px] italic text-olive">nothing on the wall under that filter</p>
      </div>
    );
  }

  return (
    <>
      <div
        ref={trackRef}
        className="deck-track relative w-full bg-wall"
        style={{ height: `calc(100svh + ${count} * var(--deck-step))` }}
      >
        {/* Scroll anchors, one per card, at the exact offset that brings it
            into focus. This is what makes a quote linkable. */}
        {visible.map((quote, i) => (
          <span
            key={quote.id}
            id={`q-${quote.id}`}
            aria-hidden
            className="pointer-events-none absolute left-0 h-px w-px"
            style={{ top: `calc(${i} * var(--deck-step))` }}
          />
        ))}

        <div className="deck-stage sticky top-0 h-[100svh] w-full overflow-hidden bg-[radial-gradient(ellipse_88%_66%_at_46%_40%,#1D2013_0%,#131409_58%,#0A0B05_100%)]">
          <div aria-hidden className="deck-floor pointer-events-none absolute -left-[200px] -right-[200px] -bottom-[120px] h-[460px]" />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[14px]"
            style={{ background: "radial-gradient(ellipse at center, rgba(157,171,107,0.20) 0%, rgba(157,171,107,0) 68%)" }}
          />

          {visible.map((quote, i) => (
            <div
              key={quote.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="deck-card absolute inset-0 m-auto h-fit w-[min(690px,86vw)]"
              style={{ opacity: 0 }}
            >
              <QuoteCard quote={quote} onOpen={setOpen} />
            </div>
          ))}

          {/* Where you are in the deck. The rail needs room the card does not
              leave on a phone, so below `sm` the count moves to the bottom bar. */}
          <div className="deck-rail pointer-events-none absolute right-7 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-4 sm:flex">
            <p className="font-mono text-[13px] tracking-[0.16em] text-bone">
              {String(focused + 1).padStart(2, "0")}
              <span className="text-bone/35"> / {String(count).padStart(2, "0")}</span>
            </p>
            <div className="h-[220px] w-px bg-bone/20">
              <div
                className="w-px bg-olive-light transition-[height] duration-300"
                style={{ height: `${count > 1 ? (focused / (count - 1)) * 100 : 100}%` }}
              />
            </div>
          </div>

          {/* Filters. Cleared of the fixed navbar. */}
          <nav
            aria-label="Filter quotes"
            className="deck-chrome-top absolute inset-x-0 top-0 flex max-w-full justify-start overflow-x-auto px-4 pt-[88px] [scrollbar-width:none] sm:overflow-visible sm:px-7 sm:pt-[100px]"
          >
            <div className="flex shrink-0 gap-1.5 rounded-full border border-bone/12 bg-wall/70 p-1 backdrop-blur">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => applyFilter(f.key)}
                  aria-pressed={filter === f.key}
                  className={`min-h-[44px] rounded-full px-3.5 font-mono text-[10.5px] tracking-[0.1em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-light sm:px-5 ${
                    filter === f.key ? "bg-bone text-ink" : "text-bone/60 hover:text-bone"
                  }`}
                >
                  {f.label.toUpperCase()}
                </button>
              ))}
            </div>
          </nav>

          <div className="deck-chrome-bottom pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-4 pb-[calc(96px+env(safe-area-inset-bottom))] sm:px-7 md:pb-9">
            <p className="font-mono text-[10px] tracking-[0.14em] text-bone/45 sm:text-[11px]">
              <span className="text-bone sm:hidden">
                {String(focused + 1).padStart(2, "0")}
                <span className="text-bone/35"> / {String(count).padStart(2, "0")}</span>
                <span className="text-bone/30"> · </span>
              </span>
              SCROLL TO WALK
              <span className="hidden sm:inline"> THE WALL · TAP A CARD TO HOLD IT</span>
            </p>

            {accepting ? (
              <button
                type="button"
                onClick={() => setSubmitOpen(true)}
                className="pointer-events-auto inline-flex h-12 items-center gap-2 rounded-full bg-bone px-5 font-semibold text-ink shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] transition hover:-translate-y-0.5 hover:bg-olive-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-light"
              >
                <Plus className="size-[16px]" />
                <span className="hidden sm:inline">Add yours</span>
                <span className="sr-only sm:hidden">Add your quote</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {open ? <OpenQuote quote={open} onClose={closeOpen} /> : null}
      <SubmitDialog open={submitOpen} onClose={() => setSubmitOpen(false)} onPosted={handlePosted} />
    </>
  );
}

function OpenQuote({ quote, onClose }: { quote: Placed; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-wall/95 px-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Quote"
      onClick={onClose}
    >
      <figure className="max-w-[820px] text-center" onClick={(e) => e.stopPropagation()}>
        <p className="font-display text-[clamp(30px,5.4vw,64px)] font-normal leading-[1.14] tracking-[-0.02em] text-bone">
          {quote.body}
        </p>
        <figcaption className="mt-8 flex flex-col gap-1.5 font-mono text-[12px] tracking-[0.16em] text-olive-light">
          <span>— {attribution(quote)}</span>
          <span className="text-[10.5px] tracking-[0.12em] text-bone/40">
            {quote.posted_by ? `POSTED BY ${quote.posted_by.toUpperCase()}` : "POSTED ANONYMOUSLY"}
          </span>
        </figcaption>
      </figure>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close quote"
        className="absolute right-6 top-6 inline-flex size-11 items-center justify-center rounded-full border border-bone/25 text-bone transition hover:border-bone hover:bg-bone/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
      >
        <X className="size-[18px]" />
      </button>
    </div>
  );
}
