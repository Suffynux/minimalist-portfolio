"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowDown, LayoutGrid, Mouse, Plus, X } from "lucide-react";
import { DECK_WINDOW, depthAt, readingProgress, placeQuotes, tierOf, type Placed, type Tier } from "@/lib/quotes/layout";
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
const pad = (n: number) => String(n).padStart(2, "0");

const ROUND =
  "pointer-events-auto inline-flex items-center justify-center rounded-full border border-bone/15 bg-wall/70 text-bone/80 backdrop-blur transition hover:border-bone/40 hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-light";

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
  const [listViewport, setListViewport] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px), (max-height: 700px)");
    const update = () => setListViewport(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const [filter, setFilter] = useState<Tier | "all">("all");
  const [focused, setFocused] = useState(0);
  const [open, setOpen] = useState<Placed | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const counts = useMemo(() => {
    const c: Record<Tier | "all", number> = { all: quotes.length, own: 0, curated: 0, visitor: 0 };
    quotes.forEach((q) => (c[tierOf(q)] += 1));
    return c;
  }, [quotes]);

  const visible = useMemo(() => {
    const kept = filter === "all" ? quotes : quotes.filter((q) => tierOf(q) === filter);
    return placeQuotes(kept);
  }, [quotes, filter]);

  const count = visible.length;
  const still = Boolean(reduceMotion) || listViewport;

  // The walk. Recreated whenever the deck's length changes, because the track
  // height - and so the scroll-to-progress mapping - changes with it.
  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (still) {
      cardRefs.current.forEach((el) => {
        if (!el) return;
        el.inert = false;
        el.style.display = "";
        el.style.pointerEvents = "auto";
      });
      return;
    }
    if (!track || !stage || count === 0) return;

    let frame = 0;
    let trackTop = 0;
    let stepPx = 1;
    let lastFocus = -1;

    // The step is measured from the DOM, not derived from innerHeight: the
    // track is sized in svh by CSS, and on a phone innerHeight moves with the
    // URL bar while svh does not. Deriving both from the same element is the
    // only way they agree, and if they disagree the last card settles off the
    // end of the track.
    const measure = () => {
      const scrollable = track.offsetHeight - stage.offsetHeight;
      stepPx = Math.max(scrollable / count, 1);
      trackTop = track.getBoundingClientRect().top + window.scrollY;
    };

    const draw = () => {
      frame = 0;
      const progress = readingProgress(clamp((window.scrollY - trackTop) / stepPx, 0, count - 1));
      const narrow = window.innerWidth < 640;

      for (let i = 0; i < count; i += 1) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const offset = i - progress;
        // Cards well outside the window cannot be seen; taking them out of the
        // layer tree keeps the frame cost flat however long the wall gets.
        if (Math.abs(offset) > DECK_WINDOW) {
          if (el.style.display !== "none") el.style.display = "none";
          el.inert = true;
          continue;
        }

        const depth = depthAt(offset, narrow);
        if (!depth.visible) {
          el.style.display = "none";
          el.inert = true;
          continue;
        }

        el.style.display = "";
        el.style.transform = depth.transform;
        el.style.opacity = depth.opacity.toFixed(3);
        el.style.filter = depth.filter;
        // `filter` flattens each card into its own plane, so sibling order is
        // not sorted by Z for us. Paint order is set explicitly instead.
        el.style.zIndex = String(1000 - i);
        // Only the card actually in focus should take a click.
        el.style.pointerEvents = Math.abs(offset) < 0.5 ? "auto" : "none";
        el.inert = Math.abs(offset) >= 0.5;
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
  }, [still, visible, count]);

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
  }, [pendingId, visible, still]);

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
    if (track) window.scrollTo({ top: track.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
  }, []);

  /** A freshly posted quote joins the deck and the walk turns to face it. */
  const handlePosted = useCallback((quote: Quote) => {
    setQuotes((prev) => [...prev, quote]);
    setFilter("all");
    setPendingId(quote.id);
  }, []);

  const progressPct = count > 1 ? (focused / (count - 1)) * 100 : 100;

  return (
    <>
      <div
        ref={trackRef}
        className="deck-track relative w-full bg-wall"
        style={{ height: `calc(100svh + ${count} * var(--deck-step))` }}
      >
        {/* Scroll anchors, one per card, at the exact offset that brings it
            into focus. This is what makes a quote linkable. */}
        {!still && visible.map((quote, i) => (
          <span
            key={quote.id}
            id={`q-${quote.id}`}
            aria-hidden
            className="pointer-events-none absolute left-0 h-px w-px"
            style={{ top: `calc(${i} * var(--deck-step))` }}
          />
        ))}

        <div
          ref={stageRef}
          className="deck-stage sticky top-0 h-[100svh] w-full overflow-hidden bg-[radial-gradient(ellipse_88%_66%_at_46%_40%,#1D2013_0%,#131409_58%,#0A0B05_100%)]"
        >
          <div aria-hidden className="deck-floor pointer-events-none absolute -bottom-[120px] -left-[200px] -right-[200px] h-[460px]" />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[14px]"
            style={{ background: "radial-gradient(ellipse at center, rgba(157,171,107,0.20) 0%, rgba(157,171,107,0) 68%)" }}
          />

          {count === 0 ? (
            <p className="absolute inset-0 flex items-center justify-center px-6 text-center font-display text-[26px] italic text-olive-light">
              nothing on the wall under that filter
            </p>
          ) : null}

          {visible.map((quote, i) => (
            <div
              key={quote.id}
              id={still ? `q-${quote.id}` : undefined}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="deck-card absolute inset-0 m-auto h-fit w-[min(690px,86vw)]"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {still ? <p className="mb-3 font-mono text-[11px] tracking-[0.16em] text-olive-light">{pad(i + 1)} <span className="text-bone/45">/ {pad(count)}</span></p> : null}
              <QuoteCard quote={quote} onOpen={setOpen} />
            </div>
          ))}

          {/* ---- Chrome: top. Title, and the filters under it. ---- */}
          <div className="deck-chrome-top z-[1100] absolute inset-x-0 top-0 flex flex-col gap-5 px-4 pt-[84px] sm:gap-7 sm:px-10 sm:pt-[96px]">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="font-mono text-[10.5px] tracking-[0.18em] text-olive-light sm:text-[11px]">
                  THE WALL<span className="hidden sm:inline"> · {quotes.length} LINES</span>
                </p>
                <h1 className="mt-2.5 font-display text-[clamp(34px,3.2vw,46px)] font-normal leading-none tracking-[-0.02em] text-bone sm:block">
                  Words worth <span className="italic text-olive-light">keeping</span>.
                </h1>
              </div>
              {/* On a phone the count lives up here; the rail has no room. */}
              <p className="font-mono text-[13px] tracking-[0.16em] text-bone sm:hidden">
                {still ? `${pad(count)} LINES` : <>
                  {pad(count ? focused + 1 : 0)}
                  <span className="text-bone/35"> / {pad(count)}</span>
                </>}
              </p>
            </div>

            <nav
              aria-label="Filter quotes"
              className="-mx-4 flex max-w-full overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0"
            >
              <div className="flex shrink-0 gap-1 rounded-full border border-bone/12 bg-wall/70 p-1.5 backdrop-blur">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => applyFilter(f.key)}
                    aria-pressed={filter === f.key}
                    className={`min-h-[44px] rounded-full px-4 font-mono text-[10.5px] tracking-[0.14em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-light sm:px-6 ${
                      filter === f.key ? "bg-bone text-ink" : "text-bone/60 hover:text-bone"
                    }`}
                  >
                    {f.label.toUpperCase()}
                    <span className={`ml-2 hidden sm:inline ${filter === f.key ? "text-ink/50" : "text-bone/35"}`}>
                      {pad(counts[f.key])}
                    </span>
                  </button>
                ))}
              </div>
            </nav>
            {still && count > 0 ? (
              <button
                type="button"
                onClick={() => cardRefs.current[0]?.scrollIntoView({ block: "start", behavior: reduceMotion ? "instant" : "smooth" })}
                className="inline-flex min-h-12 items-center gap-3 self-start rounded-full border border-bone/20 px-4 py-3 text-left text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-olive-light"
              >
                <ArrowDown aria-hidden className="size-4 text-olive-light" />
                <span className="text-sm">
                  <span className="md:hidden">Swipe up to explore</span>
                  <span className="hidden md:inline">Scroll down to read</span>
                  <span className="text-bone/60"> · Tap a quote to hold it</span>
                </span>
              </button>
            ) : null}
          </div>

          {/* ---- Chrome: right rail (desktop). Where you are in the deck. ---- */}
          <div className="deck-rail z-[1100] pointer-events-none absolute right-10 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-5 sm:flex">
            <p className="font-mono text-[13px] tracking-[0.16em] text-bone">
              {pad(count ? focused + 1 : 0)}
              <span className="text-bone/35"> / {pad(count)}</span>
            </p>
            <div className="relative h-[240px] w-px bg-bone/15">
              <div className="w-px bg-olive-light transition-[height] duration-300" style={{ height: `${progressPct}%` }} />
              <span
                className="absolute left-1/2 size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-olive-light shadow-[0_0_0_4px_rgba(157,171,107,0.18)] transition-[top] duration-300"
                style={{ top: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* ---- Chrome: bottom. ---- */}
          <div className="deck-chrome-bottom z-[1100] pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-5 px-4 pb-[calc(92px+env(safe-area-inset-bottom))] sm:px-10 md:pb-10 md:pr-28">
            {/* Phone: a horizontal rail with the scroll knob riding it. */}
            <div className={`items-center gap-3 sm:hidden ${still ? "hidden" : "flex"}`}>
              <div className="relative h-px flex-1 bg-bone/15">
                <div className="h-px bg-olive-light transition-[width] duration-300" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="inline-flex size-7 items-center justify-center rounded-full border border-bone/25 text-bone/70">
                <Mouse className="size-[13px]" />
              </span>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.16em] text-bone/55 sm:text-[11px]">
                  <span className="hidden size-7 items-center justify-center rounded-full border border-bone/25 text-bone/70 sm:inline-flex">
                    <Mouse className="size-[13px]" />
                  </span>
                  {still ? "SCROLL TO READ" : "SCROLL TO WALK"}<span className="hidden sm:inline"> THE WALL</span>
                  <span className="text-bone/30">·</span>
                  <span className="sm:hidden">TAP TO HOLD</span>
                  <span className="hidden sm:inline">CLICK A LINE TO HOLD IT</span>
                </p>
                <a
                  href="#index"
                  className="pointer-events-auto mt-3 hidden font-mono text-[10.5px] tracking-[0.16em] text-bone/45 underline decoration-bone/25 underline-offset-[6px] transition hover:text-olive-light hover:decoration-olive-light sm:inline-block"
                >
                  OR READ ALL {quotes.length} AS A LIST
                </a>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3">
                {accepting ? (
                  <button
                    type="button"
                    onClick={() => setSubmitOpen(true)}
                    className="pointer-events-auto order-1 inline-flex h-[54px] shrink-0 whitespace-nowrap items-center justify-center gap-2 rounded-full bg-bone px-6 font-semibold text-ink shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] transition hover:-translate-y-0.5 hover:bg-olive-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-light sm:order-2 sm:h-[60px] sm:px-8"
                  >
                    <Plus className="size-[18px]" />
                    Add yours
                  </button>
                ) : null}
                <a href="#index" aria-label="Read every quote as a list" className={`${ROUND} order-2 size-[54px] sm:order-1 sm:size-[60px]`}>
                  <LayoutGrid className="size-[18px]" />
                </a>
              </div>
            </div>
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
      className="fixed inset-0 z-[80] overflow-y-auto bg-wall/95 px-6 py-24 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Quote"
      onClick={onClose}
    >
      <figure className="mx-auto flex min-h-[calc(100svh-12rem)] max-w-[820px] flex-col justify-center text-center" onClick={(e) => e.stopPropagation()}>
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
        className="fixed right-6 top-6 inline-flex size-11 items-center justify-center rounded-full border border-bone/25 text-bone transition hover:border-bone hover:bg-bone/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
      >
        <X className="size-[18px]" />
      </button>
    </div>
  );
}
