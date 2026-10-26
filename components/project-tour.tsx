"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { tourProjects, tourStops, type TourCue } from "@/lib/project-tour";
import { scrollToY } from "@/lib/smooth-scroll";

export const chapterMedia = [
  {
    desktop: "/case-studies/cega/training-overview.png",
    detail: "/case-studies/cega/judging-phase-1.png",
    mobile: "/case-studies/cega/ai-assistant.png",
    phoneLabel: "A useful AI assistant",
    tone: "dark",
    tint: "#293b32",
  },
  {
    desktop: "/work/gomila-desktop.png",
    detail: "/work/gomila-detail.png",
    mobile: "/work/gomila-mobile.png",
    phoneLabel: "A storefront in your pocket",
    tone: "light",
    tint: "#d4c8b4",
  },
  {
    desktop: "/work/nextgrid-desktop.png",
    detail: "/work/nextgrid-detail.png",
    mobile: "/work/nextgrid-mobile.png",
    phoneLabel: "The same clarity, on every screen",
    tone: "dark",
    tint: "#434b35",
  },
];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const range = (n: number, a: number, b: number) => clamp((n - a) / (b - a));
const ease = (n: number) => n * n * (3 - 2 * n);
function measure() {
  const section = document.getElementById("work");
  const stage = section?.querySelector<HTMLElement>(".project-tour-stage");
  return section && stage
    ? {
        top: section.getBoundingClientRect().top + scrollY,
        distance: Math.max(1, section.offsetHeight - stage.offsetHeight),
      }
    : null;
}
function mix(a: string, b: string, t: number) {
  return `rgb(${[1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t)).join(",")})`;
}

/** Every transform is a function of scroll position, so reverse scrolling reverses the scene. */
export function ProjectTour({
  onCue,
  onNavigateReady,
}: {
  onCue: (cue: TourCue) => void;
  onNavigateReady: (navigate: (index: number) => void) => void;
}) {
  const section = useRef<HTMLElement>(null);
  const chapters = useRef<(HTMLElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const navigate = useCallback((next: number) => {
    const bounded = Math.max(0, Math.min(tourStops.length - 1, next));
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      document
        .getElementById(`tour-${tourStops[bounded].project.slug}`)
        ?.scrollIntoView();
      return;
    }
    const m = measure();
    if (m) scrollToY(m.top + m.distance * ((bounded + 0.5) / tourStops.length));
  }, []);
  useEffect(() => onNavigateReady(navigate), [navigate, onNavigateReady]);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const read = () => {
      frame = 0;
      const m = measure();
      if (!m || !section.current) return;
      const x = clamp((scrollY - m.top) / m.distance) * tourProjects.length;
      const projectIndex = Math.min(tourProjects.length - 1, Math.floor(x));
      const step = Math.min(2, Math.floor((x - projectIndex) * 3));
      if (!preference.matches) setIndex(projectIndex * 3 + step);
      const color = chapterMedia[projectIndex].tint;
      const next =
        chapterMedia[Math.min(chapterMedia.length - 1, projectIndex + 1)].tint;
      section.current.style.backgroundColor = mix(
        color,
        next,
        ease(range(x - projectIndex, 0.85, 1)),
      );
      chapters.current.forEach((chapter, i) => {
        if (!chapter) return;
        const p = x - i;
        if (preference.matches) {
          chapter.style.removeProperty("visibility");
          chapter.style.removeProperty("opacity");
          return;
        }
        const active = p >= 0 && p <= 1;
        chapter.style.visibility = active ? "visible" : "hidden";
        chapter.style.pointerEvents = active ? "auto" : "none";
        const enter = ease(range(p, 0, 0.11));
        const exit = ease(range(p, 0.9, 1));
        chapter.style.opacity = String(enter * (1 - exit));
        chapter.style.setProperty(
          "--chapter-y",
          `${(1 - enter) * 60 - exit * 70}px`,
        );
        chapter.style.setProperty(
          "--screen-y",
          `${(1 - ease(range(p, 0, 0.25))) * 100 - range(p, 0.3, 0.9) * 25}px`,
        );
        chapter.style.setProperty(
          "--screen-scale",
          String(0.92 + ease(range(p, 0, 0.3)) * 0.08),
        );
        chapter.style.setProperty(
          "--screen-rotate",
          `${(1 - ease(range(p, 0.02, 0.35))) * (i % 2 ? -4 : 4)}deg`,
        );
        const phone = ease(range(p, 0.18, 0.5));
        chapter.style.setProperty("--phone-y", `${(1 - phone) * 65}vh`);
        chapter.style.setProperty(
          "--phone-x",
          `${(1 - phone) * (i % 2 ? 60 : -60)}px`,
        );
        chapter.style.setProperty(
          "--phone-rotate",
          `${(1 - phone) * (i % 2 ? 14 : -14)}deg`,
        );
        chapter.style.setProperty("--phone-opacity", String(phone));
        chapter.style.setProperty(
          "--detail-reveal",
          `${(1 - ease(range(p, 0.56, 0.78))) * 100}%`,
        );
        chapter.style.setProperty(
          "--detail-scale",
          String(1.08 - ease(range(p, 0.56, 0.84)) * 0.08),
        );
        chapter.style.setProperty("--chapter-progress", String(clamp(p)));
        chapter.dataset.step = String(Math.min(2, Math.floor(clamp(p) * 3)));
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    const sync = () => {
      setReduced(preference.matches);
      schedule();
    };
    sync();
    const resize = new ResizeObserver(schedule);
    if (section.current) resize.observe(section.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", sync);
    };
  }, []);
  useEffect(() => {
    const stop = tourStops[index];
    onCue({
      index,
      projectIndex: stop.projectIndex,
      stepIndex: stop.stepIndex,
      projectName: stop.project.name,
      text: stop.step.text,
      title: stop.step.label,
      total: tourStops.length,
    });
  }, [index, onCue]);

  return (
    <section
      id="work"
      ref={section}
      className={`project-tour continuous-tour ${reduced ? "tour-reduced" : ""}`}
      aria-label="Selected projects, a scrolling walkthrough"
    >
      <div
        className="project-tour-stage"
        tabIndex={0}
        aria-label="Project walkthrough. Arrow keys move to the previous or next story beat."
        onKeyDown={(event) => {
          if (
            event.target === event.currentTarget &&
            ["ArrowRight", "ArrowLeft"].includes(event.key)
          ) {
            event.preventDefault();
            navigate(index + (event.key === "ArrowRight" ? 1 : -1));
          }
        }}
      >
        {tourProjects.map((project, i) => {
          const media = chapterMedia[i];
          return (
            <article
              id={`tour-${project.slug}`}
              key={project.slug}
              ref={(el) => {
                chapters.current[i] = el;
              }}
              className={`scroll-chapter chapter-${i} ${i % 2 ? "content-left" : "content-right"}`}
              data-tone={media.tone}
              aria-label={project.name}
            >
              <div className="chapter-content">
                <div className="chapter-heading">
                  <h2>{project.name}</h2>
                  <Link
                    className="story-pill"
                    href={`/projects/${project.slug}`}
                  >
                    View project <ArrowUpRight size={18} />
                  </Link>
                </div>
                <div className="chapter-devices">
                  <div className="chapter-desktop story-browser">
                    <div className="browser-chrome">
                      <span aria-hidden="true">● ● ●</span>
                      <span>{new URL(project.live).hostname}</span>
                      <span>↗</span>
                    </div>
                    <div className="chapter-screen">
                      <Image
                        src={media.desktop}
                        alt={`${project.name} desktop website`}
                        width={1440}
                        height={1000}
                        sizes="(max-width:760px) 92vw, 58vw"
                        priority={i === 0}
                      />
                      <div className="chapter-detail">
                        <Image
                          src={media.detail}
                          alt={`${project.name}: a closer look at the working interface`}
                          width={1440}
                          height={1000}
                          sizes="(max-width:760px) 92vw, 58vw"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="chapter-phone">
                    <span className="phone-speaker" />
                    <Image
                      src={media.mobile}
                      alt={`${project.name} mobile experience`}
                      width={390}
                      height={844}
                      sizes="(max-width:760px) 30vw, 17vw"
                    />
                    <span className="phone-home" />
                  </div>
                  <span className="phone-annotation">{media.phoneLabel} ↗</span>
                </div>
                <div className="chapter-caption">
                  <span>{String(i + 1).padStart(2, "0")} / SELECTED WORK</span>
                  <div>
                    {project.steps.map((step, j) => (
                      <p key={step.label} className={`chapter-line line-${j}`}>
                        {step.title}
                      </p>
                    ))}
                  </div>
                  <span className="chapter-meter">
                    <i />
                  </span>
                </div>
                <div className="chapter-stack">{project.stack.join(" / ")}</div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
