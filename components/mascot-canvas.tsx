"use client";

import { useEffect, useRef, useState } from "react";
import type { AvatarAction, AvatarPose } from "@/lib/avatar-rig";

type Props = { pose: AvatarPose; action: AvatarAction; reduced: boolean; dotted?: boolean; paused?: boolean };

export function MascotCanvas(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const live = useRef(props);
  const [ready, setReady] = useState(false);
  live.current = props;

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    const element = host.current;
    if (!element) return;
    // Keep Three.js out of the initial route bundle. The saved portrait is also
    // the permanent fallback on devices without WebGL or on context loss.
    Promise.all([import("three"), import("@/lib/avatar-rig")]).then(([T, {createAvatarRig}]) => {
      if (disposed) return;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try { renderer = new T.WebGLRenderer({alpha:true, antialias:true, powerPreference:"low-power"}); }
      catch { return; }
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.outputColorSpace = T.SRGBColorSpace;
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(34,1,.1,30);
      camera.position.set(0,.3,5.95);
      camera.lookAt(0,.2,0);
      const rig=createAvatarRig();scene.add(rig.root);
      scene.add(new T.AmbientLight(0xffffff,1.1));
      const key=new T.DirectionalLight(0xffffff,3.4);key.position.set(-3,5,5);scene.add(key);
      const fill=new T.DirectionalLight(0xffffff,.75);fill.position.set(4,1,2);scene.add(fill);
      const rim=new T.DirectionalLight(0xffffff,1.6);rim.position.set(0,3,-3);scene.add(rim);
      const target = new T.WebGLRenderTarget(1,1,{minFilter:T.LinearFilter,magFilter:T.LinearFilter});
      const screen = new T.Scene();
      const screenCamera = new T.OrthographicCamera(-1,1,1,-1,0,1);
      const material = new T.ShaderMaterial({
        transparent:true, depthTest:false, depthWrite:false,
        uniforms:{source:{value:target.texture},dotted:{value:true},pixelSize:{value:Math.min(devicePixelRatio,1.5)*2},resolution:{value:new T.Vector2(1,1)}},
        vertexShader:`varying vec2 uvCoord; void main(){uvCoord=uv;gl_Position=vec4(position.xy,0.,1.);}`,
        fragmentShader:`
          uniform sampler2D source; uniform bool dotted; uniform float pixelSize; uniform vec2 resolution; varying vec2 uvCoord;
          float bayer(vec2 p) {
            vec2 a=mod(floor(p),2.); vec2 b=mod(floor(p/2.),2.);
            float n=2.*a.x+3.*a.y-4.*a.x*a.y;
            float m=2.*b.x+3.*b.y-4.*b.x*b.y;
            return (4.*n+m+.5)/16.;
          }
          void main(){
            vec2 sampledUv=dotted?(floor(gl_FragCoord.xy/pixelSize)+.5)*pixelSize/resolution:uvCoord;
            vec4 c=texture2D(source,sampledUv); if(c.a<.04)discard;
            float light=dot(c.rgb,vec3(.299,.587,.114))/max(c.a,.01);
            light=clamp(pow(light,.9)*.91,.015,.985);
            float tone=dotted?step(bayer(gl_FragCoord.xy/pixelSize),light):light;
            gl_FragColor=vec4(vec3(tone),c.a);
          }`,
      });
      const quadGeo=new T.PlaneGeometry(2,2);screen.add(new T.Mesh(quadGeo,material));
      const canvas=renderer.domElement;
      canvas.setAttribute("aria-hidden","true");
      element.appendChild(canvas);
      const pointer={x:0,y:0};
      const onPointer=(e:PointerEvent)=>{
        if(e.pointerType==="touch")return;
        const r=element.getBoundingClientRect();
        pointer.x=T.MathUtils.clamp((e.clientX-r.left-r.width/2)/Math.max(200,r.width),-1,1);
        pointer.y=T.MathUtils.clamp((e.clientY-r.top-r.height/2)/Math.max(200,r.height),-1,1);
      };
      const reset=()=>{pointer.x=0;pointer.y=0;};
      let bufferWidth=0, bufferHeight=0;
      const resize=()=>{
        const {width,height}=element.getBoundingClientRect();
        if(!width||!height)return;
        // Quantize buffers while the scroll path resizes the guide; CSS supplies the smooth visual size.
        const renderWidth=Math.max(64,Math.round(width/32)*32);
        const renderHeight=Math.max(64,Math.round(height/32)*32);
        if(renderWidth!==bufferWidth||renderHeight!==bufferHeight){
          renderer.setSize(renderWidth,renderHeight,false);
          bufferWidth=renderWidth;bufferHeight=renderHeight;
        }
        camera.aspect=width/height;camera.updateProjectionMatrix();
        const size=new T.Vector2();renderer.getDrawingBufferSize(size);target.setSize(size.x,size.y);
        material.uniforms.resolution.value.copy(size);
        material.uniforms.pixelSize.value=Math.min(devicePixelRatio,1.5)*Math.max(1,Math.min(1.8,width/350));
      };
      const observer=new ResizeObserver(resize);observer.observe(element);resize();
      let visible=true, lastFrame=0;
      const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});visibility.observe(element);
      let first=true;
      renderer.setAnimationLoop(time=>{
        if(document.hidden||!visible||live.current.paused||time-lastFrame<(live.current.reduced?100:32))return;
        lastFrame=time;
        const {pose,action,reduced,dotted=true}=live.current;
        rig.update(time/1000,pose,action,pointer,reduced);
        material.uniforms.dotted.value=dotted;
        renderer.setRenderTarget(target);renderer.clear();renderer.render(scene,camera);
        renderer.setRenderTarget(null);renderer.clear();renderer.render(screen,screenCamera);
        canvas.dataset.pose=pose;
        if(first){first=false;setReady(true);}
      });
      const lost=(e:Event)=>{e.preventDefault();setReady(false);renderer.setAnimationLoop(null);};
      const restored=()=>{setReady(false);};
      canvas.addEventListener("webglcontextlost",lost);
      canvas.addEventListener("webglcontextrestored",restored);
      window.addEventListener("pointermove",onPointer,{passive:true});window.addEventListener("blur",reset);
      cleanup=()=>{
        renderer.setAnimationLoop(null);observer.disconnect();visibility.disconnect();
        window.removeEventListener("pointermove",onPointer);window.removeEventListener("blur",reset);
        canvas.removeEventListener("webglcontextlost",lost);canvas.removeEventListener("webglcontextrestored",restored);
        rig.dispose();target.dispose();material.dispose();quadGeo.dispose();renderer.dispose();canvas.remove();
      };
    }).catch(()=>{ /* The portrait remains visible if the optional renderer cannot load. */ });
    return()=>{disposed=true;cleanup();};
  },[]);

  return <div className={`mascot-render ${ready?"is-ready":""}`} ref={host} role="img" aria-label="Sufiyan’s animated monochrome 3D character">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="mascot-render-fallback" src="/avatar/sufiyan-guide.png" alt="" width={1254} height={1254} draggable={false}/>
  </div>;
}
