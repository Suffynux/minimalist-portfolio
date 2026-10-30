"use client";
import {useEffect,useRef,useState,useId,type ReactNode,type RefObject} from "react";
import {motion,useReducedMotion,useScroll,useTransform,useMotionValue,type MotionValue} from "framer-motion";
import {startSmoothScroll} from "@/lib/smooth-scroll";

/** One scroll driver, shared by the homepage and each case study. Touch remains native. */
export function EditorialMotion(){
 useEffect(()=>startSmoothScroll(),[]);
 return <div className="viewport-soft-edge" aria-hidden="true">{[1,2,3,4,5].map(n=><i key={n}/>)}</div>;
}
/** One uninterrupted HTML stroke across every section, independent of SVG sizing. */
export function PageReadingLine(){
 const {scrollYProgress}=useScroll();
 const tip=useTransform(scrollYProgress,value=>`clamp(3px, ${value*100}%, calc(100% - 3px))`);
 return <div className="page-reading-line" aria-hidden="true"><motion.div className="page-reading-ink" style={{scaleY:scrollYProgress}}/><motion.span className="page-reading-dot" style={{top:tip}}/></div>;
}
function DrawnPath({d,progress,index,count,reduced}:{d:string;progress:MotionValue<number>;index:number;count:number;reduced:boolean|null}){
 const amount=useTransform(progress,[index/count,(index+1)/count],[0,1]);
 return <InkPath d={d} progress={amount} reduced={reduced}/>;
}
/** Keep dash calibration in SVG coordinates. Only the visible solid stroke uses
 * non-scaling-stroke; combining it with normalized dashes produces gaps/repeats
 * when the viewBox is stretched. The mask reveals one continuous prefix. */
export function InkPath({d,progress,reduced=false}:{d:string;progress:MotionValue<number>;reduced?:boolean|null}){
 const pathRef=useRef<SVGPathElement>(null);
 const length=useMotionValue(0);
 useEffect(()=>{length.set(pathRef.current?.getTotalLength()??0)},[d,length]);
 const tip=useTransform(()=>{const distance=length.get()*Math.max(0,Math.min(1,progress.get()));return pathRef.current?.getPointAtLength(distance)??{x:0,y:0}});
 const cx=useTransform(tip,p=>p.x),cy=useTransform(tip,p=>p.y);
 const tipOpacity=useTransform(progress,p=>p>0&&p<1?1:0);
 const id=`ink-${useId().replace(/:/g,"")}`;
 const offset=useTransform(progress,value=>1-Math.max(0,Math.min(1,value)));
 const visible=useTransform(progress,value=>value>0?1:0);
 return <>
  <defs><mask id={id} maskUnits="userSpaceOnUse" x="-10%" y="-10%" width="120%" height="120%" style={{maskType:"alpha"}}>
   <motion.path data-thread-mask d={d} pathLength={1} style={{fill:"none",stroke:"white",strokeWidth:24,strokeLinecap:"butt",strokeLinejoin:"round",strokeDasharray:"1 1",strokeDashoffset:reduced?0:offset,opacity:reduced?1:visible}}/>
  </mask></defs>
  <path ref={pathRef} data-thread-ink d={d} mask={`url(#${id})`} vectorEffect="non-scaling-stroke"/>
  {!reduced&&<motion.circle cx={cx} cy={cy} r={.01} style={{opacity:tipOpacity}} fill="none" stroke="var(--ed-accent)" strokeWidth={5} strokeLinecap="round" vectorEffect="non-scaling-stroke"/>}
 </>;
}
/** A shared drawing horizon starts at the page top, then settles halfway down the viewport.
 * It depends only on actual scroll distance: no entrance tween, timer or extra spring.
 * Every section uses this same horizon so connected paths meet without a head start. */
export function useThreadProgress(ref:RefObject<HTMLElement|null>){
 const {scrollY}=useScroll();
 const layout=useMotionValue({top:Infinity,height:1,viewport:0});
 useEffect(()=>{
  const element=ref.current;if(!element)return;
  const measure=()=>{const rect=element.getBoundingClientRect();layout.set({top:rect.top+window.scrollY,height:Math.max(1,rect.height),viewport:window.innerHeight})};
  measure();
  const observer=new ResizeObserver(measure);
  observer.observe(element);observer.observe(document.body);
  window.addEventListener("resize",measure);
  return()=>{observer.disconnect();window.removeEventListener("resize",measure)};
 },[ref,layout]);
 return useTransform(()=>{
  const y=Math.max(0,scrollY.get()),{top,height,viewport}=layout.get();
  const horizon=y+Math.min(y*.5,viewport*.5);
  return Math.max(0,Math.min(1,(horizon-top)/height));
 });
}
/** No pre-drawn track: each connected segment is revealed by document scroll, in either direction. */
export function ScrollThread({paths,viewBox="0 0 1440 800",hero=false,className=""}:{paths:string[];viewBox?:string;hero?:boolean;className?:string}){
 const ref=useRef<HTMLDivElement>(null);const reduced=useReducedMotion();
 const scrollYProgress=useThreadProgress(ref);
 return <div ref={ref} className={`scroll-thread-layer ${className}`} aria-hidden="true"><svg viewBox={viewBox} preserveAspectRatio="none">{paths.map((d,i)=><DrawnPath key={d} d={d} progress={scrollYProgress} index={i} count={paths.length} reduced={reduced}/>)}</svg></div>;
}
export function ScrollReveal({children,className=""}:{children:ReactNode;className?:string}){
 const reduced=useReducedMotion();
 return <motion.div className={className} initial={reduced?false:{opacity:0,y:36,filter:"blur(6px)"}} whileInView={{opacity:1,y:0,filter:"blur(0px)"}} viewport={{once:true,amount:.12}} transition={{duration:.8,ease:[.16,1,.3,1]}}>{children}</motion.div>;
}

// Once per document load; returning from a case study does not replay the entrance.
let signatureHasPlayed = false;
export function SignatureIntro(){
 const [visible,setVisible]=useState(()=>!signatureHasPlayed);
 useEffect(()=>{
  signatureHasPlayed=true;
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.location.hash){setVisible(false);return;}
  const dismiss=()=>setVisible(false);
  const timer=window.setTimeout(dismiss,4600);
  window.addEventListener("keydown",dismiss,{once:true});
  window.addEventListener("wheel",dismiss,{once:true,passive:true});
  window.addEventListener("touchstart",dismiss,{once:true,passive:true});
  return()=>{window.clearTimeout(timer);window.removeEventListener("keydown",dismiss);window.removeEventListener("wheel",dismiss);window.removeEventListener("touchstart",dismiss)};
 },[]);
 if(!visible)return null;
 return <div className="signature-intro" aria-label="Opening Suffynux’s portfolio">
  <div className="signature-mark">
   <svg viewBox="0 0 580 230" role="img" aria-label="Suffynux, handwritten">
    <g fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
     <path className="signature-ink" pathLength="1" d="M151 65C173 32 120 34 89 65S79 103 112 108S155 136 121 151S57 152 69 131C81 110 124 100 157 105M163 105C143 139 147 150 161 137L188 104C174 136 174 148 191 136L209 116C231 93 253 49 241 46C221 40 206 103 198 141S177 202 172 182C168 164 201 128 232 119M203 106L246 101M238 129C272 97 299 46 286 44C266 38 251 103 243 141S222 202 217 182C213 164 246 128 277 119M248 106L291 101M294 110C278 137 284 149 299 131L314 105C304 144 286 190 272 185C258 177 295 153 335 131L350 105L338 139C358 107 377 101 373 116S358 145 379 134L394 108C377 138 381 149 397 133L417 107C402 137 406 147 422 132M431 112C442 106 451 126 460 135S477 140 495 120M465 106C454 120 441 134 428 144"/>
     <path className="signature-flourish" pathLength="1" d="M100 173C224 151 373 147 506 150L441 161"/>
    </g>
   </svg>
   <p>SUFFYNUX <span>DESIGN + CODE</span></p>
  </div>
  <button type="button" onClick={()=>setVisible(false)}>SKIP INTRO ↗</button>
 </div>;
}
