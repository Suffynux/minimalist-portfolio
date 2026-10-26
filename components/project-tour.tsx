"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Layers, MousePointer2 } from "lucide-react";
import { tourProjects, tourStops, type TourCue } from "@/lib/project-tour";

export function ProjectTour({onCue,onNavigateReady}:{onCue:(cue:TourCue)=>void;onNavigateReady:(navigate:(index:number)=>void)=>void}) {
  const section=useRef<HTMLElement>(null);
  const stage=useRef<HTMLDivElement>(null);
  const [index,setIndex]=useState(0);
  const stop=tourStops[index];
  const navigate=useCallback((next:number)=>{
    const el=section.current,sticky=stage.current;if(!el||!sticky)return;
    const bounded=Math.max(0,Math.min(tourStops.length-1,next));
    const distance=Math.max(1,el.offsetHeight-sticky.offsetHeight);
    // Scroll and controls use exactly the same coordinate system, in both directions.
    window.scrollTo({top:el.getBoundingClientRect().top+scrollY+distance*((bounded+.15)/tourStops.length),behavior:"instant"});
    setIndex(bounded);
  },[]);
  useEffect(()=>{onNavigateReady(navigate);},[navigate,onNavigateReady]);
  useEffect(()=>{
    let frame=0;
    const read=()=>{
      frame=0;const el=section.current,sticky=stage.current;if(!el||!sticky)return;
      const progress=Math.max(0,-el.getBoundingClientRect().top)/Math.max(1,el.offsetHeight-sticky.offsetHeight);
      setIndex(Math.max(0,Math.min(tourStops.length-1,Math.floor(progress*tourStops.length))));
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(read)};
    const resize=new ResizeObserver(schedule);if(section.current)resize.observe(section.current);if(stage.current)resize.observe(stage.current);
    read();window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);
    return()=>{cancelAnimationFrame(frame);resize.disconnect();window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule)};
  },[]);
  useEffect(()=>{onCue({index,projectIndex:stop.projectIndex,stepIndex:stop.stepIndex,projectName:stop.project.name,text:stop.step.text,title:stop.step.label,total:tourStops.length});},[index,stop,onCue]);
  const {project,projectIndex,step,stepIndex}=stop;
  const first=tourStops.findIndex(item=>item.projectIndex===projectIndex);
  return <section ref={section} id="work" className={`project-tour story-scene tour-${project.slug}`} style={{minHeight:`${(tourStops.length*.55+1)*100}svh`}} aria-labelledby="tour-title">
    <div ref={stage} className="project-tour-stage" tabIndex={0} aria-label="Project tour. Use left and right arrow keys to explore." onKeyDown={event=>{if(event.target!==event.currentTarget)return;if(event.key==="ArrowRight"||event.key==="ArrowLeft"){event.preventDefault();navigate(index+(event.key==="ArrowRight"?1:-1))}}}>
      <div className="story-content tour-content">
        <div className="tour-topline"><span className="story-kicker">THE GUIDED TOUR / {String(projectIndex+1).padStart(2,"0")} OF {tourProjects.length}</span><span className="tour-scroll-hint"><MousePointer2 size={12}/> Scroll or choose below</span></div>
        <nav className="tour-project-picker" aria-label="Choose a project">{tourProjects.map((item,i)=><button type="button" key={item.slug} aria-pressed={projectIndex===i} onClick={()=>navigate(tourStops.findIndex(stop=>stop.projectIndex===i))}>{item.name}</button>)}</nav>
        <div className="tour-heading"><h2 id="tour-title">{project.name}</h2><Link href={`/projects/${project.slug}`} className="story-pill">Explore project <ArrowUpRight size={16}/></Link></div>
        <div className="tour-display" key={`${project.slug}-${stepIndex}`}>
          {step.image?<div className="story-browser"><div className="browser-chrome"><span aria-hidden="true">● ● ●</span><span>{new URL(project.live).hostname}</span><Layers size={13}/></div><div className="tour-screenshot"><Image src={step.image} alt={`${project.name}: ${step.title}`} width={1440} height={1000} sizes="(max-width:760px) 92vw, 58vw" priority={index===0}/></div></div>:<div className={`tour-project-board board-${project.slug}`}><div className="tour-board-label"><span>{project.kind}</span><span>PROJECT OVERVIEW</span></div><div className="tour-wordmark">{project.name==="Deeniverse"?"d.":project.name==="Gomila Intersole"?"Gomila":project.name==="AI Chat Agent"?"Hello, intelligence.":project.name}</div><div className="tour-board-details">{(stepIndex===2?project.stack:[project.meta,step.title]).map(text=><span key={text}><Check size={13}/>{text}</span>)}</div></div>}
          <div className="tour-step-copy"><p className="story-kicker">0{stepIndex+1} / {step.label}</p><h3>{step.title}</h3></div>
        </div>
        <div className="tour-controls"><button className="tour-arrow" type="button" aria-label="Previous tour step" disabled={index===0} onClick={()=>navigate(index-1)}><ArrowLeft size={19}/></button><div className="tour-step-buttons" role="group" aria-label={`${project.name} tour steps`}>{project.steps.map((item,i)=><button type="button" key={item.label} aria-pressed={i===stepIndex} onClick={()=>navigate(first+i)}><span>0{i+1}</span>{item.label}</button>)}</div><button className="tour-arrow" type="button" aria-label="Next tour step" disabled={index===tourStops.length-1} onClick={()=>navigate(index+1)}><ArrowRight size={19}/></button></div>
        <div className="tour-position"><span style={{width:`${((index+1)/tourStops.length)*100}%`}}/></div>
      </div>
    </div>
  </section>;
}
