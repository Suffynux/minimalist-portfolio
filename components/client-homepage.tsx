"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, Menu, Minus, Plus, X } from "lucide-react";
import { ProjectCarousel } from "@/components/project-carousel";
import { MascotCanvas } from "@/components/mascot-canvas";
import { projectDetails, site } from "@/lib/data";

const services = [
  { title: "Websites & storefronts", copy: "Give customers a clear reason to choose you. Thoughtful websites, product discovery and shopping experiences.", examples: "Business websites / Shopify / Product catalogues" },
  { title: "Business applications", copy: "Bring the work behind your business into one place. Orders, applications, dashboards and tools your team can actually use.", examples: "Operations platforms / Portals / Internal tools" },
  { title: "AI & automation", copy: "Make repetitive work easier. Connect your tools, answer common questions and turn useful AI ideas into working features.", examples: "AI assistants / Visualisers / Connected workflows" },
];

export function ClientHomepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [characterHidden, setCharacterHidden] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [action, setAction] = useState<"idle" | "wave">("idle");
  const [openService, setOpenService] = useState<number | null>(0);
  const [brief, setBrief] = useState({ name: "", project: "", timeline: "" });
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (action === "idle") return;
    const timer = window.setTimeout(() => setAction("idle"), 2200);
    return () => clearTimeout(timer);
  }, [action]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); document.getElementById("home-menu-toggle")?.focus(); }
    };
    if (menuOpen) window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  const message = `Hi Sufiyan,\n\nI'm ${brief.name.trim()}.\n\nHere's what I'd like to build:\n${brief.project.trim()}${brief.timeline ? `\n\nPreferred timeline: ${brief.timeline}` : ""}\n\nLet's discuss the next steps.`;
  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!brief.name.trim() || !brief.project.trim()) { setFeedback("Please add your name and a short project description."); return; }
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Let's discuss a project")}&body=${encodeURIComponent(message)}`;
    setFeedback("Your email app will open with the brief. Review it there and send when you’re ready. You can also copy the brief below.");
  }
  async function copyBrief() {
    try { await navigator.clipboard.writeText(message); setCopied(true); setFeedback("Brief copied. Paste it into an email or WhatsApp message."); }
    catch { setFeedback("Copy is unavailable in this browser. You can email me directly using the address alongside the form."); }
  }

  return <div className="client-home client-home-luxury" id="top">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="client-nav">
      <div className="client-width client-nav-inner">
        <Link href="/" className="client-brand">Sufiyan Ali<span>FULL-STACK DEVELOPER & AI BUILDER</span></Link>
        <nav className="client-desktop-nav" aria-label="Main navigation">
          <a href="#work">Selected work</a><a href="#services">Services</a><a href="#about">About me</a>
        </nav>
        <a className="client-button client-button-olive client-nav-cta" href="#contact">Let’s talk <ArrowUpRight size={17}/></a>
        <button id="home-menu-toggle" className="client-menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="home-mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      </div>
      {menuOpen && <nav id="home-mobile-nav" className="client-mobile-menu" aria-label="Mobile navigation">{[["Selected work", "#work"],["Services", "#services"],["About me", "#about"],["Discuss your project", "#contact"]].map(([label, href]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={18}/></a>)}</nav>}
    </header>

    <main id="main-content">
      <section className="client-hero" aria-labelledby="home-title">
        <div className="client-width client-hero-grid">
          <div className="client-hero-copy">
            <p className="client-kicker"><span className="client-dot"/> INDEPENDENT DEVELOPER / AVAILABLE FOR SELECTED WORK</p>
            <h1 id="home-title">Digital craft.<br/><em>Business impact.</em></h1>
            <p className="client-hero-description">I design and build websites, business systems and AI tools that turn complex work into a clear experience.</p>
            <div className="client-actions"><a className="client-button client-button-paper" href="#contact">Discuss your project <ArrowUpRight size={18}/></a><a className="client-hero-work" href="#work">Enter the collection <ArrowDown size={17}/></a></div>
            <div className="client-hero-note"><span>STRATEGY → DESIGN → DEVELOPMENT → LAUNCH</span></div>
          </div>
          <div className="client-hero-person">
            <div className="client-person-note">Sufiyan Ali.<br/><strong>Design-minded. Built for business.</strong><span className="client-note-spark">✳</span></div>
            <div className={`client-character ${characterHidden ? "client-character-hidden" : ""}`}>
              <div className="client-character-disc"/>
              {!characterHidden && <MascotCanvas pose="audience" action={action} reduced={reduced}/>}
              {characterHidden && <div className="client-character-placeholder">Good ideas.<br/><em>Made real.</em></div>}
            </div>
            <div className="client-character-controls">{!characterHidden && <button onClick={() => setAction("wave")}>Say hello <span aria-hidden="true">↗</span></button>}<button aria-pressed={characterHidden} onClick={() => setCharacterHidden(!characterHidden)}>{characterHidden ? "Show character" : "Hide character"}</button></div>
          </div>
        </div>
        <div className="client-width client-hero-bottom"><span>BASED IN PAKISTAN · BUILDING FOR BUSINESSES EVERYWHERE</span><a href="#work">THE WORK SPEAKS FOR ITSELF <ArrowDown size={14}/></a></div>
      </section>

      <div className="client-proof client-width" aria-label="Selected project experience"><span>A FEW BUSINESSES <br/>I’VE BUILT FOR</span><div className="client-proof-names"><span>GOMILA</span><span>CEGA<span className="client-proof-small">Gaming & Animation</span></span><span>ZONE PRO<span className="client-proof-small">MATÉRIAUX</span></span><span>UK Medical Aid</span></div></div>

      <ProjectCarousel/>

      <section id="tools" className="client-tools client-width"><div className="client-section-heading"><div><p className="client-kicker">SMALL TOOLS / USEFUL IDEAS</p><h2>A little less friction.<br/><em>A little more done.</em></h2></div><p>Smaller builds with a focused purpose.<br/>Take a look, then try the live experience.</p></div><div className="client-tool-grid">{projectDetails.filter(p=>["Save My Tokens","CV Glow AI"].includes(p.name)).map(p=><article className="client-tool" key={p.name}><Link href={`/projects/${p.name.toLowerCase().replaceAll(" ","-")}`} aria-label={`Preview ${p.name}`}><Image src={p.img} alt={`${p.name} interface preview`} width={1440} height={900} sizes="(max-width:700px) 100vw, 50vw"/></Link><div><p className="client-kicker">{p.status} / {p.kind}</p><h3>{p.name}</h3><p>{p.desc}</p><div className="client-actions"><a className="client-button client-button-olive" href={p.live} target="_blank" rel="noreferrer">{p.status==="LIVE"?"Try the tool":"Open preview"}<ArrowUpRight size={16}/></a><Link className="client-text-link" href={`/projects/${p.name.toLowerCase().replaceAll(" ","-")}`}>See details <ArrowRight size={16}/></Link></div></div></article>)}</div></section>

      <section id="services" className="client-services" aria-labelledby="services-title"><div className="client-width"><div className="client-section-heading"><div><p className="client-kicker">02 / WHAT I CAN HELP WITH</p><h2 id="services-title">A better website.<br/>A smoother <em>business.</em></h2></div><p>Start with the problem you want to solve.<br/>We’ll find the right thing to build.</p></div><div className="client-service-list">{services.map((service,index)=><article key={service.title} className="client-service"><button aria-expanded={openService===index} aria-controls={`service-${index}`} onClick={()=>setOpenService(openService===index?null:index)}><span className="client-service-number">0{index+1}</span><h3>{service.title}</h3>{openService===index?<Minus/>:<Plus/>}</button><div id={`service-${index}`} hidden={openService!==index} className="client-service-body"><p>{service.copy}</p><span>{service.examples}</span><a className="client-text-link" href="#contact">Let’s talk about it <ArrowUpRight size={17}/></a></div></article>)}</div></div></section>

      <section id="about" className="client-about client-width"><div className="client-about-title"><p className="client-kicker">03 / THE PERSON BEHIND THE BUILD</p><h2>You bring the idea.<br/><em>I connect the dots.</em></h2><Link className="client-text-link" href="/journey">A little more about me <ArrowUpRight size={18}/></Link></div><div className="client-about-copy"><p>I’m Sufiyan, a full-stack developer based in Pakistan. I enjoy the part where design, code and a real business problem come together.</p><p>You work directly with the person building your product. We’ll talk through the details, review working versions and make the next step clear.</p><div className="client-process">{[["Understand", "Your goals, users and the work that needs to get easier."],["Build together", "Clear milestones and working previews to review."],["Launch & hand over", "Testing, deployment and a plan for what comes next."]].map(([title,copy],index)=><div key={title}><span>0{index+1}</span><div><h3>{title}</h3><p>{copy}</p></div></div>)}</div></div></section>

      <section id="contact" className="client-contact" aria-labelledby="contact-title"><div className="client-width client-contact-grid"><div><p className="client-kicker">04 / YOUR NEXT PROJECT</p><h2 id="contact-title">Something in mind?<br/><em>Let’s make it real.</em></h2><p>A new website, a tool for your team or a process that needs fixing. Tell me where you want to go.</p><a className="client-contact-email" href={`mailto:${site.email}`}>{site.email}<ArrowUpRight size={22}/></a><a className="client-button client-button-outline" href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Sufiyan, I’d like to discuss a project.")}`} target="_blank" rel="noreferrer">Prefer WhatsApp? <ArrowUpRight size={18}/></a><p className="client-contact-next">What happens next? We’ll clarify the scope, discuss the approach and work out an estimate.</p></div><form className="client-brief" onSubmit={prepareEmail}><h3>A little about your project</h3><p>Prepare a brief to send from your own email app.</p><label htmlFor="brief-name">Your name<input id="brief-name" name="name" autoComplete="name" required maxLength={100} value={brief.name} onChange={e=>{setBrief({...brief,name:e.target.value});setCopied(false);setFeedback("");}} placeholder="How should I address you?"/></label><label htmlFor="brief-project">What would you like to build?<textarea id="brief-project" name="project" required maxLength={1500} rows={3} value={brief.project} onChange={e=>{setBrief({...brief,project:e.target.value});setCopied(false);setFeedback("");}} placeholder="The idea, the problem, or your current website…"/></label><label htmlFor="brief-timeline">Preferred timeline <span>(optional)</span><select id="brief-timeline" value={brief.timeline} onChange={e=>{setBrief({...brief,timeline:e.target.value});setCopied(false);setFeedback("");}}><option value="">Let’s discuss</option><option>As soon as possible</option><option>Within 1–3 months</option><option>Exploring for later</option></select></label><div className="client-actions"><button className="client-button client-button-paper" type="submit">Prepare email <ArrowUpRight size={17}/></button><button type="button" className="client-copy-brief" onClick={copyBrief} disabled={!brief.name.trim()||!brief.project.trim()}>{copied?<Check size={16}/>:<Copy size={16}/>} {copied?"Copied":"Copy brief"}</button></div><p className="client-brief-feedback" role="status">{feedback||"Nothing is submitted or stored by this form."}</p></form></div></section>
    </main>

    <footer className="client-footer client-width"><div><Link href="/" className="client-footer-brand">Sufiyan Ali<span>Good ideas deserve to be built.</span></Link><nav aria-label="Social links"><a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15}/></a><a href={site.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15}/></a><a href={site.upwork} target="_blank" rel="noreferrer">Upwork <ArrowUpRight size={15}/></a></nav></div><div className="client-footer-bottom"><span>© {new Date().getFullYear()} Sufiyan Ali / Suffynux</span><nav aria-label="More to explore"><Link href="/projects">All work</Link><Link href="/creatives">Playground</Link><Link href="/quotes">Quote wall</Link><a href="#top">Back to top ↑</a></nav></div></footer>
  </div>;
}
