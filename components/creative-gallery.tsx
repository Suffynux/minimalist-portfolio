"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Reveal } from "@/components/reveal";
import type { CreativeImage } from "@/lib/data";

type Props = {
  items: CreativeImage[];
  cols: number;
  sectionId: string;
  sectionTitle: string;
};

export function CreativeGallery({ items, cols, sectionId, sectionTitle }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(() => setOpenIndex((i) => (i === null ? i : (i + 1) % items.length)), [items.length]);
  const prev = useCallback(() => setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length)), [items.length]);

  // Keyboard controls, scroll lock, and focus handling while the lightbox is open.
  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      lastFocused.current?.focus();
    };
  }, [openIndex, close, next, prev]);

  const active = openIndex === null ? null : items[openIndex];

  return (
    <>
      <div className="masonry" style={{ columnCount: cols }}>
        {items.map((item, index) => (
          <Reveal key={`${sectionId}-${item.cap}-${index}`} className="group relative overflow-hidden rounded-2xl bg-shade">
            <button
              type="button"
              onClick={(event) => {
                lastFocused.current = event.currentTarget;
                setOpenIndex(index);
              }}
              aria-label={`Open ${item.cap} full size`}
              className="block w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive"
            >
              <Image
                src={item.img}
                alt={item.cap}
                width={700}
                height={920}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="block h-auto min-h-[120px] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 flex items-end bg-[linear-gradient(to_top,rgba(20,21,14,0.78),transparent_55%)] p-4 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="font-mono text-[11px] text-bone">{item.cap}</span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[90] flex flex-col bg-ink/90 px-4 py-5 backdrop-blur-sm sm:px-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${sectionTitle} gallery viewer`}
          onClick={close}
        >
          <div className="flex items-center justify-between gap-4 pb-4">
            <p className="min-w-0 truncate font-mono text-[11.5px] tracking-[0.12em] text-bone/80">
              {openIndex! + 1} / {items.length} — {active.cap}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close gallery viewer"
              className="inline-flex size-11 items-center justify-center rounded-full border border-bone/25 text-bone transition hover:border-bone hover:bg-bone/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
            >
              <X className="size-[18px]" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-0 z-10 inline-flex size-11 items-center justify-center rounded-full border border-bone/25 bg-ink/60 text-bone transition hover:border-bone hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
            >
              <ChevronLeft className="size-5" />
            </button>

            <Image
              key={active.img}
              src={active.img}
              alt={active.cap}
              width={1400}
              height={1800}
              sizes="90vw"
              className="max-h-full w-auto max-w-full rounded-2xl object-contain"
            />

            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-0 z-10 inline-flex size-11 items-center justify-center rounded-full border border-bone/25 bg-ink/60 text-bone transition hover:border-bone hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
