"use client";

import { useEffect, useState, type RefObject } from "react";
import { useReducedMotion, useTransform } from "framer-motion";
import { InkPath, useThreadProgress } from "@/components/editorial-motion";
import { heroThreadGeometry, type HeroThreadBox } from "@/lib/hero-thread";

type Geometry = ReturnType<typeof heroThreadGeometry> & { width: number };

export function HeroThread({ hero }: { hero: RefObject<HTMLElement | null> }) {
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const reduced = useReducedMotion();
  const scrollYProgress = useThreadProgress(hero);
  // Use the same document horizon as the next section: no separate entrance offset.
  const progress = useTransform(scrollYProgress, value => Math.max(.001, value));

  useEffect(() => {
    const section = hero.current;
    if (!section) return;
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
      const box = (element: HTMLElement): HeroThreadBox => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left - bounds.left, right: rect.right - bounds.left, bottom: rect.bottom - bounds.top, height: rect.height };
      };
      setGeometry({ width: bounds.width, ...heroThreadGeometry({ width: bounds.width, height: bounds.height, titleLeft: box(title).left, question: box(question), questionRow: box(questionRow), buildRow: box(buildRow), nextRow: box(nextRow), nextText: box(nextText), brand: { ...box(brand), bottom: box(brand).bottom - window.scrollY } }) });
    };
    const schedule = () => { if (!active) return; cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    measure();
    const observer = new ResizeObserver(schedule);
    [section, title, question, brand].forEach(element => observer.observe(element));
    document.fonts.ready.then(schedule);
    window.addEventListener("resize", schedule);
    return () => { active = false; observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("resize", schedule); };
  }, [hero]);

  return <div className="hero-text-thread" aria-hidden="true">
    {geometry && <svg viewBox={`0 0 ${geometry.width} ${geometry.height}`} preserveAspectRatio="none">
      <circle cx={geometry.start.x} cy={geometry.start.y} r={3} fill="var(--ed-accent)" stroke="none"/>
      <InkPath d={geometry.d} progress={progress} reduced={reduced}/>
    </svg>}
  </div>;
}
