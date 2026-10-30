"use client";

import { useEffect, useState, type RefObject } from "react";
import { useReducedMotion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { InkPath } from "@/components/editorial-motion";
import { heroThreadGeometry, type HeroThreadBox } from "@/lib/hero-thread";

type Geometry = ReturnType<typeof heroThreadGeometry> & { width: number };

export function HeroThread({ hero, stage }: { hero: RefObject<HTMLElement | null>; stage: RefObject<HTMLElement | null> }) {
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const layout = useMotionValue({ top: Infinity, hold: 0, height: 1 });
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  // Native scroll advances the stroke while CSS sticky holds the hero in place.
  // There is no timer, autoplay, wheel interception, or scroll snapping.
  const progress = useTransform(() => {
    const { top, hold, height } = layout.get();
    const distance = Math.max(0, scrollY.get() - top);
    return Math.max(.001, Math.min(1, distance / Math.max(1, hold || height * .6)));
  });

  useEffect(() => {
    const section = hero.current;
    const container = stage.current;
    if (!section || !container) return;
    const brand = section.closest(".editorial-site")?.querySelector<HTMLElement>(".editorial-logo");
    const question = section.querySelector<HTMLElement>("[data-hero-question]");
    const questionRow = section.querySelector<HTMLElement>("[data-hero-question-row]");
    const buildRow = section.querySelector<HTMLElement>("[data-hero-build-row]");
    const nextRow = section.querySelector<HTMLElement>("[data-hero-next-row]");
    const nextText = section.querySelector<HTMLElement>("[data-hero-next]");
    const title = section.querySelector<HTMLElement>(".editorial-hero-title");
    if (!brand || !question || !questionRow || !buildRow || !nextRow || !nextText || !title) return;
    let active = true;
    let frame = 0;
    const measure = () => {
      if (!active) return;
      const bounds = section.getBoundingClientRect();
      const top = container.getBoundingClientRect().top + window.scrollY;
      // Oversized/landscape heroes and reduced-motion users keep ordinary scrolling.
      const hold = reduced || bounds.height > window.innerHeight + 2 ? 0 : Math.round(Math.max(280, Math.min(560, window.innerHeight * .6)));
      container.style.setProperty("--hero-pin", `${hold}px`);
      layout.set({ top, hold, height: bounds.height });
      const box = (element: HTMLElement): HeroThreadBox => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left - bounds.left, right: rect.right - bounds.left, bottom: rect.bottom - bounds.top, height: rect.height };
      };
      setGeometry({ width: bounds.width, ...heroThreadGeometry({ width: bounds.width, height: bounds.height, titleLeft: box(title).left, question: box(question), questionRow: box(questionRow), buildRow: box(buildRow), nextRow: box(nextRow), nextText: box(nextText), brand: { ...box(brand), bottom: brand.getBoundingClientRect().bottom - top } }) });
    };
    const schedule = () => { if (!active) return; cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    measure();
    const observer = new ResizeObserver(schedule);
    [section, title, question, brand].forEach(element => observer.observe(element));
    document.fonts.ready.then(schedule);
    window.addEventListener("resize", schedule);
    return () => { active = false; observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("resize", schedule); };
  }, [hero, stage, layout, reduced]);

  return <div className="hero-text-thread" aria-hidden="true">
    {geometry && <svg viewBox={`0 0 ${geometry.width} ${geometry.height}`} preserveAspectRatio="none">
      <circle cx={geometry.start.x} cy={geometry.start.y} r={3} fill="var(--ed-accent)" stroke="none"/>
      <InkPath d={geometry.d} progress={progress} reduced={reduced}/>
    </svg>}
  </div>;
}
