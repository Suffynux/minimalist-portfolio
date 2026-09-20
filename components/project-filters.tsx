"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CaseStudyViewer } from "@/components/case-study-viewer";
import { TagList } from "@/components/tag-list";
import { Button } from "@/components/ui/button";
import { filters, type DetailedProject } from "@/lib/data";

type Props = {
  projects: DetailedProject[];
};

export function ProjectFilters({ projects }: Props) {
  const [active, setActive] = useState(filters[0]);
  const reduceMotion = useReducedMotion();

  const visible = useMemo(
    () => (active === "All" ? projects : projects.filter((project) => project.category === active)),
    [active, projects]
  );

  // Hide a filter that would only ever produce an empty list.
  const available = useMemo(
    () => filters.filter((filter) => filter === "All" || projects.some((project) => project.category === filter)),
    [projects]
  );

  return (
    <>
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter projects by type">
        {available.map((filter) => {
          const isActive = filter === active;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              aria-pressed={isActive}
              className={`min-h-[44px] rounded-full border px-4 font-mono text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive ${
                isActive
                  ? "border-ink bg-ink text-surface"
                  : "border-ink/15 text-body hover:border-olive/50 hover:text-olive"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
        {active === "All" ? "" : ` in ${active}`}.
      </p>

      <section className="relative z-10 mx-auto mt-10 flex max-w-[1200px] flex-col gap-7 px-5 py-10 pt-[30px] sm:px-8">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => (
            <motion.article
              key={project.no}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
              className="grid overflow-hidden rounded-[22px] border border-ink/[0.09] bg-surface transition hover:border-olive/40 hover:shadow-[0_30px_60px_-34px_rgba(35,37,29,0.32)] lg:grid-cols-2"
            >
              <div className={`relative min-h-[340px] overflow-hidden bg-shade ${project.reverse ? "lg:order-2" : ""}`}>
                <Image src={project.img} alt={project.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                <div className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1.5 font-mono text-[11px] tracking-[0.06em] text-surface backdrop-blur">
                  {project.no} / {project.kind}
                </div>
              </div>
              <div className="flex flex-col justify-center gap-[18px] p-8 sm:p-10">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[11.5px] text-meta">{project.meta}</span>
                  <span className="rounded-full border border-olive/40 px-[11px] py-1 font-mono text-[11px] tracking-[0.06em] text-olive">
                    {project.status}
                  </span>
                </div>
                <h2 className="font-display text-[clamp(34px,4vw,48px)] font-normal leading-none tracking-[-0.01em]">{project.name}</h2>
                <p className="max-w-[520px] text-[15.5px] leading-[1.65] text-body">{project.desc}</p>
                <TagList tags={project.stack} />
                <div className="mt-2 flex flex-wrap gap-2.5">
                  <Button asChild size="sm">
                    <a href={project.live} target="_blank" rel="noreferrer">
                      {project.live.includes("github.com") ? "View on GitHub" : "Live site"} <span className="font-mono">↗</span>
                    </a>
                  </Button>
                  <CaseStudyViewer project={project} />
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </section>
    </>
  );
}
