"use client";
import {useRef,type CSSProperties} from "react";
import {motion,useReducedMotion,useTransform,type MotionValue} from "framer-motion";
import {ScrollThread,ScrollReveal,useThreadProgress,InkPath} from "@/components/editorial-motion";

const capabilities=[
 {angle:40,left:["Web experiences","Clear journeys that help customers choose."],right:["Business systems","The team, the records and the next action."]},
 {angle:75,left:["Commerce","From the first product view to fulfilment."],right:["Practical AI","Useful intelligence inside a real workflow."]},
 {angle:105,left:["Interface design","Make the complex feel simple to use."],right:["Full-stack builds","Connect the interface to the logic behind it."]},
 {angle:140,left:["Prototyping","Make the idea tangible. Test what matters."],right:["Automation","Keep repeated work moving in the background."]},
];
// The SVG and the HTML labels use exactly the same ellipse, including on mobile.
const geometry=(mobile:boolean)=>({rx:mobile?120:245,ry:mobile?570:340,cy:mobile?630:400,height:mobile?1400:840});
function point(angle:number,side:number,mobile=false){const g=geometry(mobile),r=angle*Math.PI/180;return {x:500+side*g.rx*Math.sin(r),y:g.cy-g.ry*Math.cos(r)}}
// SVG reveals by arc length, so node activation must use distance, not angle.
function arcFraction(angle:number,mobile:boolean){
 const g=geometry(mobile);let total=0,reached=0;
 for(let n=0;n<580;n++){
  const a=(n+.5)*145/580*Math.PI/180;
  const distance=Math.hypot(g.rx*Math.cos(a),g.ry*Math.sin(a));
  total+=distance;if((n+.5)*145/580<=angle)reached+=distance;
 }
 return reached/total;
}
function Branch({side,progress,mobile,reduced}:{side:number;progress:MotionValue<number>;mobile:boolean;reduced:boolean|null}){
 const g=geometry(mobile),end=point(145,side,mobile);
 const stem=useTransform(progress,[0,.06],[0,1]);
 const branch=useTransform(progress,[.06,.84],[0,1]);
 const tail=useTransform(progress,[.84,1],[0,1]);
 return <>
  <InkPath d="M500 0V60" progress={stem} reduced={reduced}/>
  <InkPath d={`M500 60A${g.rx} ${g.ry} 0 0 ${side===1?1:0} ${end.x} ${end.y}`} progress={branch} reduced={reduced}/>
  {side===-1&&<InkPath d={`M${end.x} ${end.y}C${end.x} ${g.height-70} 97.222 ${g.height-110} 97.222 ${g.height}`} progress={tail} reduced={reduced}/>}
 </>;
}
function CapabilityPoint({item,side,progress,reduced}:{item:typeof capabilities[number];side:-1|1;progress:MotionValue<number>;reduced:boolean|null}){
 const desktop=point(item.angle,side),mobile=point(item.angle,side,true);
 const [title,description]=side===-1?item.left:item.right;
 const desktopThreshold=.06+arcFraction(item.angle,false)*.78;
 const mobileThreshold=.06+arcFraction(item.angle,true)*.78;
 const desktopFill=useTransform(progress,value=>value>=desktopThreshold?"var(--ed-accent)":"var(--brand-bg)");
 const mobileFill=useTransform(progress,value=>value>=mobileThreshold?"var(--ed-accent)":"var(--brand-bg)");
 const style={"--node-x":`${desktop.x/10}%`,"--node-y":`${desktop.y/840*100}%`,"--mobile-x":`${mobile.x/10}%`,"--mobile-y":`${mobile.y/1400*100}%`} as CSSProperties;
 return <div className={`capability-point ${side===-1?"point-left":"point-right"} point-row-${item.angle}`} style={style}>
  <motion.i aria-hidden="true" style={{"--node-fill":reduced?"var(--ed-accent)":desktopFill,"--mobile-node-fill":reduced?"var(--ed-accent)":mobileFill} as unknown as CSSProperties}/>
  <div><h3>{title}</h3><p>{description}</p></div>
 </div>;
}
export function Capabilities(){
 const ref=useRef<HTMLDivElement>(null),reduced=useReducedMotion();
 const scrollYProgress=useThreadProgress(ref);
 return <section className="editorial-capabilities" id="capabilities" aria-labelledby="capabilities-title">
  <div className="capabilities-lead">
   <ScrollThread viewBox="0 0 1440 680" paths={["M720 0C720 65 1380 15 1380 90V480Q1380 520 1340 520H100Q60 520 60 555T100 590H680Q720 590 720 630V680"]}/>
   <ScrollReveal><p className="editorial-eyebrow">DESIGN / DEVELOPMENT / THE CONNECTIONS BETWEEN</p><h2 id="capabilities-title">I DESIGN THE EXPERIENCE.<br/>AND THE INTELLIGENCE<br/><span>BEHIND IT.</span></h2></ScrollReveal>
  </div>
  <div ref={ref} className="capability-diagram">
   <div className="capability-categories"><span>WHAT PEOPLE EXPERIENCE</span><span>WHAT MAKES IT WORK</span></div>
   {[false,true].map(mobile=><svg key={String(mobile)} className={`capability-lines ${mobile?"mobile-orbit":"desktop-orbit"}`} viewBox={`0 0 1000 ${geometry(mobile).height}`} preserveAspectRatio="none" fill="none" aria-hidden="true">{[-1,1].map(side=><Branch key={side} side={side} mobile={mobile} progress={scrollYProgress} reduced={reduced}/>)}</svg>)}
   {capabilities.map(item=>[-1,1].map(side=><CapabilityPoint key={`${item.angle}-${side}`} item={item} side={side as -1|1} progress={scrollYProgress} reduced={reduced}/>))}
  </div>
 </section>;
}
