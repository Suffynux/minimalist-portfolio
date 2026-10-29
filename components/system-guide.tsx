"use client";
import {useState} from "react";
import {ScreenshotPreview} from "@/components/screenshot-preview";
import {systemGuides} from "@/lib/system-guides";
export function SystemGuide({slug}:{slug:string}) {
 const [index,setIndex]=useState(0); const guide=systemGuides[slug]; if(!guide)return null; const step=guide.steps[index];
 return <section className="system-guide" id="walkthrough" aria-label="System walkthrough"><p className="client-kicker">INSIDE THE BUILD / INTERACTIVE GUIDE</p><h2>{guide.title}</h2><p className="system-intro">{guide.intro}</p><div className="system-selector" aria-label="Choose a workflow">{guide.steps.map((s,i)=><button key={s.title} aria-pressed={index===i} aria-controls={`${slug}-step`} onClick={()=>setIndex(i)}><span>{String(i+1).padStart(2,"0")}</span>{s.title}</button>)}</div><div id={`${slug}-step`} className="system-step"><div className="system-step-copy"><p className="client-kicker">{String(index+1).padStart(2,"0")} / {String(guide.steps.length).padStart(2,"0")}</p><h3>{step.title}</h3><p>{step.description}</p><ol>{step.flow.map(s=><li key={s}>{s}</li>)}</ol></div><figure><ScreenshotPreview src={step.image} alt={`${slug}: ${step.title}`} /><figcaption>{step.note}</figcaption></figure></div></section>;
}
