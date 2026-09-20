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

/** Drifting motes that give the void a sense of scale. */
function Dust({ paused }: { paused: boolean }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 8 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.sin(theta) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = Math.cos(theta) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    if (points.current && !paused) points.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial size={0.055} color="#6E7A45" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/**
 * Camera rig: the whole field rotates rather than the camera flying, which
 * keeps the motion predictable and avoids disorientation.
 */
function Rig({
  children,
  paused,
  focusedRing
}: {
  children: React.ReactNode;
  paused: boolean;
  focusedRing: number | null;
}) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const drag = useRef({ active: false, last: 0, velocity: 0, angle: 0 });

  useFrame((_, delta) => {
    if (!group.current) return;

    // Idle rotation, plus whatever momentum a drag left behind.
    if (!paused) {
      drag.current.angle += delta * 0.055 + drag.current.velocity;
      drag.current.velocity *= 0.94;
    }

    group.current.rotation.y = drag.current.angle;
    // Pointer tilts the field gently - enough to feel dimensional, not enough
    // to make anything unreadable.
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.12, 0.05);
  });

  return (
    <group
      ref={group}
      onPointerDown={(e) => {
        drag.current.active = true;
        drag.current.last = e.clientX;
      }}
      onPointerUp={() => {
        drag.current.active = false;
      }}
      onPointerMove={(e) => {
        if (!drag.current.active) return;
        const dx = e.clientX - drag.current.last;
        drag.current.last = e.clientX;
        drag.current.velocity = dx * 0.00035;
      }}
    >
      {children}
    </group>
  );
}

export function QuoteScene({ quotes, filter, paused, onOpen }: Props) {
  const placed = useMemo(() => placeQuotes(quotes), [quotes]);
  const [degraded, setDegraded] = useState(false);

  return (
    <Canvas
      // Capped DPR: text scenes are fill-rate bound, and an uncapped 3x phone
      // does ~9x the fragment work for no visible gain.
      dpr={[1, degraded ? 1.2 : 2]}
      camera={{ position: [0, 0, 0.1], fov: 62 }}
      gl={{ antialias: !degraded, powerPreference: "high-performance" }}
      // 'demand' would stop the idle drift, so the pause control handles
      // reduced motion instead of the frameloop.
      frameloop={paused ? "demand" : "always"}
    >
      <color attach="background" args={["#14150E"]} />
      <fog attach="fog" args={["#14150E", 12, 30]} />

      <PerformanceMonitor onDecline={() => setDegraded(true)} flipflops={3} />
      <AdaptiveDpr pixelated />

      <ambientLight intensity={1.4} />

      <Rig paused={paused} focusedRing={null}>
        <Dust paused={paused} />
        {placed.map((quote) => (
          <QuoteMesh
            key={quote.id}
            quote={quote}
            paused={paused}
            onOpen={onOpen}
            dimmed={filter !== "all" && quote.tier !== filter}
          />
        ))}
      </Rig>

      <Preload all />
    </Canvas>
  );
}
