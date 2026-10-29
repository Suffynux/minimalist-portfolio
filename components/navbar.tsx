"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { site } from "@/lib/data";

const links = [
  {label:"Home",href:"/"},
  {label:"Selected work",href:"/projects"},
  {label:"About me",href:"/journey"},
  {label:"Services",href:"/#services"},
  {label:"Playground",href:"/creatives"},
  {label:"Discuss your project",href:"/#contact"},
];

export function Navbar({hero=false}:{hero?:boolean}) {
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  const dialog=useRef<HTMLDivElement>(null);
  const toggle=useRef<HTMLButtonElement>(null);
  useEffect(()=>setOpen(false),[pathname]);
  useEffect(()=>{
    if(!open)return;
    const previous=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const panel=dialog.current;
    panel?.querySelector<HTMLButtonElement>("button")?.focus();
    const key=(event:KeyboardEvent)=>{
      if(event.key==="Escape"){setOpen(false);return;}
      if(event.key!=="Tab"||!panel)return;
      const items=Array.from(panel.querySelectorAll<HTMLElement>('a[href],button:not([disabled])'));
      const first=items[0],last=items[items.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    };
    document.addEventListener("keydown",key);
    return()=>{document.body.style.overflow=previous;document.removeEventListener("keydown",key);toggle.current?.focus({preventScroll:true});};
  },[open]);
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className={`site-header ${hero?"nav-on-hero":""}`}>
      <nav className="page-width nav-inner" aria-label="Main navigation">
        <Link href="/" className="brand"><span>Sufiyan Ali<small>Full-stack developer &amp; AI builder</small></span></Link>
        <div className="desktop-links">{links.slice(1,4).map(link=><Link href={link.href} key={link.href} aria-current={pathname===link.href?"page":undefined}>{link.label}</Link>)}</div>
        <a className="nav-contact" href="/#contact">Get in touch <ArrowUpRight size={15}/></a>
        <button ref={toggle} type="button" className="nav-toggle" aria-label="Open navigation" aria-expanded={open} aria-controls={open?"site-menu":undefined} onClick={()=>setOpen(true)}><Menu size={19}/></button>
      </nav>
    </header>
    {open&&<div ref={dialog} className="site-menu" id="site-menu" role="dialog" aria-modal="true" aria-label="Site navigation">
      <div className="site-menu-top"><span>SUFIYAN ALI / AROUND HERE</span><button type="button" onClick={()=>setOpen(false)} aria-label="Close navigation"><X size={21}/></button></div>
      <nav className="site-menu-links" aria-label="All pages">{links.map((link,i)=><Link key={link.href} href={link.href} onClick={()=>setOpen(false)} aria-current={pathname===link.href?"page":undefined}><span>0{i+1}</span>{link.label}<ArrowUpRight/></Link>)}</nav>
      <div className="site-menu-bottom"><a href={`mailto:${site.email}`}>{site.email} ↗</a><span>Based in Pakistan. Building for everywhere.</span></div>
    </div>}
  </>;
}
