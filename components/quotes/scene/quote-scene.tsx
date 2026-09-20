"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor, Preload } from "@react-three/drei";
import * as THREE from "three";
import { placeQuotes, type Placed, type Tier } from "@/lib/quotes/layout";
import type { Quote } from "@/lib/quotes/types";
import { QuoteMesh } from "@/components/quotes/scene/quote-mesh";

type Props = {
  quotes: Quote[];
  filter: Tier | "all";
  paused: boolean;
  onOpen: (quote: Placed) => void;
};

function Dust({ paused, count }: { paused: boolean; count: number }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 6 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.cos(phi) * r * 0.6;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  useFrame((_, delta) => {
    if (points.current && !paused) points.current.rotation.y += delta * 0.01;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial size={0.05} color="#8D9A5E" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/**
 * Rotates the field around the camera.
 *
 * The camera stays at the origin and the world turns, which keeps every quote
 * equidistant and avoids the nausea of flying a camera through text.
 */
function Rig({ children, paused }: { children: React.ReactNode; paused: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { pointer, gl } = useThree();
  const state = useRef({ angle: 0, velocity: 0, dragging: false, lastX: 0, tiltTarget: 0 });

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const s = state.current;

    if (!s.dragging) {
      // Idle drift, plus whatever momentum the last drag left behind.
      if (!paused) s.angle += delta * 0.045;
      s.angle += s.velocity;
      s.velocity *= 0.95;
    }

    g.rotation.y = s.angle;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, pointer.y * 0.1, 0.04);
  });

  const onDown = (e: React.PointerEvent) => {
    const s = state.current;
    s.dragging = true;
    s.lastX = e.clientX;
    s.velocity = 0;
    gl.domElement.style.cursor = "grabbing";
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    s.lastX = e.clientX;
    s.angle += dx * 0.004;
    s.velocity = dx * 0.0008;
  };

  const onUp = () => {
    state.current.dragging = false;
    gl.domElement.style.cursor = "grab";
  };

  return (
    <group ref={group} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
      {children}
    </group>
  );
}

/** Rebuilds the layout when the viewport changes, so the field always fits. */
function Field({ quotes, filter, paused, onOpen }: Props) {
  const { viewport, size } = useThree();
  const compact = size.width < 640;

  const placed = useMemo(
    () => placeQuotes(quotes, { aspect: viewport.aspect, compact }),
    [quotes, viewport.aspect, compact]
  );

  return (
    <>
      {placed.map((quote) => (
        <QuoteMesh
          key={quote.id}
          quote={quote}
          paused={paused}
          onOpen={onOpen}
          dimmed={filter !== "all" && quote.tier !== filter}
        />
      ))}
    </>
  );
}

export function QuoteScene({ quotes, filter, paused, onOpen }: Props) {
  const [degraded, setDegraded] = useState(false);

  return (
    <Canvas
      // Capped DPR: text scenes are fill-rate bound, so an uncapped 3x phone
      // does ~9x the fragment work for no visible gain.
      dpr={[1, degraded ? 1.25 : 2]}
      // A narrow FOV reads as a long lens: less perspective distortion on text
      // at the edges, which is what makes wide-FOV type scenes look cheap.
      camera={{ position: [0, 0, 0.01], fov: 42, near: 0.1, far: 60 }}
      gl={{ antialias: !degraded, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
      frameloop="always"
    >
      <color attach="background" args={["#13140D"]} />
      {/* Fog does the depth grading: distant quotes dissolve into the void
          instead of ending at a hard edge. */}
      <fog attach="fog" args={["#13140D", 7, 26]} />

      <PerformanceMonitor onDecline={() => setDegraded(true)} flipflops={3} />
      <AdaptiveDpr pixelated />

      <ambientLight intensity={1.5} />

      <Rig paused={paused}>
        <Dust paused={paused} count={degraded ? 140 : 380} />
        <Field quotes={quotes} filter={filter} paused={paused} onOpen={onOpen} />
      </Rig>

      <Preload all />
    </Canvas>
  );
}
