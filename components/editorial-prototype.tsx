"use client";

import {useRef,useState,type RefObject} from "react";
import Link from "next/link";
import Image from "next/image";
import {motion,useReducedMotion,useScroll,useMotionValueEvent} from "framer-motion";
import {ArrowDown,ArrowUpRight,ArrowRight,Check,MessageSquare,Pause,Play,Plus,Minus,Package,FileText,Users,GraduationCap} from "lucide-react";
import {TechnologyBadges} from "@/components/technology-badges";
import {EditorialShell} from "@/components/editorial-shell";
import {HeroThread} from "@/components/hero-thread";
import {ScrollThread} from "@/components/editorial-motion";
import {Capabilities,MoreProjectScenes,EditorialTools,EditorialAbout} from "@/components/editorial-sections";

const omsSteps=[
 {name:"Customer conversation",text:"A customer question becomes work the right person can own."},
 {name:"Order & allocation",text:"The order carries its context into stock allocation or custom production."},
 {name:"Stock or production",text:"Ready stock and made-to-order work follow their own route to fulfilment."},
 {name:"Dispatch & delivery",text:"The parcel moves out. The order’s story stays connected."},
 {name:"Accounts & after-sales",text:"Reconciliation, returns and exchanges remain part of the same operation."},
];
function useSequence(ref:RefObject<HTMLElement|null>,reduced:boolean|null,count:number){
 const [step,setStep]=useState(0);const [playing,setPlaying]=useState(true);
 const {scrollYProgress}=useScroll({target:ref,offset:["start 65%","end 65%"]});
 useMotionValueEvent(scrollYProgress,"change",value=>{if(playing&&!reduced)setStep(Math.min(count-1,Math.max(0,Math.floor(value*count))))});
 return {step,playing:playing&&!reduced,setPlaying,choose:(i:number)=>{setStep(i);setPlaying(false)}};
}
function Shoe(){return <svg viewBox="0 0 400 170" fill="none" aria-hidden="true"><path d="M30 111 52 68 89 54 123 80 158 83 208 64 251 88 278 100 327 112Q367 120 373 139L365 151H41L23 137Z"/><path d="m52 68 12 55 45 11 46-4 37-16 59-26M123 80l-12 54M41 143h321M145 88l25 11m-12-15 24 10m-10-14 24 9m-9-13 23 9M278 100l-6 33M30 111q38 21 79 23"/><path d="M25 157H375M52 34H251M52 29v10m199-10v10" strokeDasharray="2 3"/><text x="135" y="27">PRODUCT / SPECIFICATION</text></svg>}
function Warehouse(){return <svg viewBox="0 0 360 210" fill="none" aria-hidden="true"><path d="M25 188V53L180 15l155 38v135ZM25 53h310M43 69h274v119H43ZM43 110h274M43 150h274M133 69v119m92-119v119"/><path d="M56 80h62v30H56Zm92 0h62v30h-62Zm92 0h62v30h-62ZM56 120h62v30H56Zm92 0h62v30h-62Zm92 0h62v30h-62ZM56 160h62v28H56Zm92 0h62v28h-62Zm92 0h62v28h-62Z"/><path d="M77 80v12h20V80m72 0v12h20V80m72 0v12h20V80M5 197h350"/><rect className="drawing-accent" x="148" y="120" width="62" height="30"/><text x="124" y="207">BRANCH / STOCK</text></svg>}
function Parcel(){return <svg viewBox="0 0 300 240" fill="none" aria-hidden="true"><path d="m40 73 110-45 111 45v116l-111 40-110-40ZM40 73l110 42 111-42M150 115v114M109 45l110 43v42l-25 10V97L83 54"/><path d="m63 126 56 20v39l-56-20Z"/><path d="m70 140 36 13m-36-5 36 13m-36-4 21 8"/><path d="m193 163 10-4v29l-10 4m17-35v29m7-32v29m9-33v29m5-31v29"/><circle cx="246" cy="40" r="22" className="drawing-accent"/><path d="m236 40 7 7 13-15" className="drawing-accent"/></svg>}
function Certificate(){return <svg viewBox="0 0 320 240" fill="none" aria-hidden="true"><path d="M22 18h275v200H22Z"/><path d="M32 28h255v180H32Z"/><text className="certificate-title" x="68" y="67">CERTIFICATE</text><path d="M76 95h168M62 106h195M93 117h133M61 151h85M61 159h56"/><circle cx="234" cy="159" r="23"/><circle cx="234" cy="159" r="15"/><path d="m222 181-5 47 17-14 17 14-6-47M93 137q20-14 33 0t30 0"/><path className="drawing-accent" d="m224 158 7 7 15-17"/></svg>}
function Space(){return <svg viewBox="0 0 330 220" fill="none" aria-hidden="true"><path d="M17 15h294v190H17ZM24 22h280v176H24ZM126 22v73m0 45v58M126 95h178M218 95v103M24 105h55m26 0h21"/><path d="M40 38h65v45H40Zm103 0h65v40h-65Zm85 0h55v40h-55ZM42 131h56v45H42Zm101-12h57v60h-57Zm91 1h53v59h-53Z"/><path d="M126 140q45 0 45-45M79 105q0 26 26 26" strokeDasharray="3 3"/><text x="42" y="69">LAB</text><text x="143" y="62">TRAINING</text><text x="237" y="156">SPACE</text></svg>}
function Thread({dark=false,kind="oms",active=0}:{dark?:boolean;kind?:"hero"|"oms"|"cega";active?:number}){
 const paths=kind==="oms"?["M140 0C140 90 95 80 95 140S310 160 370 180","M370 180C520 205 530 94 760 125S1010 90 1105 155","M1105 155C1230 230 1060 350 780 360S310 345 220 510","M220 510C260 610 480 590 640 600S980 675 1110 565","M1110 565C1300 625 1010 720 1100 800"]:kind==="cega"?["M1100 0C1100 100 800 130 630 225","M630 225C390 100 195 220 180 375S415 610 620 500","M620 500C900 650 1190 580 1115 330S865 240 780 360","M780 360C800 620 680 660 680 800"]:["M80 30C80 130 280 125 240 220S50 220 25 330S600 320 820 430S1220 460 1110 570S720 675 720 800"];
 return <ScrollThread paths={paths} hero={kind==="hero"} className={dark?"on-dark":""}/>;
}

export function EditorialPrototype(){
 const hero=useRef<HTMLElement>(null);const oms=useRef<HTMLElement>(null);const cega=useRef<HTMLElement>(null);const reduced=useReducedMotion();
 const sequence=useSequence(oms,reduced,omsSteps.length);const cohort=useSequence(cega,reduced,3);
 return <EditorialShell>
 <section ref={hero} className="editorial-hero hero-what-next" aria-labelledby="editorial-title">
  <HeroThread hero={hero}/>
  <span className="editorial-hero-side">SUFIYAN ALI / INDEPENDENT DEVELOPER</span>
  <div className="editorial-hero-title">
   <h1 id="editorial-title"><span>YOU HAVE</span><span data-hero-question-row>THE <em data-hero-question>WHAT IF.</em></span><span data-hero-build-row>I BUILD</span><span data-hero-next-row><em data-hero-next>WHAT’S NEXT.</em></span></h1>
  </div>
  <div className="editorial-hero-bottom"><p>My name is Suffynux. I turn business ideas into websites, custom applications, and practical AI tools.</p><div className="hero-actions"><a className="hero-primary" href="#contact">LET’S BUILD YOURS <ArrowUpRight size={18}/></a><a className="hero-secondary" href="#work">EXPLORE MY WORK <ArrowDown size={15}/></a></div></div>
 </section>

 <Capabilities/>
 <article ref={oms} className="editorial-project oms-scene" id="work" aria-labelledby="oms-title" data-playing={sequence.playing} data-step={sequence.step}>
 <Thread active={sequence.step}/><div className="scene-heading"><p>01 / E-COMMERCE OPERATIONS</p><p>One order. Every handoff.<br/>Connected from the first message<br/>to what happens after delivery.</p></div>
 <h2 className="scene-name" id="oms-title"><Link href="/projects/gomila-oms">GOMILA<span>OMS</span></Link></h2>
 <div className={`scene-object oms-chat ${sequence.step===0?"is-active":""}`}><div className="object-label"><MessageSquare size={13}/><span>CUSTOMER / WEBSITE</span><span className="object-dot"/></div><p className="chat-question">“Can you make this<br/>in my size?”</p><div className="chat-response"><span>GOMILA TEAM</span><p>Let’s get the details right.</p></div><div className="object-footer"><span>ASSIGNED TO THE TEAM</span><Check size={13}/></div></div>
 <div className={`scene-object oms-order ${sequence.step===1?"is-active":""}`}><div className="order-header"><strong>G.</strong><span>ORDER RECORD<br/>ILLUSTRATED WORKFLOW</span></div><Shoe/><div className="order-spec"><span>ARTICLE<br/><b>Custom Oxford</b></span><span>SIZE<br/><b>42</b></span></div><div className="order-rule"/><div className="object-footer"><span>DETAILS VERIFIED</span><Check size={13}/></div></div>
 <div className={`scene-object oms-stock ${sequence.step===2?"is-active":""}`}><Warehouse/><div className="drawing-caption"><span>READY STOCK</span><span className="accent-text">ALLOCATE ↗</span></div></div>
 <div className={`scene-object oms-production ${sequence.step===2?"is-active":""}`}><p className="object-label">OR / MADE TO ORDER</p><Shoe/><div className="production-steps"><span>SPECIFICATION</span><i/><span>PRODUCTION</span><i/><span>QUALITY</span></div></div>
 <div className={`scene-object oms-ledger ${sequence.step===4?"is-active":""}`}><div className="ledger-page"><span>ACCOUNTING / RECORD</span><h3>The numbers<br/>stay connected.</h3><div><span>Order</span><span>VERIFIED</span></div><div><span>Voucher</span><span>RECORDED</span></div><div><span>Ledger</span><span>RECONCILED</span></div></div><div className="ledger-page"><span>AFTER THE SALE</span><h3>A return is<br/>a next step.</h3><div className="return-stages"><span>Request</span><ArrowRight size={13}/><span>Review</span></div><div className="return-stages"><span>Receive</span><ArrowRight size={13}/><span>Resolve</span></div><span className="ledger-footnote">RETURNS & EXCHANGES</span></div><i className="ledger-binding"/></div>
 <div className={`scene-object oms-parcel ${sequence.step===3?"is-active":""}`}><Parcel/><div className="drawing-caption"><span>PACKED → DISPATCHED</span><Package size={13}/></div></div>
 <div className="scene-bottom"><div className="scene-playback"><button aria-label={sequence.playing?"Pause scroll story":"Follow scrolling"} onClick={()=>sequence.setPlaying(!sequence.playing)} disabled={!!reduced}>{sequence.playing?<Pause size={12}/>:<Play size={12}/>}</button><div className="scene-step-dots" aria-label="OMS workflow stages">{omsSteps.map((s,i)=><button key={s.name} aria-label={`Show ${s.name}`} aria-pressed={i===sequence.step} onClick={()=>sequence.choose(i)}>{String(i+1).padStart(2,"0")}</button>)}</div><p>{omsSteps[sequence.step].name}</p></div><Link className="scene-explore" href="/projects/gomila-oms">EXPLORE THE SYSTEM <ArrowUpRight size={20}/></Link></div>
 <div className="scene-detail"><details><summary>BUILT WITH <Plus size={12}/></summary><TechnologyBadges stack={["Next.js","TypeScript","Supabase","PostgreSQL"]}/></details><p>{omsSteps[sequence.step].text}</p><a href="#cega">NEXT / CEGA <ArrowDown size={13}/></a></div>
 </article>

 <article ref={cega} className="editorial-project cega-scene" id="cega" aria-labelledby="cega-title" data-playing={cohort.playing} data-step={cohort.step}>
 <Thread dark kind="cega" active={cohort.step}/><div className="scene-heading"><p>02 / PROGRAMME OPERATIONS</p><p>From the first application<br/>to a new generation of builders.</p></div>
 <h2 className="scene-name" id="cega-title"><Link href="/projects/cega">CEGA</Link></h2>
 <div className={`scene-object cega-application ${cohort.step===0?"is-active":""}`}><div className="object-label"><FileText size={13}/><span>APPLICATION / TRAINING</span></div><div className="application-profile"><Users size={30}/><div><span>APPLICANT RECORD</span><strong>A place to begin.</strong></div></div><div className="application-lines"><i/><i/><i/></div><div className="object-footer"><span>SUBMITTED</span><Check size={13}/></div></div>
 <motion.div className="scene-object cega-workspace" initial={reduced?false:{opacity:0,y:55,scale:.96,rotate:-1}} whileInView={{opacity:1,y:0,scale:1,rotate:-1}} viewport={{once:true,amount:.3}} transition={{duration:.8,ease:[.2,.7,.2,1]}}><div className="workspace-head"><strong>CEGA</strong><span>ONE CONNECTED WORKSPACE</span></div><div className={`workspace-row ${cohort.step===0?"is-active":""}`}><span className="workspace-icon"><FileText/></span><div><h3>Application received.</h3><p>TRAINING / INCUBATION / COMMUNITY</p></div><Check size={18}/></div><div className={`workspace-row ${cohort.step===1?"is-active":""}`}><span className="workspace-icon"><Users/></span><div><h3>The right people review.</h3><p>ROLES / CRITERIA / COHORTS</p></div><Check size={18}/></div><div className={`workspace-row ${cohort.step===2?"is-active":""}`}><span className="workspace-icon"><GraduationCap/></span><div><h3>A programme takes shape.</h3><p>SPACES / PROGRESS / CERTIFICATES</p></div><ArrowUpRight size={18}/></div></motion.div>
 <div className={`scene-object cega-review ${cohort.step===1?"is-active":""}`}><div className="object-label">INCUBATION / JUDGING</div><h3>Two phases.<br/>A structured review.</h3><div className="review-criteria">{Array.from({length:6},(_,i)=><span key={i}><span>0{i+1}</span><i/><Check size={11}/></span>)}</div><div className="object-footer"><span>SIX CRITERIA PER PHASE</span></div></div>
 <div className={`scene-object cega-certificate ${cohort.step===2?"is-active":""}`}><Certificate/><p className="drawing-caption">A RECORD OF ACHIEVEMENT</p></div>
 <div className={`scene-object cega-space ${cohort.step===2?"is-active":""}`}><Space/><p className="drawing-caption">TRAINING / CO-WORKING / RENDERING</p></div>
 <div className="scene-bottom"><div className="cega-note"><span className="orange-dot"/> THE THREAD CONTINUES</div><Link className="scene-explore" href="/projects/cega">EXPLORE THE PLATFORM <ArrowUpRight size={20}/></Link></div><div className="scene-detail"><details><summary>BUILT WITH <Plus size={12}/></summary><TechnologyBadges stack={["Next.js","TypeScript","MongoDB","OpenAI"]}/></details><p>Applications. People. Programmes. One connected system.</p><a href="#uk-medical-aid">NEXT / UK MEDICAL AID <ArrowDown size={13}/></a><button className="cega-pause" onClick={()=>cohort.setPlaying(!cohort.playing)} disabled={!!reduced}>{cohort.playing?<Pause size={12}/>:<Play size={12}/>} {cohort.playing?"PAUSE STORY":"FOLLOW SCROLL"}</button></div>
 </article>

 <MoreProjectScenes/><EditorialTools/><EditorialAbout/>
 </EditorialShell>;
}
