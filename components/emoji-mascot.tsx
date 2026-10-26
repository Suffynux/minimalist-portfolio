"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MascotCanvas } from "@/components/mascot-canvas";
import type { AvatarPose } from "@/lib/avatar-rig";
import { Download, Sparkles, Volume2, VolumeX, X, Eye, EyeOff, ArrowLeft, ArrowRight, Play, Square } from "lucide-react";
import { storyScenes, type StoryScene } from "@/lib/story";

type Trick = "idle" | "wave" | "dance" | "think" | "glitch" | "fly" | "nod" | "surprise";
const reactions: Record<Trick, string> = {
  idle: "",
  wave: "Hey there! Good to meet you. Let’s build something.",
  dance: "When the build passes on the first try.",
  think: "One moment. I’m untangling the business logic…",
  glitch: "Works on my machine. Probably.",
  fly: "Shipping this one to production!",
  nod: "Exactly. The details are where a good build starts.",
  surprise: "Oh, hey! You found me. Want to see what I’ve built?",
};

type TourControls = { title:string; canBack:boolean; canNext:boolean; onBack:()=>void; onNext:()=>void; onNextProject:()=>void; nextLabel:string; lastProject:boolean };

export function EmojiMascot({ scene = "top", standalone = false, speech, pose: poseOverride, dotted = true, tour, onStartTour }: { scene?: StoryScene; standalone?: boolean; speech?: string; pose?: AvatarPose; dotted?: boolean; tour?:TourControls; onStartTour?:()=>void }) {
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
  const [voiceAvailable,setVoiceAvailable]=useState(false);
  const [speaking,setSpeaking]=useState(false);
  const dragEnded=useRef(0);
  const utterance=useRef<SpeechSynthesisUtterance|null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const current = storyScenes.find(item => item.id === scene) ?? storyScenes[0];
  const narration=speech ?? current.speech;
  useEffect(()=>{setTrick("idle");},[narration]);
  const message=dragging ? "Okay, okay — you’ve got me!" : trick!=="idle" ? reactions[trick] : narration;
  useEffect(()=>{setVoiceAvailable("speechSynthesis" in window);},[]);
  useEffect(()=>{
    setTalking(true);
    setSpeaking(false);
    const timer=setTimeout(()=>setTalking(false),Math.min(6500,Math.max(1800,message.length*36)));
    if(utterance.current){window.speechSynthesis.cancel();utterance.current=null;setSpeaking(false);}
    return()=>{clearTimeout(timer);if(utterance.current){window.speechSynthesis.cancel();utterance.current=null;}};
  },[message]);
  const readAloud=()=>{
    if(!voiceAvailable)return;
    if(speaking){window.speechSynthesis.cancel();utterance.current=null;setSpeaking(false);return;}
    const line=new SpeechSynthesisUtterance(narration);line.lang="en-US";line.rate=.96;
    line.onend=line.onerror=()=>{if(utterance.current===line){utterance.current=null;setSpeaking(false);}};
    utterance.current=line;setSpeaking(true);window.speechSynthesis.speak(line);
  };

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
    setTrick(next); setOpen(false);
    document.getElementById(standalone ? "lab-tricks" : "story-tricks")?.focus({ preventScroll: true });
    if (sound) chime();
    timeout.current = setTimeout(() => setTrick("idle"), 3600);
  };

  const pose: AvatarPose = poseOverride ?? (scene === "top" || scene === "contact" ? "audience" : "present-right");
  return <>
    <aside className={`emoji-guide scene-${scene} ${standalone ? "emoji-standalone" : ""} ${hidden ? "guide-hidden" : ""}`} aria-label="Sufiyan’s interactive black-and-white avatar">
      <div className={`guide-speech ${tour?"guide-tour-speech":""}`}>
        {tour&&<p className="guide-context">{tour.title}</p>}
        <p className="guide-narration" aria-live="polite" aria-atomic="true" aria-label={message} key={message}><span className="sr-only">{message}</span>{message.split(" ").map((word,i)=><span aria-hidden="true" className="narration-word" style={{animationDelay:`${Math.min(i*.024,.65)}s`}} key={i}>{word}{" "}</span>)}</p>
        {tour?<div className="guide-tour-controls"><button type="button" disabled={!tour.canBack} onClick={tour.onBack} aria-label="Go back in project story"><ArrowLeft size={16}/></button><button type="button" disabled={!tour.canNext} onClick={tour.onNext}>{tour.canNext?tour.nextLabel:"Tour complete"}<ArrowRight size={15}/></button><button type="button" className="guide-skip-project" onClick={tour.onNextProject}>{tour.lastProject?"Let’s talk ↗":"Skip to next project ↗"}</button></div>:scene==="top"&&onStartTour?<button className="guide-start-tour" type="button" onClick={onStartTour}>Show me the projects <ArrowRight size={15}/></button>:null}
        {voiceAvailable&&tour&&<button type="button" className="guide-read-aloud" onClick={readAloud} aria-pressed={speaking}>{speaking?<Square size={12}/>:<Play size={12}/>} {speaking?"Stop reading":"Read this aloud"}</button>}
      </div>
      <motion.div className="guide-drag" drag={mounted && !reduced && !touch} dragSnapToOrigin dragConstraints={{ left: -85, right: 85, top: -100, bottom: 0 }} dragElastic={.15} onDragStart={() => setDragging(true)} onDragEnd={() => {setDragging(false);dragEnded.current=Date.now();}}
        role="button" tabIndex={hidden?-1:0} aria-label="Say hello to Sufiyan" onClick={()=>{if(Date.now()-dragEnded.current>350)play(trick==="wave"?"surprise":"wave");}} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();play("wave");}}} >
        <div className={`guide-character guide-3d trick-${trick}`}>
          <MascotCanvas pose={pose} action={trick==="idle"&&(talking||speaking)?"talk":trick} reduced={Boolean(reduced)} dotted={dotted} paused={hidden}/>
          {trick === "think" && <span className="thinking-bits" aria-hidden="true">&lt;/&gt;<i>…</i></span>}
          {trick === "glitch" && <span className="glitch-label" aria-hidden="true">404: serious face not found</span>}
        </div>
      </motion.div>
      <span className="grab-hint">{reduced || touch ? "Try a character reaction ↓" : "Psst. You can drag me."}</span>
    </aside>
    <div className={`character-tools ${standalone ? "character-tools-local" : ""}`}>
      {open && <div className="trick-menu" role="group" aria-label="Character reactions"><div><strong>A little personality.</strong><button type="button" onClick={() => setOpen(false)} aria-label="Close character controls"><X size={17}/></button></div>{([['wave','Say hello'],['dance','Happy dance'],['think','Think it through'],['glitch','Break the matrix'],['fly','Ship it!'],['nod','Good point'],['surprise','Surprise me']] as const).map(([value,label]) => <button type="button" key={value} onClick={() => play(value)}>{label}<span>↗</span></button>)}<a href="/avatar/sufiyan-guide.png" download="sufiyan-monochrome-emoji.png">Keep my avatar <Download size={15}/></a></div>}
      <button type="button" id={standalone ? "lab-tricks" : "story-tricks"} className="trick-toggle" onClick={() => { setHidden(false); setOpen(!open); }} aria-expanded={open}><Sparkles size={15}/><span>Do a trick</span></button>
      {!standalone && <button type="button" className="guide-visibility sound-toggle" onClick={() => setHidden(!hidden)} aria-label={hidden ? "Show character" : "Hide character"} aria-pressed={hidden}>{hidden ? <Eye size={17}/> : <EyeOff size={17}/>}</button>}
      <button type="button" className="sound-toggle" onClick={() => { setSound(!sound); if (!sound) chime(); }} aria-label={sound ? "Mute character sounds" : "Enable character sounds"} aria-pressed={sound}>{sound ? <Volume2 size={18}/> : <VolumeX size={18}/>}</button>
    </div>
  </>;
}
