"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Layers } from "lucide-react";
import { tourProjects, tourStops, type TourCue } from "@/lib/project-tour";
import { scrollToY } from "@/lib/smooth-scroll";

const STEPS_PER_PROJECT = 3;

function measure() {
  const el = document.getElementById("work"), stage = el?.querySelector<HTMLElement>(".project-tour-stage");
  if (!el || !stage) return null;
  return { top: el.getBoundingClientRect().top + scrollY, distance: Math.max(1, el.offsetHeight - stage.offsetHeight) };
}
const stopY = (m: { top: number; distance: number }, index: number) => m.top + m.distance * ((index + .5) / tourStops.length);

/** Resting positions for each tour step, used by the chapter snapping. */
export function tourSnapPoints() {
  const m = measure();
  return m ? tourStops.map((_, i) => stopY(m, i)) : [];
}

const hex = (value: string) => [1, 3, 5].map(i => parseInt(value.slice(i, i + 2), 16));
function mix(a: string, b: string, t: number) {
  const [x, y] = [hex(a), hex(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",")})`;
}
const smooth = (t: number) => t * t * (3 - 2 * t);

export function ProjectTour({onCue,onNavigateReady}:{onCue:(cue:TourCue)=>void;onNavigateReady:(navigate:(index:number)=>void)=>void}) {
  const section=useRef<HTMLElement>(null);
  const bars=useRef<(HTMLSpanElement|null)[]>([]);
  const target=useRef<number|null>(null);
  const [index,setIndex]=useState(0);
  const stop=tourStops[index];

  const navigate=useCallback((next:number)=>{
    const m=measure();if(!m)return;
    const bounded=Math.max(0,Math.min(tourStops.length-1,next));
    // Hold the chosen step while the page glides there, so the narration doesn't flicker through every stop on the way.
    target.current=bounded;setIndex(bounded);
    window.setTimeout(()=>{if(target.current===bounded)target.current=null;},1600);
    scrollToY(stopY(m,bounded));
  },[]);
  useEffect(()=>{onNavigateReady(navigate);},[navigate,onNavigateReady]);

  useEffect(()=>{
    let frame=0;
    const read=()=>{
      frame=0;const el=section.current,m=measure();if(!el||!m)return;
      const x=Math.max(0,Math.min(1,(scrollY-m.top)/m.distance))*tourStops.length;
      const current=Math.min(tourStops.length-1,Math.floor(x));
      if(target.current===null||target.current===current){target.current=null;setIndex(current);}
      // The background blends across the boundary between projects instead of switching.
      let color=mix(tourProjects[0].tint,tourProjects[0].tint,0);
      for(let k=1;k<tourProjects.length;k++){
        const t=smooth(Math.max(0,Math.min(1,(x-(k*STEPS_PER_PROJECT-.45))/.75)));
        if(t>0)color=mix(tourProjects[k-1].tint,tourProjects[k].tint,t);
      }
      el.style.backgroundColor=color;
      bars.current.forEach((bar,i)=>{if(bar)bar.style.transform=`scaleX(${Math.max(0,Math.min(1,(x-i*STEPS_PER_PROJECT)/STEPS_PER_PROJECT))})`;});
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(read)};
    const resize=new ResizeObserver(schedule);if(section.current)resize.observe(section.current);
    read();window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);
    return()=>{cancelAnimationFrame(frame);resize.disconnect();window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule)};
  },[]);
  useEffect(()=>{onCue({index,projectIndex:stop.projectIndex,stepIndex:stop.stepIndex,projectName:stop.project.name,text:stop.step.text,title:stop.step.label,total:tourStops.length});},[index,stop,onCue]);

  const {project,projectIndex,step,stepIndex}=stop;
  return <section ref={section} id="work" className="project-tour story-scene" style={{minHeight:`${(tourStops.length*.55+1)*100}svh`,backgroundColor:tourProjects[0].tint}} aria-labelledby="tour-title">
    <div className="project-tour-stage" tabIndex={0} aria-label="Project tour. Use the left and right arrow keys to move between steps." onKeyDown={event=>{if(event.target!==event.currentTarget)return;if(event.key==="ArrowRight"||event.key==="ArrowLeft"){event.preventDefault();navigate(index+(event.key==="ArrowRight"?1:-1))}}}>
      <div className="story-content tour-content">
        <nav className="tour-progress" aria-label="Projects in the tour">{tourProjects.map((item,i)=><button type="button" key={item.slug} aria-current={projectIndex===i?"step":undefined} onClick={()=>navigate(i*STEPS_PER_PROJECT)}><span className="tour-bar"><span ref={el=>{bars.current[i]=el;}}/></span><span className="tour-bar-label">{String(i+1).padStart(2,"0")} {item.name}</span></button>)}</nav>
        <div className="tour-heading"><h2 id="tour-title" key={project.slug}><span className="title-mask"><span>{project.name}</span></span></h2><Link href={`/projects/${project.slug}`} className="story-pill">View project <ArrowUpRight size={16}/></Link></div>
        <div className="tour-media">
          {tourStops.map((item,i)=><div key={`${item.project.slug}-${item.stepIndex}`} className={`tour-media-item${i===index?" is-active":""}${i<index?" is-past":""}`} aria-hidden={i!==index}>
            {item.step.image?<div className="story-browser"><div className="browser-chrome"><span aria-hidden="true">● ● ●</span><span>{new URL(item.project.live).hostname}</span><Layers size={13}/></div><div className="tour-screenshot"><Image src={item.step.image} alt={`${item.project.name}: ${item.step.title}`} width={1440} height={1000} sizes="(max-width:760px) 92vw, 58vw" priority={i===0}/></div></div>
            :<div className={`tour-project-board board-${item.project.slug}`}><div className="tour-board-label"><span>{item.project.kind}</span><span>{item.step.label}</span></div><div className="tour-wordmark">{item.project.name==="Deeniverse"?"d.":item.project.name==="Gomila Intersole"?"Gomila":item.project.name==="AI Chat Agent"?"Hello, intelligence.":item.project.name}</div><div className="tour-board-details">{(item.stepIndex===2?item.project.stack:[item.project.meta]).map(text=><span key={text}><Check size={13}/>{text}</span>)}</div></div>}
          </div>)}
        </div>
        <div className="tour-step-copy" key={index}><p className="story-kicker">{String(stepIndex+1).padStart(2,"0")} / {step.label}</p><h3>{step.title}</h3></div>
      </div>
    </div>
  </section>;
}
