"use client";
import { useState } from "react";
import { EmojiMascot } from "@/components/emoji-mascot";
import type { AvatarPose } from "@/lib/avatar-rig";

const directions:{pose:AvatarPose;label:string;speech:string}[]=[
  {pose:"audience",label:"Look at me",speech:"Hey! Move your pointer. I’m following along."},
  {pose:"present-left",label:"Present left",speech:"Over here. This is where the next idea begins."},
  {pose:"present-right",label:"Present right",speech:"Let me show you what we’re building."},
  {pose:"read",label:"Think it over",speech:"First, understand the problem. Then open the editor."},
];
export function AvatarPlayground() {
  const [direction,setDirection]=useState(0);
  const [dotted,setDotted]=useState(true);
  const [dark,setDark]=useState(false);
  return <section className="playground-lab page-width">
    <div className={`avatar-lab-stage ${dark?"lab-dark":""}`} style={dark?{background:"#293b32"}:undefined}>
      <div className="lab-topline" style={dark?{color:"#c5cebb"}:undefined}><span>EXPERIMENT 001</span><span>LIVE CHARACTER / SUFIYAN</span></div>
      <EmojiMascot standalone pose={directions[direction].pose} speech={directions[direction].speech} dotted={dotted}/>
    </div>
    <div className="lab-controls"><p className="eyebrow">A LITTLE PERSONALITY</p><h2>Go on.<br/><em>Break the ice.</em></h2><p>The same character that guides you through my work. Turn his head, change the finish, or celebrate a good day with a questionable dance.</p>
      <div className="lab-control-group"><p>01 / WHERE SHOULD I LOOK?</p><div>{directions.map((item,i)=><button type="button" key={item.pose} aria-pressed={direction===i} onClick={()=>setDirection(i)}>{item.label}</button>)}</div></div>
      <div className="lab-control-group"><p>02 / THE FINISH</p><div><button type="button" aria-pressed={dotted} onClick={()=>setDotted(true)}>Dotted ink</button><button type="button" aria-pressed={!dotted} onClick={()=>setDotted(false)}>Soft monochrome</button></div></div>
      <div className="lab-control-group"><p>03 / SET THE SCENE</p><div><button type="button" aria-pressed={!dark} onClick={()=>setDark(false)}>Light studio</button><button type="button" aria-pressed={dark} onClick={()=>setDark(true)}>Dark studio</button></div></div>
      <p className="lab-note">Try “Do a trick” inside the studio. Sound starts muted, and motion follows your device’s accessibility preference.</p>
      <a className="text-link" href="/avatar/sufiyan-guide.png" download="sufiyan-avatar.png">Download the character portrait ↓</a>
    </div>
  </section>;
}
