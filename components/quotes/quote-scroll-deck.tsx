"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  LayoutGrid,
  Volume2,
  VolumeX,
} from "lucide-react";
import { tierOf, readingProgress } from "@/lib/quotes/layout";
import type { Quote } from "@/lib/quotes/types";
import { useSwipeSound } from "@/components/quotes/use-swipe-sound";

const pad = (value: number) => String(value).padStart(2, "0");
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const category = {
  own: "My writing",
  curated: "Collected",
  visitor: "From the community",
};
const author = (quote: Quote) =>
  quote.author_name ||
  (quote.source === "owner" ? "Sufiyan Ali" : quote.posted_by || "Anonymous");

/** Page scrolling is the only animation clock. Touch never gets intercepted. */
export function QuoteScrollDeck({
  quotes,
  onOpen,
  onBrowse,
}: {
  quotes: Quote[];
  onOpen: (quote: Quote) => void;
  onBrowse: () => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const progressLine = useRef<HTMLSpanElement>(null);
  const geometry = useRef({ top: 0, step: 1 });
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);
  const count = quotes.length;
  const { enabled, ready, available, toggle, play } = useSwipeSound();

  useEffect(() => {
    // Short landscape windows need room to read. Reduced-motion users get the
    // same quotes in document order, without a long pinned animation track.
    const media = matchMedia(
      "(prefers-reduced-motion: reduce), (max-height: 560px)",
    );
    const sync = () => setEnhanced(!media.matches && count > 1);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [count]);

  useEffect(() => {
    const root = track.current;
    const scene = stage.current;
    if (!root || !scene) return;
    if (!enhanced) {
      cards.current.forEach((card) => {
        if (!card) return;
        card.removeAttribute("style");
        card.removeAttribute("aria-hidden");
        card.inert = false;
      });
      setActive(0);
      return;
    }
    let frame = 0;
    let focused = -1;
    let scrolled = false;
    const measure = () => {
      const step = Math.max(
        1,
        (root.offsetHeight - scene.offsetHeight) / (count - 1 + 0.6),
      );
      geometry.current = {
        top: root.getBoundingClientRect().top + window.scrollY - 88,
        step,
      };
    };
    const draw = () => {
      frame = 0;
      const { top, step } = geometry.current;
      const raw = clamp((window.scrollY - top) / step, 0, count - 1);
      const position = readingProgress(raw);
      const current = clamp(Math.round(position), 0, count - 1);
      const mobile = window.innerWidth <= 700;
      cards.current.forEach((card, index) => {
        if (!card) return;
        const offset = index - position;
        const ahead = Math.max(0, offset);
        const leaving = Math.max(0, -offset);
        const hidden = offset > 3.1 || offset < -1;
        card.style.willChange = hidden ? "auto" : "transform, opacity";
        card.style.visibility = hidden ? "hidden" : "visible";
        card.style.pointerEvents = index === current ? "auto" : "none";
        card.inert = index !== current;
        card.setAttribute("aria-hidden", String(index !== current));
        if (hidden) return;
        const exit = clamp(leaving, 0, 1);
        const x = ahead * (mobile ? 15 : 42) - exit * (mobile ? 290 : 620);
        const y = ahead * -20 + exit * 55;
        const z = ahead * -135 + exit * 70;
        const rotateZ = ahead * 2.5 - exit * 14;
        const rotateY = ahead * -5 - exit * 24;
        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
        card.style.opacity = String(
          exit > 0.45 ? Math.max(0, (1 - exit) / 0.55) : 1,
        );
        card.style.zIndex = String(count - index);
        card.style.setProperty(
          "--card-shade",
          String(Math.min(0.24, ahead * 0.075)),
        );
      });
      if (progressLine.current)
        progressLine.current.style.transform = `scaleX(${(position + 1) / count})`;
      if (current !== focused) {
        const insideStage = raw > 0 && raw < count - 1;
        if (
          scrolled &&
          focused >= 0 &&
          (insideStage || Math.abs(current - focused) === 1)
        )
          play(current - focused);
        focused = current;
        setActive(current);
      }
      scrolled = false;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const onScroll = () => {
      scrolled = true;
      schedule();
    };
    const resize = () => {
      scrolled = false;
      measure();
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    observer.observe(scene);
    // Fonts and responsive content above the track can move its start point.
    observer.observe(document.body);
    measure();
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, [enhanced, count, play]);

  return (
    <div
      ref={track}
      className="q-depth-track"
      data-enhanced={enhanced}
      style={{ "--quote-steps": Math.max(0, count - 1 + 0.6) } as CSSProperties}
    >
      <div
        ref={stage}
        className="q-depth-stage"
        role="region"
        aria-label="Scroll through the quote collection"
      >
        <div className="q-depth-heading">
          <span>
            <i /> ONE THOUGHT AT A TIME
          </span>
          <div className="q-depth-tools">
            {enhanced && available && (
              <button
                type="button"
                data-quote-sound-toggle
                className="q-depth-sound"
                aria-pressed={enabled && ready}
                aria-label={
                  enabled && ready ? "Mute swipe sound" : "Enable swipe sound"
                }
                onClick={toggle}
                title={
                  enabled && ready ? "Mute swipe sound" : "Enable swipe sound"
                }
              >
                {enabled && ready ? (
                  <Volume2 size={16} />
                ) : (
                  <VolumeX size={16} />
                )}
                <span>
                  {enabled && ready
                    ? "SOUND ON"
                    : enabled
                      ? "ENABLE SOUND"
                      : "SOUND OFF"}
                </span>
              </button>
            )}
            <button type="button" onClick={onBrowse}>
              <LayoutGrid size={14} /> BROWSE ALL
            </button>
          </div>
        </div>
        <div className="q-depth-scene">
          <div className="q-depth-orbit" aria-hidden="true" />
          <span className="q-depth-watermark" aria-hidden="true">
            WORDS
            <br />
            TO LIVE BY.
          </span>
          <div className="q-depth-camera">
            {quotes.map((quote, index) => (
              <article
                ref={(el) => {
                  cards.current[index] = el;
                }}
                key={quote.id}
                className="q-depth-card"
                data-long={quote.body.length > 140}
                data-very-long={quote.body.length > 220}
              >
                <div className="q-depth-card-top">
                  <span>NOTE / {pad(index + 1)}</span>
                  <span>{category[tierOf(quote)]}</span>
                  <span aria-hidden="true">✳</span>
                </div>
                <blockquote>
                  <span className="q-depth-quote-mark" aria-hidden="true">
                    “
                  </span>
                  <p>{quote.body}</p>
                </blockquote>
                <div className="q-depth-card-bottom">
                  <cite>— {author(quote)}</cite>
                  <ArrowUpRight size={19} aria-hidden="true" />
                </div>
                <button
                  className="q-depth-open"
                  type="button"
                  aria-label={`Read quote: ${quote.body}`}
                  onClick={() => onOpen(quote)}
                />
              </article>
            ))}
          </div>
        </div>
        <div className="q-depth-controls">
          <div className="q-depth-direction">
            <ArrowDown size={17} />
            <span>
              SCROLL TO READ
              <br />
              <small>At your own pace.</small>
            </span>
          </div>
          <div className="q-depth-pager">
            <span role="status" aria-live="polite" aria-atomic="true">
              {pad(active + 1)} <span>/ {pad(count)}</span>
            </span>
          </div>
          <a href="#after-quotes" className="q-depth-skip">
            CONTINUE <ArrowDown size={14} />
          </a>
        </div>
        <div className="q-depth-progress" aria-hidden="true">
          <span ref={progressLine} />
        </div>
      </div>
    </div>
  );
}
