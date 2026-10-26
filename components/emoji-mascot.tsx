"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MascotCanvas } from "@/components/mascot-canvas";
import type { AvatarPose } from "@/lib/avatar-rig";
import { Download, Sparkles, Volume2, VolumeX, X, Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import { storyScenes, type StoryScene } from "@/lib/story";

type Trick = "idle" | "wave" | "dance" | "think" | "glitch" | "fly" | "nod" | "surprise";
const reactions: Record<Trick, string> = {
  idle: "",
  wave: "Hey there! *Good to meet you.*",
  dance: "When the build passes *on the first try*.",
  think: "One sec. Untangling *the business logic*…",
  glitch: "Works on *my* machine. Probably.",
  fly: "Shipping this one *to production*!",
  nod: "Exactly. *The details* are where it starts.",
  surprise: "Oh, hey! You found me. *Want the tour?*",
};

type TourControls = { canBack:boolean; onBack:()=>void; onNext:()=>void; nextLabel:string };

const plain = (text: string) => text.replace(/\*/g, "");

/** Splits a line into words that arrive one by one; *wrapped* phrases get the accent colour. */
function Spoken({ text }: { text: string }) {
  let n = 0;
  return <>{text.split(/(\*[^*]+\*)/).filter(Boolean).map((part, p) => {
    const accent = part.startsWith("*") && part.endsWith("*");
    return (accent ? part.slice(1, -1) : part).match(/\S+\s*|\s+/g)?.map((word, w) =>
      <span aria-hidden="true" key={`${p}-${w}`} className={`narration-word${accent ? " narration-accent" : ""}`} style={{ animationDelay: `${Math.min(n++ * .045, .9)}s` }}>{word}</span>);
  })}</>;
}

export function EmojiMascot({ scene = "top", standalone = false, speech, pose: poseOverride, dotted = true, tour, onStartTour, away = false }: { scene?: StoryScene; standalone?: boolean; speech?: string; pose?: AvatarPose; dotted?: boolean; tour?:TourControls; onStartTour?:()=>void; away?: boolean }) {
  const preference = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const reduced = mounted && Boolean(preference);
  useEffect(() => setMounted(true), []);
  const [trick, setTrick] = useState<Trick>("idle");
  const [open, setOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [touch, setTouch] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [talking,setTalking]=useState(false);
  const [quiet,setQuiet]=useState(false);
  const dragEnded=useRef(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const current = storyScenes.find(item => item.id === scene) ?? storyScenes[0];
  const narration=speech ?? current.speech;
  useEffect(()=>{setTrick("idle");},[narration]);
  const message=dragging ? "Okay, okay. *You’ve got me!*" : trick!=="idle" ? reactions[trick] : narration;
  const touring=Boolean(tour);
  useEffect(()=>{
    setTalking(true);setQuiet(false);
    const words=plain(message).split(/\s+/).length;
    const timer=setTimeout(()=>setTalking(false),Math.min(6500,Math.max(1800,words*260)));
    // On phones the bubble tucks away once it has been read, so it never sits on top of the content.
    const small=matchMedia("(max-width: 760px)").matches;
    const tuck=!standalone&&!touring&&scene!=="top"&&small?setTimeout(()=>setQuiet(true),Math.min(7000,Math.max(3800,words*380))):undefined;
    return()=>{clearTimeout(timer);if(tuck)clearTimeout(tuck);};
  },[message,standalone,touring,scene]);

  useEffect(() => {
    const query = matchMedia("(pointer: coarse)");
    const update = () => setTouch(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); void audio.current?.close(); }, []);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); document.getElementById(standalone ? "lab-tricks" : "story-tricks")?.focus(); } };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open, standalone]);

  const chime = () => {
    try {
      audio.current ??= new AudioContext();
      const ctx = audio.current;
      void ctx.resume();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(480, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + .13);
      gain.gain.setValueAtTime(.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .2);
      oscillator.connect(gain); gain.connect(ctx.destination);
      oscillator.start(); oscillator.stop(ctx.currentTime + .21);
    } catch { /* Sound is optional; every interaction also has a visual response. */ }
  };
  const play = (next: Trick) => {
    if (timeout.current) clearTimeout(timeout.current);
    setTrick(next); setOpen(false); setHidden(false);
    document.getElementById(standalone ? "lab-tricks" : "story-tricks")?.focus({ preventScroll: true });
    if (sound) chime();
    timeout.current = setTimeout(() => setTrick("idle"), 3600);
  };

  const pose: AvatarPose = poseOverride ?? (scene === "top" || scene === "contact" ? "audience" : "present-right");
  return <>
    <aside className={`emoji-guide scene-${scene} ${standalone ? "emoji-standalone" : ""} ${hidden ? "guide-hidden" : ""} ${quiet ? "guide-quiet" : ""} ${away && !standalone ? "guide-away" : ""}`} aria-label="Sufiyan’s interactive black-and-white avatar">
      <div className={`guide-speech ${tour?"guide-tour-speech":""}`}>
        <p className="guide-narration" aria-live="polite" aria-atomic="true" key={message}><span className="sr-only">{plain(message)}</span><Spoken text={message}/></p>
        {tour?<div className="guide-tour-controls"><button type="button" disabled={!tour.canBack} onClick={tour.onBack} aria-label="Previous step"><ArrowLeft size={15}/></button><button type="button" onClick={tour.onNext}>{tour.nextLabel}<ArrowRight size={15}/></button></div>:scene==="top"&&onStartTour?<button className="guide-start-tour" type="button" onClick={onStartTour}>Show me the projects <ArrowRight size={15}/></button>:null}
      </div>
      <motion.div className="guide-drag" drag={mounted && !reduced && !touch} dragSnapToOrigin dragConstraints={{ left: -85, right: 85, top: -100, bottom: 0 }} dragElastic={.15} onDragStart={() => setDragging(true)} onDragEnd={() => {setDragging(false);dragEnded.current=Date.now();}}
        role="button" tabIndex={hidden?-1:0} aria-label="Say hello to Sufiyan" onClick={()=>{if(Date.now()-dragEnded.current>350)play(trick==="wave"?"surprise":"wave");}} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();play("wave");}}} >
        <div className={`guide-character guide-3d trick-${trick}`}>
          <MascotCanvas pose={pose} action={trick==="idle"&&talking?"talk":trick} reduced={Boolean(reduced)} dotted={dotted} paused={hidden||(away&&!standalone)}/>
          {trick === "think" && <span className="thinking-bits" aria-hidden="true">&lt;/&gt;<i>…</i></span>}
          {trick === "glitch" && <span className="glitch-label" aria-hidden="true">404: serious face not found</span>}
        </div>
      </motion.div>
      <span className="grab-hint">{reduced || touch ? "Tap me." : "Psst. You can drag me."}</span>
    </aside>
    <div className={`character-tools ${standalone ? "character-tools-local" : ""}`}>
      {open && <div className="trick-menu" role="group" aria-label="Character reactions"><div><strong>A little personality.</strong><button type="button" onClick={() => setOpen(false)} aria-label="Close character controls"><X size={17}/></button></div>{([['wave','Say hello'],['dance','Happy dance'],['think','Think it through'],['glitch','Break the matrix'],['fly','Ship it!'],['nod','Good point'],['surprise','Surprise me']] as const).map(([value,label]) => <button type="button" key={value} onClick={() => play(value)}>{label}<span>↗</span></button>)}
        <div className="trick-settings">
          {!standalone && <button type="button" onClick={() => { setHidden(!hidden); setOpen(false); }} aria-pressed={hidden}>{hidden ? <Eye size={15}/> : <EyeOff size={15}/>}{hidden ? "Bring him back" : "Hide the character"}</button>}
          <button type="button" onClick={() => { setSound(!sound); if (!sound) chime(); }} aria-pressed={sound}>{sound ? <Volume2 size={15}/> : <VolumeX size={15}/>}{sound ? "Sound on" : "Sound off"}</button>
        </div>
        <a href="/avatar/sufiyan-guide.png" download="sufiyan-monochrome-emoji.png">Keep my avatar <Download size={15}/></a></div>}
      <button type="button" id={standalone ? "lab-tricks" : "story-tricks"} className="trick-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Character tricks and settings"><Sparkles size={15}/><span>Do a trick</span></button>
    </div>
  </>;
}
