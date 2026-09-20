"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { Pause, Play, Plus, X } from "lucide-react";
import type { Placed, Tier } from "@/lib/quotes/layout";
import type { Quote } from "@/lib/quotes/types";
import { SubmitDialog } from "@/components/quotes/submit-dialog";

/**
 * The canvas must never server-render - it touches WebGL on mount. `ssr:false`
 * is only legal inside a client component, which is why this wrapper exists
 * rather than the page importing the scene directly.
 */
const QuoteScene = dynamic(() => import("@/components/quotes/scene/quote-scene").then((m) => m.QuoteScene), {
  ssr: false,
  loading: () => <SceneSkeleton />
});

function SceneSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#14150E]">
      <p className="font-mono text-[11.5px] tracking-[0.14em] text-olive-light">ENTERING THE WALL...</p>
    </div>
  );
}

const FILTERS: { key: Tier | "all"; label: string }[] = [
  { key: "all", label: "Everything" },
  { key: "own", label: "Mine" },
  { key: "curated", label: "Collected" },
  { key: "visitor", label: "Yours" }
];

export function Wall({ quotes, accepting }: { quotes: Quote[]; accepting: boolean }) {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<Tier | "all">("all");
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState<Placed | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  const still = reduceMotion || paused;

  // A lost WebGL context should degrade to the readable list, not a black box.
  useEffect(() => {
    const onLost = () => setWebglFailed(true);
    window.addEventListener("webglcontextlost", onLost);
    return () => window.removeEventListener("webglcontextlost", onLost);
  }, []);

  const close = useCallback(() => setFocused(null), []);

  useEffect(() => {
    if (!focused) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [focused, close]);

  if (webglFailed) return null;

  return (
    <>
      <div className="relative h-[86vh] w-full overflow-hidden rounded-[26px] border border-ink/10 bg-[#14150E]">
        <QuoteScene quotes={quotes} filter={filter} paused={still} onOpen={setFocused} />

        {/* Controls sit in DOM above the canvas: real buttons, real focus,
            real keyboard support. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-3 p-5 sm:p-7">
          <div className="pointer-events-auto flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`min-h-[40px] rounded-full border px-4 font-mono text-[11px] tracking-[0.08em] backdrop-blur transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-light ${
                  filter === f.key
                    ? "border-olive-light bg-olive-light/15 text-olive-light"
                    : "border-bone/20 text-bone/70 hover:border-bone/50 hover:text-bone"
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
            className="pointer-events-auto inline-flex min-h-[40px] items-center gap-2 rounded-full border border-bone/20 px-4 font-mono text-[11px] tracking-[0.08em] text-bone/70 backdrop-blur transition hover:border-bone/50 hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-light"
          >
            {paused ? <Play className="size-[12px]" /> : <Pause className="size-[12px]" />}
            {paused ? "RESUME" : "PAUSE"}
          </button>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 sm:p-7">
          <p className="font-mono text-[10.5px] leading-[1.7] tracking-[0.08em] text-bone/45">
            DRAG TO TURN · CLICK A LINE TO READ IT
          </p>

          {accepting ? (
            <button
              type="button"
              onClick={() => setSubmitOpen(true)}
              className="pointer-events-auto inline-flex min-h-[48px] items-center gap-2 rounded-full bg-bone px-6 font-semibold text-ink shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] transition hover:-translate-y-0.5 hover:bg-olive-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-light"
            >
              <Plus className="size-[16px]" />
              Add yours
            </button>
          ) : null}
        </div>
      </div>

      {focused ? <FocusedQuote quote={focused} onClose={close} /> : null}
      <SubmitDialog open={submitOpen} onClose={() => setSubmitOpen(false)} />
    </>
  );
}

function FocusedQuote({ quote, onClose }: { quote: Placed; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#14150E]/92 px-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Quote"
      onClick={onClose}
    >
      <figure className="max-w-[820px] text-center" onClick={(e) => e.stopPropagation()}>
        <p className="font-display text-[clamp(30px,5.4vw,64px)] font-normal leading-[1.14] tracking-[-0.02em] text-bone">
          {quote.body}
        </p>
        <figcaption className="mt-8 font-mono text-[12px] tracking-[0.16em] text-olive-light">
          {quote.author_name
            ? `— ${quote.author_name.toUpperCase()}`
            : quote.tier === "own"
              ? "— SUFIYAN"
              : "— ANONYMOUS"}
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
