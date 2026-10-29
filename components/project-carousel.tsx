"use client";
import {useEffect,useRef,useState,type KeyboardEvent} from "react";
import Link from "next/link";
import Image from "next/image";
import {ArrowLeft,ArrowRight,ArrowUpRight} from "lucide-react";
import {journeyProjects,journeyFor} from "@/lib/project-journey";
import {projectSlug} from "@/lib/portfolio-content";
import {TechnologyBadges} from "@/components/technology-badges";
import {ScreenshotPreview} from "@/components/screenshot-preview";
export function ProjectCarousel(){
 const [selected,setSelected]=useState(0);const [chapter,setChapter]=useState(0);const touch=useRef<{x:number;y:number}|null>(null);
 useEffect(()=>{const slug=new URLSearchParams(location.search).get("project");const i=journeyProjects.findIndex(p=>projectSlug(p.name)===slug);if(i>=0)setSelected(i)},[]);
 const {project,slug,story,steps}=journeyFor(journeyProjects[selected].name);const last=steps.length+1;const end=chapter===last;const step=chapter>0&&!end?steps[chapter-1]:null;const next=journeyProjects[(selected+1)%journeyProjects.length];
 function choose(i:number){const index=(i+journeyProjects.length)%journeyProjects.length;setSelected(index);setChapter(0);const url=new URL(location.href);url.searchParams.set("project",projectSlug(journeyProjects[index].name));url.hash="work";history.replaceState(null,"",url);}
 function forward(){if(end)choose(selected+1);else setChapter(chapter+1)}
 function keyboard(e:KeyboardEvent<HTMLElement>){if(e.target!==e.currentTarget)return;if(e.key==="ArrowRight"){e.preventDefault();forward()}if(e.key==="ArrowLeft"){e.preventDefault();setChapter(Math.max(0,chapter-1))}}
 return <section id="work" className="project-gallery client-width" aria-labelledby="work-title" aria-roledescription="carousel" tabIndex={0} onKeyDown={keyboard}>
 <div className="gallery-intro"><p className="client-kicker">01 / THE PROJECT COLLECTION</p><p>One project. The whole story.<br/><span>Explore at your own pace.</span></p></div>
 <div className="gallery-project-bar"><div className="gallery-count"><span>{String(selected+1).padStart(2,"0")}</span> / {String(journeyProjects.length).padStart(2,"0")}</div><label className="gallery-select">Choose a project<select aria-label="Choose a project" value={selected} onChange={e=>choose(Number(e.target.value))}>{journeyProjects.map((p,i)=><option value={i} key={p.name}>{String(i+1).padStart(2,"0")} — {p.name}</option>)}</select></label><div className="gallery-arrows"><button aria-label="Previous project" onClick={()=>choose(selected-1)}><ArrowLeft size={19}/></button><button aria-label="Next project" onClick={()=>choose(selected+1)}><ArrowRight size={19}/></button></div></div>
 <div className="gallery-title"><h2 id="work-title">{project.name}</h2><p>{project.kind}<span>{project.status}</span></p></div>
 <nav className="gallery-chapters" aria-label="Case study chapters">{["The story",...steps.map(s=>s.title),"What’s next"].map((label,i)=><button key={label} aria-current={chapter===i?"step":undefined} aria-controls="project-reader-panel" onClick={()=>setChapter(i)}><span>{String(i+1).padStart(2,"0")}</span>{label}</button>)}</nav>
 <div className="gallery-reader" id="project-reader-panel" onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}}} onTouchEnd={e=>{if(touch.current===null)return;const delta=e.changedTouches[0].clientX-touch.current.x;const vertical=e.changedTouches[0].clientY-touch.current.y;touch.current=null;if(Math.abs(delta)>75&&Math.abs(delta)>Math.abs(vertical)*1.5){if(delta<0)forward();else setChapter(Math.max(0,chapter-1))}}}>
 <div key={`${slug}-${chapter}`} className={`gallery-scene ${end?"gallery-ending":""}`}>
 <div className="gallery-copy"><p className="client-kicker">{end?"THE VALUE OF THE BUILD":step?"INSIDE THE SYSTEM":"THE CHALLENGE & THE BUILD"}</p><h3>{end?"A useful system. A clearer next step.":step?step.title:project.meta}</h3>{end?<p>{story.value}</p>:step?<><p>{step.description}</p><ol>{step.flow.map(s=><li key={s}>{s}</li>)}</ol></>:<><span className="gallery-copy-label">THE PROBLEM</span><p>{story.problem}</p><span className="gallery-copy-label">WHAT I BUILT</span><p>{story.solution}</p></>}{end?<button className="gallery-next-invitation" onClick={()=>choose(selected+1)}><span>CONTINUE THE COLLECTION</span><strong>{next.name} <ArrowUpRight size={25}/></strong></button>:<Link className="client-text-link" href={`/projects/${slug}`}>Open full case study <ArrowUpRight size={16}/></Link>}<TechnologyBadges stack={project.stack}/></div>
 <figure className="gallery-screen" style={{"--project-tint":["#dce2cb","#dbe3e8","#e9ddd0","#e2dae2","#e5dfd3"][selected%5]} as React.CSSProperties}><div className="gallery-screen-bar"><span><i/><i/><i/></span><span>{end?`UP NEXT / ${next.name}`:step?step.title:project.name}</span></div>{end?<button className="gallery-next-image" aria-label={`Continue to ${next.name}`} onClick={()=>choose(selected+1)}><Image src={next.img} alt={`${next.name} preview`} width={1440} height={1000} sizes="(max-width:800px) 90vw, 60vw"/></button>:<ScreenshotPreview src={step?.image??project.img} alt={`${project.name} — ${step?.title??"project overview"}`}/>}<figcaption>{end?"A different business. Another problem solved.":step?.note??"Actual project interface. Open the case study for the complete walkthrough."}</figcaption></figure>
 </div></div>
 <div className="gallery-bottom"><p aria-live="polite" aria-atomic="true">{project.name} <span>— Chapter {chapter+1} of {last+1}</span></p><div><button disabled={chapter===0} onClick={()=>setChapter(chapter-1)} aria-label="Previous chapter"><ArrowLeft size={17}/><span>Back</span></button><button className="gallery-continue" onClick={forward}>{end?`Next: ${next.name}`:chapter===last-1?"Finish this story":"Continue the story"}<ArrowRight size={18}/></button></div></div>
 <div className="gallery-progress" aria-hidden="true"><span style={{width:`${((chapter+1)/(last+1))*100}%`}}/></div>
 <div className="gallery-footer"><p>Looking for something specific? Every project is in the selector above.</p><Link href="/projects">View project index <ArrowUpRight size={15}/></Link></div>
 </section>;
}
