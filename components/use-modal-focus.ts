"use client";
import { useEffect, useRef } from "react";

/** Trap focus in a modal, lock background scrolling, then restore the trigger. */
export function useModalFocus(open:boolean,onClose:()=>void) {
  const ref=useRef<HTMLDivElement>(null);
  const close=useRef(onClose);close.current=onClose;
  useEffect(()=>{
    if(!open)return;
    const previous=document.activeElement as HTMLElement|null;
    const overflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const nodes=()=>Array.from(ref.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),textarea,input:not([type="hidden"]),select,[tabindex="0"]')??[]).filter(el=>el.getClientRects().length>0);
    nodes()[0]?.focus();
    const key=(event:KeyboardEvent)=>{
      if(event.key==="Escape"){event.preventDefault();close.current();return;}
      if(event.key!=="Tab")return;
      const items=nodes(),first=items[0],last=items[items.length-1];
      if(!first){event.preventDefault();return;}
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    };
    document.addEventListener("keydown",key);
    return()=>{document.removeEventListener("keydown",key);document.body.style.overflow=overflow;if(previous?.isConnected)previous.focus({preventScroll:true});};
  },[open]);
  return ref;
}
