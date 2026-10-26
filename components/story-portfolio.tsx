"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, Github, MoveDown } from "lucide-react";
import { ProjectTour } from "@/components/project-tour";
import { tourStops, type TourCue } from "@/lib/project-tour";
import { Navbar } from "@/components/navbar";
import { Testimonials } from "@/components/testimonials";
import { projectSlug } from "@/lib/portfolio-content";
import { EmojiMascot } from "@/components/emoji-mascot";
import { storyScenes, type StoryScene } from "@/lib/story";
import { site, projectDetails } from "@/lib/data";

const intro = "I’m a full-stack developer based in Pakistan. I build websites, applications and AI-powered tools — and connect them to the business logic that makes them useful. From the first idea to the final deployment, I own the whole build.".split(" ");
const layers = [
  { name: "The experience", tag: "FRONTEND", title: "It starts with the person using it.", text: "Fast pages, clear interfaces and thoughtful interactions. Websites, web apps and storefronts that make the next step feel obvious.", stack: "React · Next.js · TypeScript · Shopify", code: ['<ProductExperience>', '  <UsefulInterface />', '  <ClearNextStep />', '</ProductExperience>'] },
  { name: "The logic", tag: "BACKEND", title: "Then the rules that make it work.", text: "Who can do what? What happens next? Authentication, approvals, payments and connected data — built around your real workflow.", stack: "Node.js · APIs · MongoDB · Authentication", code: ['when application.isVerified:', '  assignReviewer(application)', '  notifyApplicant(application)', '  recordDecision(application)'] },
  { name: "The intelligence", tag: "AI & AUTOMATION", title: "And a little less busywork.", text: "AI assistants and automated workflows connected to real information. Useful answers, sensible boundaries and a human in control.", stack: "LLM integrations · Python · Workflows", code: ['question → relevant context', 'context → grounded answer', 'uncertain? → ask a human', 'repeat work → automate it'] },
];

export function StoryPortfolio() {
  const [scene, setScene] = useState<StoryScene>("top");
  const [introProgress, setIntroProgress] = useState(0);
  const [tourCue,setTourCue]=useState<TourCue|null>(null);
  const navigateTour=useRef<((index:number)=>void)|null>(null);
  const registerTour=useCallback((navigate:(index:number)=>void)=>{navigateTour.current=navigate;},[]);
  const startTour=()=>navigateTour.current?.(0);
  const [layer, setLayer] = useState(0);
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const sections = storyScenes.map(item => document.getElementById(item.id));
    const update = () => {
      frame.current = 0;
      const center = innerHeight * .5;
      let active: StoryScene = "top";
      sections.forEach((section, i) => {
        if (section && section.getBoundingClientRect().top <= center) active = storyScenes[i].id;
      });
      setScene(active);
      const about = document.getElementById("about");
      if (about) {
        const rect = about.getBoundingClientRect();
        setIntroProgress(reduced.matches ? 1 : Math.min(1, Math.max(0, (innerHeight * .65 - rect.top) / (rect.height - innerHeight * .35))));
      }
      setProgress(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
    };
    const requestUpdate = () => { if (!frame.current) frame.current = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reduced.addEventListener("change", requestUpdate);
    return () => { cancelAnimationFrame(frame.current); window.removeEventListener("scroll", requestUpdate); window.removeEventListener("resize", requestUpdate); reduced.removeEventListener("change", requestUpdate); };
  }, []);
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(site.email); setCopied("done"); }
    catch { setCopied("failed"); }
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied("idle"), 3500);
  };
  const activeLayer = layers[layer];

  return <div className={`story-site active-${scene}`} ref={root}>
    
    <div className="story-grid" aria-hidden="true"/>
    <div className="story-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true"/>
    <Navbar hero/>
    <nav className="scene-nav" aria-label="Story chapters">{storyScenes.map(item => <a key={item.id} href={`#${item.id}`} aria-current={scene === item.id ? "location" : undefined} aria-label={item.label}><span/ ><i>{item.label}</i></a>)}</nav>
    <main id="main-content">
      <section className="story-hero story-scene" id="top" aria-labelledby="story-title">
        <div className="hero-chapter">INDEPENDENT DEVELOPER / PAKISTAN → EVERYWHERE</div>
        <h1 id="story-title">I build<br/>apps that<br/><em>mean business.</em></h1>
        <div className="hero-tour-actions"><button type="button" className="story-pill" onClick={startTour}>Let me show you around <ArrowRight size={17}/></button><span>{projectDetails.length} projects. A little story behind each.</span></div>
        <a href="#about" className="story-scroll"><MoveDown size={18}/><span>SCROLL TO MEET THE HUMAN</span></a>
      </section>
      <section className="story-intro story-scene" id="about" aria-labelledby="intro-title"><div className="scene-sticky"><div className="story-content"><p className="story-kicker">01 / A LITTLE CONTEXT</p><h2 id="intro-title" className="intro-words" aria-label={intro.join(" ")}>{intro.map((word, i) => <span key={`${i}-${word}`} aria-hidden="true" className={i / intro.length <= introProgress ? "word-read" : ""}>{word} </span>)}</h2><p className="intro-note">Curious by nature. Practical by choice.<br/>Let me show you what that looks like.</p></div></div></section>
      <ProjectTour onCue={setTourCue} onNavigateReady={registerTour}/>
      <section className="story-layers story-scene" id="services" aria-labelledby="layers-title"><div className="scene-sticky"><div className="story-content"><p className="story-kicker">05 / EVERY LAYER OF THE BUILD</p><h2 id="layers-title">Good on the outside.<br/><em>Smart underneath.</em></h2><div className="layer-tabs" role="tablist" aria-label="Explore my development expertise">{layers.map((item, i) => <button type="button" key={item.name} id={`layer-tab-${i}`} role="tab" aria-selected={layer === i} aria-controls="layer-panel" tabIndex={layer === i ? 0 : -1} onClick={() => setLayer(i)} onKeyDown={event => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) { event.preventDefault(); const next = event.key === "Home" ? 0 : event.key === "End" ? 2 : (i + (event.key === "ArrowRight" ? 1 : 2)) % 3; setLayer(next); document.getElementById(`layer-tab-${next}`)?.focus(); } }}><span>0{i + 1}</span>{item.name}</button>)}</div><div className="layer-panel" id="layer-panel" role="tabpanel" aria-labelledby={`layer-tab-${layer}`} tabIndex={0}><div><span className="story-kicker">{activeLayer.tag}</span><h3>{activeLayer.title}</h3><p>{activeLayer.text}</p><span className="layer-stack">{activeLayer.stack}</span></div><div className="logic-window"><div><span>~/suffynux/build</span><span>● ● ●</span></div><pre aria-label="Illustrative development logic">{activeLayer.code.map((line, i) => <span key={`${layer}-${i}`}><i>{i + 1}</i>{line}{"\n"}</span>)}</pre><span className="logic-footer">✳ A LITTLE LOGIC. A LOT OF POSSIBILITY.</span></div></div></div></div></section>
      <section className="story-all story-scene" id="all-work" aria-labelledby="all-work-title"><div className="story-content"><p className="story-kicker">THE WORK, AT A GLANCE</p><div className="all-work-heading"><h2 id="all-work-title">Built &amp; shipped.</h2><span>{projectDetails.length} projects</span></div><div className="story-work-list">{projectDetails.map((project, i) => <a key={project.name} href={`/projects/${projectSlug(project.name)}`}><span className="work-number">0{i + 1}</span><h3>{project.name}</h3><span className="work-kind">{project.kind}</span><ArrowUpRight size={23}/></a>)}</div><Link href="/projects" className="story-pill">Explore all projects <ArrowRight size={18}/></Link></div></section>
      <Testimonials/>
      <section className="story-explore" aria-label="Explore the rest of the portfolio"><p className="story-kicker">THERE’S A LITTLE MORE TO THE STORY</p><div className="story-explore-links"><Link href="/journey"><strong>The human ↗</strong><span>How I got here, what I care about, and how I approach the work.</span></Link><Link href="/quotes"><strong>The quote wall ↗</strong><span>Words worth keeping. A space to read, pause, and leave a line of your own.</span></Link><Link href="/creatives"><strong>The playground ↗</strong><span>Meet the character. Try a pose, change the finish, make him dance.</span></Link></div></section>
      <section className="story-contact story-scene" id="contact" aria-labelledby="contact-title"><div className="contact-story-copy"><p className="story-kicker">YOUR TURN / LET’S MAKE IT REAL</p><h2 id="contact-title">Got an idea?</h2><p>I’m taking on new projects.</p><div className="story-email"><a href={`mailto:${site.email}`}>{site.email}</a><button type="button" aria-label="Copy email address" onClick={copyEmail}>{copied === "done" ? <Check size={23}/> : <Copy size={23}/>}</button></div><span className="story-copy-status" role="status">{copied === "done" ? "Copied. Talk soon!" : copied === "failed" ? "Click the address to email me, or select it to copy." : ""}</span><a className="story-pill" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">Let’s talk on WhatsApp <ArrowUpRight size={18}/></a></div><footer className="story-footer"><div><a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={20}/></a><a href={site.github} target="_blank" rel="noreferrer">GitHub <Github size={21}/></a><a href={site.upwork} target="_blank" rel="noreferrer">Upwork <ArrowUpRight size={20}/></a></div><div><span>© {new Date().getFullYear()} Sufiyan Ali</span><a href="/avatar/sufiyan-guide.png" download="sufiyan-monochrome-emoji.png">Keep my avatar ↓</a><Link href="/journey">The human ↗</Link><Link href="/quotes">The quote wall ↗</Link><Link href="/creatives">Playground ↗</Link><a href="#top">Take the tour again ↑</a></div></footer></section>
    </main>
    <EmojiMascot scene={scene} speech={scene === "work" ? tourCue?.text : scene === "services" ? activeLayer.text : undefined}
      tour={scene === "work" && tourCue ? {
        title: `${tourCue.projectName} · ${tourCue.title}`,
        canBack:tourCue.index>0,
        canNext:tourCue.index<tourStops.length-1,
        onBack:()=>navigateTour.current?.(tourCue.index-1),
        onNext:()=>navigateTour.current?.(tourCue.index+1),
        onNextProject:()=>{const next=tourStops.findIndex(item=>item.projectIndex===tourCue.projectIndex+1);if(next>=0)navigateTour.current?.(next);else document.getElementById("contact")?.scrollIntoView({behavior:"instant"});},
        nextLabel:tourCue.stepIndex<2?"Tell me more":"Next project",
        lastProject:tourCue.projectIndex===projectDetails.length-1,
      }:undefined} onStartTour={startTour}/>
  </div>;
}
