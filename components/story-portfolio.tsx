"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Copy } from "lucide-react";
import { ProjectTour } from "@/components/project-tour";
import { LogicScratch } from "@/components/logic-scratch";
import { tourProjects, type TourCue } from "@/lib/project-tour";
import { EmojiMascot } from "@/components/emoji-mascot";
import { storyScenes, type StoryScene } from "@/lib/story";
import { site, projectDetails } from "@/lib/data";
import { projectSlug } from "@/lib/portfolio-content";
import { startSmoothScroll } from "@/lib/smooth-scroll";

const intro =
  "I’m a full-stack developer based in Pakistan. I build websites, applications and AI-powered tools — and the business logic that makes them useful. From the first idea to the final deployment, I build the whole thing.".split(
    " ",
  );
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => v * v * (3 - 2 * v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function StoryPortfolio() {
  const root = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<StoryScene>("top");
  const [tourCue, setTourCue] = useState<TourCue | null>(null);
  const [pose, setPose] = useState<
    "audience" | "present-right" | "present-left" | "read"
  >("audience");
  const navigateTour = useRef<((index: number) => void) | null>(null);
  const registerTour = useCallback((navigate: (index: number) => void) => {
    navigateTour.current = navigate;
  }, []);
  const [scratch, setScratch] = useState(0);
  const updateScratch = useCallback((n: number) => setScratch(n), []);
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => startSmoothScroll(), []);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const w = innerWidth,
        h = innerHeight,
        mobile = w <= 760;
      const top = (id: string) => {
        const e = document.getElementById(id);
        return e ? e.getBoundingClientRect().top + scrollY : 0;
      };
      const about = top("about"),
        work = top("work"),
        services = top("services"),
        all = top("all-work"),
        contact = top("contact");
      let active: StoryScene = "top";
      for (const item of storyScenes)
        if (top(item.id) <= scrollY + h * 0.45) active = item.id;
      setScene(active);
      el.style.setProperty(
        "--page-progress",
        String(
          scrollY / Math.max(1, document.documentElement.scrollHeight - h),
        ),
      );
      const introP = preference.matches
        ? 1
        : clamp(
            (scrollY - about + h * 0.25) / Math.max(1, work - about - h * 0.55),
          );
      el.querySelectorAll<HTMLElement>(".intro-words span").forEach((word, i) =>
        word.classList.toggle("word-read", i / intro.length <= introP),
      );
      // The guide follows a continuous path, with the same scroll coordinates as the project scenes.
      const heroExit = ease(clamp(scrollY / Math.max(1, about * 0.9)));
      let left = lerp(w * 0.59, -w * 0.01, heroExit),
        width = lerp(w * 0.43, w * 0.33, heroExit),
        bottom = -h * 0.025;
      let nextPose: typeof pose =
        heroExit > 0.55 ? "present-right" : "audience";
      const travelDistance = Math.max(1, services - work - h);
      const tourP =
        clamp((scrollY - work) / travelDistance) * tourProjects.length;
      const chapter = Math.min(tourProjects.length - 1, Math.floor(tourP));
      if (scrollY >= work - h * 0.15 && scrollY < services - h * 0.1) {
        const t = ease(clamp((tourP - chapter - 0.84) / 0.16));
        const side = chapter % 2;
        left = lerp(
          side ? w * 0.67 : -w * 0.01,
          chapter < tourProjects.length - 1
            ? side
              ? -w * 0.01
              : w * 0.67
            : w * 0.67,
          t,
        );
        width = w * 0.33;
        nextPose = side ? "present-left" : "present-right";
      }
      if (scrollY >= services - h * 0.1) {
        left = w * 0.67;
        width = w * 0.33;
        nextPose = "present-left";
      }
      if (scrollY > all - h * 0.5) {
        const toBadge = ease(clamp((scrollY - (all - h * 0.5)) / (h * 0.7)));
        left = lerp(w * 0.67, 18, toBadge);
        width = lerp(w * 0.33, 150, toBadge);
        bottom = lerp(-h * 0.025, 18, toBadge);
        nextPose = "audience";
      }
      if (scrollY > contact - h * 0.55) {
        const toContact = ease(
          clamp((scrollY - (contact - h * 0.55)) / (h * 0.65)),
        );
        left = lerp(18, w * 0.59, toContact);
        width = lerp(150, w * 0.43, toContact);
        bottom = lerp(18, -h * 0.025, toContact);
        nextPose = "audience";
      }
      if (mobile) {
        left = lerp(w * 0.08, 4, heroExit);
        width = lerp(Math.min(w * 0.92, 410), 145, heroExit);
        bottom = lerp(-16, 55, heroExit);
        if (active === "all-work") {
          width = 90;
          bottom = 65;
        }
        if (active === "contact") {
          left = w * 0.36;
          width = w * 0.64;
          bottom = 50;
        }
      }
      if (preference.matches) {
        left = mobile
          ? 4
          : active === "top" || active === "contact"
            ? w * 0.61
            : (chapter % 2 && active === "work") || active === "services"
              ? w * 0.68
              : 0;
        width = mobile ? 120 : w * 0.31;
        bottom = mobile ? 60 : 0;
      }
      el.style.setProperty("--guide-left", `${left}px`);
      el.style.setProperty("--guide-width", `${width}px`);
      el.style.setProperty("--guide-bottom", `${bottom}px`);
      el.style.setProperty(
        "--hero-fade",
        String(1 - clamp(scrollY / (h * 0.75))),
      );
      el.style.setProperty("--hero-lift", `${-scrollY * 0.15}px`);
      setPose(nextPose);
      el.dataset.tourSide = chapter % 2 ? "right" : "left";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", schedule);
    };
  }, []);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied("done");
    } catch {
      setCopied("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied("idle"), 3000);
  };
  const scratchSpeech =
    scratch === 0
      ? "There’s more behind a click. *Scratch it* and I’ll show you."
      : scratch < 0.4
        ? "Keep going. You’re uncovering *the business logic*."
        : scratch < 1
          ? "Validation, decisions, notifications… *it’s all connected*."
          : "That’s my kind of work. *The whole system*, from interface to outcome.";
  return (
    <div ref={root} className={`story-site cinematic-story active-${scene}`}>
      <noscript>
        <style>{`
      .cinematic-story .continuous-tour { height: auto; }
      .cinematic-story .project-tour-stage { position: relative; height: auto; }
      .cinematic-story .scroll-chapter { position: relative; min-height: 100svh; visibility: visible; opacity: 1; pointer-events: auto; background: #293b32; }
      .cinematic-story .scroll-chapter[data-tone="light"] { background: #d4c8b4; }
      .cinematic-story .chapter-content { position: relative; top: auto; padding-block: 80px; }
      .cinematic-story .chapter-line { position: static; opacity: 1; margin-bottom: 8px; }
      .cinematic-story .emoji-guide { position: absolute !important; top: 28vh !important; bottom: auto !important; }
      .cinematic-story .intro-words span { color: #23251d; }
      .cinematic-story .scratch-actions { display: none; }
    `}</style>
      </noscript>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="story-grid" aria-hidden="true" />
      <div className="story-progress" aria-hidden="true" />
      <header className="cinema-header">
        <Link href="/">
          Sufiyan Ali<span>Full-stack developer &amp; AI builder</span>
        </Link>
        <a className="story-pill" href="#contact">
          Get in touch <ArrowDown size={17} />
        </a>
      </header>
      <main id="main-content">
        <section className="story-hero" id="top" aria-labelledby="story-title">
          <div className="hero-story-title">
            <h1 id="story-title">
              I build
              <br />
              apps that
              <br />
              <em>mean business.</em>
            </h1>
            <a className="hero-scroll-cue" href="#about">
              Scroll. I’ll show you around. <ArrowDown size={16} />
            </a>
          </div>
        </section>
        <section className="story-intro" id="about" aria-label="About Sufiyan">
          <div className="scene-sticky">
            <div className="story-content">
              <h2 className="intro-words" aria-label={intro.join(" ")}>
                {intro.map((word, i) => (
                  <span key={i} aria-hidden="true">
                    {word}{" "}
                  </span>
                ))}
              </h2>
            </div>
          </div>
        </section>
        <ProjectTour onCue={setTourCue} onNavigateReady={registerTour} />
        <section
          className="story-play"
          id="services"
          aria-labelledby="play-title"
        >
          <div className="scene-sticky">
            <div className="play-content">
              <div className="chapter-heading">
                <h2 id="play-title">Under the hood.</h2>
                <span>YOUR TURN ↓</span>
              </div>
              <div className="story-browser">
                <div className="browser-chrome">
                  <span aria-hidden="true">● ● ●</span>
                  <span>what happens after a click?</span>
                  <span>↗</span>
                </div>
                <LogicScratch onProgress={updateScratch} />
              </div>
              <p className="play-footnote">
                Websites. Full-stack applications. AI that does useful work.
              </p>
            </div>
          </div>
        </section>
        <section
          className="story-all"
          id="all-work"
          aria-labelledby="all-work-title"
        >
          <div className="archive-heading">
            <h2 id="all-work-title">All work</h2>
            <span>{projectDetails.length} projects</span>
          </div>
          <div className="archive-module-links">
            <Link href="/projects/gomila-oms">
              Gomila OMS · modules, jobs &amp; records{" "}
              <ArrowUpRight size={16} />
            </Link>
            <Link href="/projects/cega">
              CEGA · landing pages &amp; dashboards <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="archive-grid">
            {projectDetails.map((project) => (
              <Link
                key={project.name}
                href={`/projects/${projectSlug(project.name)}`}
                className={`archive-card archive-${projectSlug(project.name)}`}
              >
                <div className="archive-visual">
                  {project.img ? (
                    <Image
                      src={project.img}
                      alt={`${project.name} website preview`}
                      width={1440}
                      height={1000}
                      sizes="(max-width:760px) 90vw, 48vw"
                    />
                  ) : (
                    <div className="archive-concept">
                      {project.name === "Deeniverse" ? (
                        <>
                          <strong>d.</strong>
                          <span>DEENIVERSE / LEARNING PLATFORM ARCHIVE</span>
                        </>
                      ) : (
                        <>
                          <pre aria-hidden="true">
                            {
                              "   . : + * + : .\n : + # @ @ @ # + :\n + @ @ : : : @ @ +\n : + # @ @ @ # + :\n   . : + * + : ."
                            }
                          </pre>
                          <span>AI CHAT AGENT / INTERFACE CONCEPT</span>
                        </>
                      )}
                    </div>
                  )}
                  <span className="archive-open">
                    <ArrowUpRight />
                  </span>
                </div>
                <div className="archive-label">
                  <h3>{project.name}</h3>
                  <span>{project.kind}</span>
                </div>
                <span className="archive-status">{project.status}</span>
              </Link>
            ))}
          </div>
          <Link className="archive-browse" href="/projects">
            Explore all projects &amp; source builds <ArrowUpRight size={20} />
          </Link>
        </section>
        <section
          className="story-contact"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="contact-story-copy">
            <h2 id="contact-title">Got a project?</h2>
            <p>I’m taking on new work.</p>
            <div className="story-email">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <button
                type="button"
                aria-label="Copy email address"
                onClick={copy}
              >
                {copied === "done" ? <Check size={24} /> : <Copy size={24} />}
              </button>
            </div>
            <span className="story-copy-status" role="status">
              {copied === "done"
                ? "Copied! Talk soon."
                : copied === "failed"
                  ? "Select the address to copy, or click to email me."
                  : ""}
            </span>
            <a
              className="contact-whatsapp-link"
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              Or say hello on WhatsApp <ArrowUpRight size={18} />
            </a>
          </div>
          <footer className="story-footer">
            <div>
              <a href={site.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
              <a href={site.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a href={site.upwork} target="_blank" rel="noreferrer">
                Upwork ↗
              </a>
            </div>
            <div>
              <span>© {new Date().getFullYear()} Sufiyan Ali</span>
              <Link href="/journey">The human ↗</Link>
              <Link href="/quotes">The wall ↗</Link>
              <Link href="/creatives">Playground ↗</Link>
              <a href="#top">Again? ↑</a>
            </div>
          </footer>
        </section>
      </main>
      <EmojiMascot
        scene={scene}
        pose={pose}
        speech={
          scene === "work"
            ? tourCue?.text
            : scene === "services"
              ? scratchSpeech
              : undefined
        }
      />
      <nav className="story-index" aria-label="Jump to a story section">
        <a href="#top">Hello</a>
        <a href="#work">Work</a>
        <a href="#services">Play</a>
        <a href="#contact">Talk</a>
      </nav>
    </div>
  );
}
