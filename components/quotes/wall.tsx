"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, Plus, X } from "lucide-react";
import { tierOf, type Placed, type Tier } from "@/lib/quotes/layout";
import type { Quote } from "@/lib/quotes/types";
import { SubmitDialog } from "@/components/quotes/submit-dialog";

/**
 * The canvas must never server-render: it touches WebGL on mount, and
 * `ssr:false` is only legal inside a client component. Hence this wrapper.
 */
const QuoteScene = dynamic(() => import("@/components/quotes/scene/quote-scene").then((m) => m.QuoteScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#13140D]">
      <p className="font-mono text-[11px] tracking-[0.16em] text-olive-light">ENTERING THE WALL</p>
    </div>
  )
});

const FILTERS: { key: Tier | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "own", label: "Mine" },
  { key: "curated", label: "Collected" },
  { key: "visitor", label: "Yours" }
];

const CONTROL =
  "pointer-events-auto inline-flex items-center justify-center rounded-full border backdrop-blur transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-light";

export function Wall({ quotes: initial, accepting }: { quotes: Quote[]; accepting: boolean }) {
  const reduceMotion = useReducedMotion();
  const [quotes, setQuotes] = useState(initial);
  const [filter, setFilter] = useState<Tier | "all">("all");
  const [paused, setPaused] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [open, setOpen] = useState<Placed | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [jump, setJump] = useState<{ token: number; index: number } | null>(null);
  const [step, setStep] = useState<{ token: number; delta: number } | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const still = Boolean(reduceMotion) || paused;

  const visible = useMemo(
    () => (filter === "all" ? quotes : quotes.filter((q) => tierOf(q) === filter)),
    [quotes, filter]
  );

  useEffect(() => {
    const onLost = () => setWebglFailed(true);
    window.addEventListener("webglcontextlost", onLost);
    return () => window.removeEventListener("webglcontextlost", onLost);
  }, []);

  const closeOpen = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeOpen();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeOpen]);

  // Arrow keys step the walk when nothing else has focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open || submitOpen) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") setStep({ token: Date.now(), delta: 1 });
      if (e.key === "ArrowLeft") setStep({ token: Date.now(), delta: -1 });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, submitOpen]);

  /**
   * A freshly posted quote goes straight into the scene and the walk turns to
   * face it. Waiting for the page to revalidate would leave the person who
   * just wrote something staring at a wall that hasn't changed.
   */
  const handlePosted = useCallback(
    (quote: Quote) => {
      setQuotes((prev) => [...prev, quote]);
      setFilter("all");
      setPaused(true);
      setJump({ token: Date.now(), index: quotes.length });
    },
    [quotes.length]
  );

  if (webglFailed) return null;

  const focused = visible[focusedIndex];

  return (
    <>
      <div className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[#13140D]">
        <QuoteScene
          quotes={visible}
          paused={still}
          onOpen={setOpen}
          onFocusChange={setFocusedIndex}
          jump={jump}
          step={step}
        />

        {/* Top bar: filters and pause. Clears the fixed navbar. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 px-4 pt-[88px] sm:px-7 sm:pt-[100px]">
          <div className="pointer-events-auto flex gap-1.5 rounded-full border border-bone/12 bg-[#13140D]/60 p-1 backdrop-blur">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  setFilter(f.key);
                  setJump({ token: Date.now(), index: 0 });
                }}
                aria-pressed={filter === f.key}
                className={`min-h-[36px] rounded-full px-3.5 font-mono text-[10.5px] tracking-[0.1em] transition sm:px-4 ${
                  filter === f.key ? "bg-bone text-ink" : "text-bone/60 hover:text-bone"
                }`}
              >
                {f.label.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            aria-label={paused ? "Resume" : "Pause"}
            className={`${CONTROL} size-11 border-bone/15 bg-[#13140D]/60 text-bone/70 hover:border-bone/40 hover:text-bone`}
          >
            {paused ? <Play className="size-[14px]" /> : <Pause className="size-[14px]" />}
          </button>
        </div>

        {/* Bottom bar: where you are, how to move, and the door to add yours.
            Bottom padding clears the mobile dock. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-4 px-4 pb-[calc(96px+env(safe-area-inset-bottom))] sm:px-7 md:pb-8">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-[11px] tracking-[0.16em] text-olive-light">
                {String(focusedIndex + 1).padStart(2, "0")}{" "}
                <span className="text-bone/30">/ {String(visible.length).padStart(2, "0")}</span>
              </p>
              <p className="mt-1.5 hidden font-mono text-[10px] tracking-[0.1em] text-bone/35 sm:block">
                SWIPE OR USE ARROWS · TAP A LINE TO OPEN IT
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep({ token: Date.now(), delta: -1 })}
                disabled={focusedIndex === 0}
                aria-label="Previous quote"
                className={`${CONTROL} size-12 border-bone/15 bg-[#13140D]/60 text-bone/80 hover:border-bone/40 disabled:opacity-25`}
              >
                <ChevronLeft className="size-[18px]" />
              </button>
              <button
                type="button"
                onClick={() => setStep({ token: Date.now(), delta: 1 })}
                disabled={focusedIndex >= visible.length - 1}
                aria-label="Next quote"
                className={`${CONTROL} size-12 border-bone/15 bg-[#13140D]/60 text-bone/80 hover:border-bone/40 disabled:opacity-25`}
              >
                <ChevronRight className="size-[18px]" />
              </button>
              {accepting ? (
                <button
                  type="button"
                  onClick={() => setSubmitOpen(true)}
                  aria-label="Add your quote"
                  className={`${CONTROL} ml-1 h-12 gap-2 border-transparent bg-bone px-4 font-semibold text-ink shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] hover:-translate-y-0.5 hover:bg-olive-light sm:px-5`}
                >
                  <Plus className="size-[16px]" />
                  <span className="hidden sm:inline">Add yours</span>
                </button>
              ) : null}
            </div>
          </div>

          {/* Progress rail. */}
          <div className="h-px w-full bg-bone/10">
            <div
              className="h-px bg-olive-light transition-[width] duration-500"
              style={{ width: `${visible.length > 1 ? (focusedIndex / (visible.length - 1)) * 100 : 100}%` }}
            />
          </div>
        </div>

        {/* Live region so screen readers hear the line in focus. */}
        <p className="sr-only" aria-live="polite">
          {focused ? `${focused.body} ${focused.author_name ? `— ${focused.author_name}` : ""}` : ""}
        </p>
      </div>

      {open ? <OpenQuote quote={open} onClose={closeOpen} /> : null}
      <SubmitDialog open={submitOpen} onClose={() => setSubmitOpen(false)} onPosted={handlePosted} />
    </>
  );
}

function OpenQuote({ quote, onClose }: { quote: Placed; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#13140D]/94 px-6 backdrop-blur-md"
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
          <span>
            {quote.author_name ? `— ${quote.author_name.toUpperCase()}` : quote.tier === "own" ? "— SUFIYAN" : "— UNATTRIBUTED"}
          </span>
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
