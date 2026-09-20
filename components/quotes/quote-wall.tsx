"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play, X } from "lucide-react";
import { placeQuotes, type Placed } from "@/lib/quotes/layout";
import type { Quote } from "@/lib/quotes/types";

type Props = {
  quotes: Quote[];
};

const TIER_CLASS: Record<Placed["tier"], string> = {
  own: "text-ink",
  curated: "text-body",
  visitor: "text-muted"
};

export function QuoteWall({ quotes }: Props) {
  const reduceMotion = useReducedMotion();
  const placed = useMemo(() => placeQuotes(quotes), [quotes]);

  const viewportRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [depth, setDepth] = useState(0);
  const [focused, setFocused] = useState<Placed | null>(null);
  // WCAG 2.2.2: looping motion needs a visible control, regardless of the OS
  // reduced-motion setting.
  const [paused, setPaused] = useState(false);

  const still = reduceMotion || paused;

  // Tilt the whole field toward the pointer. Pointer-driven only - no
  // device orientation, which causes motion sickness on phones.
  useEffect(() => {
    if (still) {
      setTilt({ x: 0, y: 0 });
      return;
    }

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        setTilt({ x: -ny * 7, y: nx * 10 });
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [still]);

  // Scrolling the page pushes the camera through the field.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        if (total <= 0) return setDepth(0);
        const progress = Math.min(Math.max(-rect.top / total, 0), 1);
        setDepth(progress * 900);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const close = useCallback(() => setFocused(null), []);

  useEffect(() => {
    if (!focused) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [focused, close]);

  return (
    <>
      {/*
        The scroll track. Its height is what gives the field something to
        travel through; the viewport inside is sticky.
      */}
      <div ref={viewportRef} className="relative" style={{ height: `${Math.max(220, placed.length * 12)}vh` }}>
        <div className="wall-viewport sticky top-0 h-screen overflow-hidden">
          <Motes still={still} />

          <div
            className="wall-field absolute inset-0"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${depth}px)`,
              transition: still ? "none" : "transform 380ms cubic-bezier(0.22,0.61,0.36,1)"
            }}
          >
            {placed.map((quote) => (
              <QuoteNode key={quote.id} quote={quote} still={still} onOpen={() => setFocused(quote)} />
            ))}
          </div>

          {/* Depth haze: the field fades into the background rather than
              ending at a hard edge. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 30%, rgba(242,240,233,0.55) 78%, rgba(242,240,233,0.92) 100%)"
            }}
          />

          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="absolute bottom-6 right-6 z-20 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink/15 bg-surface/90 px-4 font-mono text-[11.5px] tracking-[0.08em] text-body backdrop-blur transition hover:border-olive hover:text-olive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive"
          >
            {paused ? <Play className="size-[13px]" /> : <Pause className="size-[13px]" />}
            {paused ? "RESUME" : "PAUSE"} MOTION
          </button>
        </div>
      </div>

      {focused ? <FocusedQuote quote={focused} onClose={close} /> : null}
    </>
  );
}

function QuoteNode({ quote, still, onOpen }: { quote: Placed; still: boolean; onOpen: () => void }) {
  return (
    <blockquote
      className="wall-quote absolute"
      style={
        {
          left: `${quote.x}%`,
          top: `${quote.y}%`,
          width: "min(34ch, 76vw)",
          transform: `translate3d(-50%,-50%,${quote.z}px) rotateY(${quote.rotateY}deg) rotateX(${quote.rotateX}deg)`,
          filter: quote.blur ? `blur(${quote.blur}px)` : undefined,
          opacity: quote.opacity,
          animationPlayState: still ? "paused" : "running",
          "--drift-x": `${quote.driftX}px`,
          "--drift-y": `${quote.driftY}px`,
          "--drift-duration": `${quote.driftDuration}s`,
          "--drift-delay": `${quote.driftDelay}s`
        } as React.CSSProperties
      }
    >
      <button
        type="button"
        onClick={onOpen}
        className="group block w-full cursor-pointer text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive"
      >
        <p
          className={`font-display leading-[1.22] tracking-[-0.01em] transition-colors group-hover:text-olive ${TIER_CLASS[quote.tier]}`}
          style={{ fontSize: `${quote.size}px` }}
        >
          {quote.body}
        </p>
        {quote.author_name ? (
          <cite className="mt-2 block font-mono text-[10.5px] not-italic tracking-[0.1em] text-meta">
            — {quote.author_name.toUpperCase()}
          </cite>
        ) : null}
      </button>
    </blockquote>
  );
}

/** Background motes. Purely decorative, so hidden from assistive tech. */
function Motes({ still }: { still: boolean }) {
  const motes = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
        return {
          id: i,
          left: r(1) * 100,
          top: r(2) * 100,
          size: 1 + r(3) * 2.5,
          x: (r(4) - 0.5) * 120,
          y: -60 - r(5) * 180,
          duration: 18 + r(6) * 22,
          delay: -r(7) * 30,
          opacity: 0.18 + r(8) * 0.3
        };
      }),
    []
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {motes.map((m) => (
        <span
          key={m.id}
          className="wall-mote absolute rounded-full bg-olive"
          style={
            {
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: m.size,
              height: m.size,
              animationPlayState: still ? "paused" : "running",
              opacity: still ? m.opacity : undefined,
              "--mote-x": `${m.x}px`,
              "--mote-y": `${m.y}px`,
              "--mote-duration": `${m.duration}s`,
              "--mote-delay": `${m.delay}s`,
              "--mote-opacity": m.opacity
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function FocusedQuote({ quote, onClose }: { quote: Placed; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/70 px-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Quote"
      onClick={onClose}
    >
      <figure className="max-w-[760px] text-center" onClick={(e) => e.stopPropagation()}>
        <p className="font-display text-[clamp(28px,5.2vw,58px)] font-normal leading-[1.15] tracking-[-0.02em] text-bone">
          {quote.body}
        </p>
        {quote.author_name ? (
          <figcaption className="mt-7 font-mono text-[12px] tracking-[0.14em] text-olive-light">
            — {quote.author_name.toUpperCase()}
          </figcaption>
        ) : (
          <figcaption className="mt-7 font-mono text-[12px] tracking-[0.14em] text-olive-light">
            {quote.tier === "own" ? "— SUFIYAN" : "— ANONYMOUS"}
          </figcaption>
        )}
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
