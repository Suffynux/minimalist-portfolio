"use client";
import {useEffect,useState,type ReactNode} from "react";
import Link from "next/link";
import {ArrowUpRight,Github,Linkedin,Mail,Plus,Minus} from "lucide-react";
import {usePathname} from "next/navigation";
import {EditorialMotion,SignatureIntro,PageReadingLine} from "@/components/editorial-motion";
import {site} from "@/lib/data";
const destinations=[["01","Gomila OMS","work"],["02","CEGA","cega"],["03","UK Medical Aid","uk-medical-aid"],["04","Bangrila Motors","bangrila-motors"],["05","Zone Pro","zone-pro"],["06","Small tools","tools"]];
export function EditorialShell({children,className="",footer=true}:{children:ReactNode;className?:string;footer?:boolean}){
 const [menu,setMenu]=useState(false);const path=usePathname();const home=path==="/";
 useEffect(()=>{setMenu(false)},[path]);
 useEffect(()=>{if(!menu)return;const key=(e:KeyboardEvent)=>{if(e.key==="Escape"){setMenu(false);document.getElementById("editorial-menu-toggle")?.focus()}};document.addEventListener("keydown",key);return()=>document.removeEventListener("keydown",key)},[menu]);
 const href=(hash:string)=>`${home?"":"/"}#${hash}`;
 return <div className={`editorial-site ${className}`} id="top">{home&&<SignatureIntro/>}<EditorialMotion/><a className="skip-link" href="#main-content">Skip to content</a><header className={`editorial-nav ${menu?"menu-is-open":""}`}><Link className="editorial-logo" href="/" aria-label="Suffynux home">SUFFYNUX<span>✳</span></Link><nav aria-label="Main navigation" inert={menu}><a href={href("capabilities")}>CAPABILITIES</a><a href={href("work")}>PROJECTS</a><a href={href("about")}>ABOUT</a><a href={href("contact")}>CONTACT <ArrowUpRight size={13}/></a></nav><button id="editorial-menu-toggle" aria-expanded={menu} aria-controls="editorial-menu" onClick={()=>setMenu(!menu)}>{menu?"CLOSE":"INDEX"}{menu?<Minus size={16}/>:<Plus size={16}/>}</button></header>{menu&&<nav className="editorial-index" id="editorial-menu" aria-label="Project index" data-lenis-prevent><p>THE COLLECTION / JUMP STRAIGHT IN</p>{destinations.map(([n,title,id])=><a key={id} href={href(id)} onClick={()=>setMenu(false)}><span>{n}</span>{title}<ArrowUpRight/></a>)}<Link href="/projects" onClick={()=>setMenu(false)}><span>↗</span>All projects<ArrowUpRight/></Link></nav>}<main id="main-content" inert={menu}>{!home&&<PageReadingLine key={path}/>}{children}{footer&&<EditorialFooter/>}</main></div>;
}
export function EditorialFooter(){return <footer className="editorial-contact" id="contact"><p>HAVE SOMETHING WORTH BUILDING?</p><a href={`mailto:${site.email}`}>LET’S TALK.<ArrowUpRight/></a><div><span>SUFIYAN ALI / SUFFYNUX</span><a href={site.github} target="_blank" rel="noreferrer" className="editorial-social-link" aria-label="GitHub" title="GitHub"><Github size={20} aria-hidden="true"/></a><a href={site.linkedin} target="_blank" rel="noreferrer" className="editorial-social-link" aria-label="LinkedIn" title="LinkedIn"><Linkedin size={20} aria-hidden="true"/></a><a href={`mailto:${site.email}`} className="editorial-social-link" aria-label="Email" title="Email"><Mail size={20} aria-hidden="true"/></a><a href="#top">BACK TO TOP ↑</a></div></footer>}
