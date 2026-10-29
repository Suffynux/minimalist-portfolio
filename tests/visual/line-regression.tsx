"use client";
// Browser regression fixture: temporarily re-export this component from a local
// app/line-check/page.tsx, then use Run regression tests. Keep it off public routes.
import {useRef,useState} from "react";
import {motion,useMotionValue} from "framer-motion";
import {InkPath} from "@/components/editorial-motion";
const hero="M80 30C80 130 280 125 240 220S50 220 25 330S600 320 820 430S1220 460 1110 570S720 675 720 800";
const arc="M500 60A245 340 0 0 1 640.526227 678.511695";
const screens=[[320,844],[390,844],[768,1024],[1440,1000],[1920,1200],[2560,1440]];
const frame=()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
type Result={renderer:string;shape:string;width:number;height:number;progress:number;reduced:boolean;errors:string[]};
export default function LineCheck(){
 const root=useRef<HTMLDivElement>(null),progress=useMotionValue(0);
 const [running,setRunning]=useState(false),[results,setResults]=useState<Result[]>([]),[reduced,setReduced]=useState(false);
 async function run(){
  setRunning(true);setResults([]);const collected:Result[]=[];
  try{
   for(const mode of [false,true]){
    setReduced(mode);await frame();
    for(const p of mode?[.3]:[0,.15,.3,.6,1,.3,0]){
     progress.set(p);await frame();
     for(const svg of Array.from(root.current!.querySelectorAll<SVGSVGElement>("svg[data-renderer]"))){
      const path=svg.querySelector<SVGPathElement>("[data-thread-ink],path[data-legacy]")!,length=path.getTotalLength();
      for(const [width,height] of screens){
       const clone=svg.cloneNode(true) as SVGSVGElement;
       clone.setAttribute("width",String(width));clone.setAttribute("height",String(height));clone.removeAttribute("style");
       const blob=new Blob([new XMLSerializer().serializeToString(clone)],{type:"image/svg+xml"}),url=URL.createObjectURL(blob);
       const img=new Image();img.src=url;await img.decode();
       const canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
       const context=canvas.getContext("2d",{willReadFrequently:true})!;context.drawImage(img,0,0);URL.revokeObjectURL(url);
       const vb=svg.viewBox.baseVal,errors:string[]=[];
       for(const fraction of [.05,.1,.2,.4,.5,.7,.85,.95]){
        if(!mode&&Math.abs(fraction-p)<.025)continue;
        const point=path.getPointAtLength(fraction*length),x=Math.round(point.x*width/vb.width),y=Math.round(point.y*height/vb.height);
        const pixels=context.getImageData(Math.max(0,x-2),Math.max(0,y-2),5,5).data;
        let ink=false;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>45)ink=true;
        const expected=mode||fraction<p;if(ink!==expected)errors.push(`${fraction}: expected ${expected?"ink":"clear"}, saw ${ink?"ink":"clear"}`);
       }
       collected.push({renderer:svg.dataset.renderer!,shape:svg.dataset.shape!,width,height,progress:p,reduced:mode,errors});
      }
     }
    }
   }
   setResults(collected);
  }catch(error){setResults([{renderer:"test error",shape:String(error),width:0,height:0,progress:0,reduced:false,errors:[String(error)]}])}
  setRunning(false);
 }
 const fixed=results.filter(r=>r.renderer==="fixed"),legacy=results.filter(r=>r.renderer==="legacy");
 return <main style={{background:"#111",color:"#eee",padding:32,minHeight:"100vh",fontFamily:"monospace"}}>
 <h1>SVG line rendering regression</h1><p>Actual production InkPath vs the previous renderer. Pixel checks sample the visible prefix and hidden suffix at six viewport sizes, forward/reverse progress, zero, full and reduced motion.</p>
 <button onClick={run} disabled={running} style={{border:"1px solid",padding:12,margin:"24px 0"}}>{running?"Testing rendered pixels…":"Run regression tests"}</button>
 <p id="test-summary">{results.length?`Fixed: ${fixed.filter(r=>!r.errors.length).length}/${fixed.length} pass. Previous renderer: ${legacy.filter(r=>r.errors.length).length}/${legacy.length} fail.`:"Ready"}</p>
 <details><summary>Detailed results</summary><pre id="test-results" style={{whiteSpace:"pre-wrap"}}>{JSON.stringify(results,null,2)}</pre></details>
 <div ref={root} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
 {[{name:"hero",d:hero,viewBox:"0 0 1440 800"},{name:"arch",d:arc,viewBox:"0 0 1000 840"}].map(shape=>["legacy","fixed"].map(renderer=><figure key={`${shape.name}-${renderer}`}><figcaption>{shape.name} / {renderer}</figcaption><svg data-renderer={renderer} data-shape={shape.name} viewBox={shape.viewBox} width="480" height="320" preserveAspectRatio="none" fill="none" stroke="#f34b24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{renderer==="fixed"?<InkPath d={shape.d} progress={progress} reduced={reduced}/>:<motion.path data-legacy d={shape.d} style={{pathLength:reduced?1:progress}} vectorEffect="non-scaling-stroke"/>}</svg></figure>))}
 </div></main>;
}
