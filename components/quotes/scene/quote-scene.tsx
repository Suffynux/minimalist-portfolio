"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor, Preload } from "@react-three/drei";
import * as THREE from "three";
import { cameraZ, placeQuotes, STEP, type Placed } from "@/lib/quotes/layout";
import type { Quote } from "@/lib/quotes/types";
import { QuoteMesh } from "@/components/quotes/scene/quote-mesh";

export type SceneProps = {
  quotes: Quote[];
  paused: boolean;
  onOpen: (quote: Placed) => void;
  /** Reports the quote currently in focus, for the DOM overlay. */
  onFocusChange: (index: number) => void;
  /** Incrementing token plus target index: "walk to this quote now". */
  jump: { token: number; index: number } | null;
  /** Step requests from the overlay buttons: +1 / -1. */
  step: { token: number; delta: number } | null;
};

const BG = "#13140D";

/** Motes lining the corridor. They give the walk a sense of speed. */
function Dust({ length, count }: { length: number; count: number }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      // Hollow tube: nothing in the middle where the text lives.
      const radius = 3.2 + Math.random() * 6;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.7;
      positions[i * 3 + 2] = -Math.random() * length;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [length, count]);

  return (
    <points geometry={geometry}>
      <pointsMaterial size={0.06} color="#8D9A5E" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/**
 * Moves the camera along the corridor.
 *
 * `progress` is a fractional index into the procession. It drifts forward on
 * its own, responds to horizontal drag with momentum, and eases toward the
 * nearest whole number once the reader lets go - so a quote always settles
 * into focus rather than stopping between two.
 */
function Walk({
  count,
  paused,
  progress,
  onFocusChange,
  jump,
  step
}: {
  count: number;
  paused: boolean;
  progress: React.MutableRefObject<number>;
  onFocusChange: (index: number) => void;
  jump: SceneProps["jump"];
  step: SceneProps["step"];
}) {
  const { camera, gl, size } = useThree();
  const s = useRef({
    velocity: 0,
    dragging: false,
    lastX: 0,
    lastMove: 0,
    target: null as number | null,
    reported: -1,
    /** Seconds the current quote has been settled in focus. */
    dwell: 0
  });

  useEffect(() => {
    if (jump) s.current.target = THREE.MathUtils.clamp(jump.index, 0, count - 1);
  }, [jump, count]);

  useEffect(() => {
    if (!step) return;
    const from = s.current.target ?? Math.round(progress.current);
    s.current.target = THREE.MathUtils.clamp(from + step.delta, 0, count - 1);
    s.current.dwell = 0;
  }, [step, count, progress]);

  // Pointer handling lives on the canvas element so a drag that starts in
  // empty space still turns the walk.
  useEffect(() => {
    const el = gl.domElement;
    const st = s.current;
    // On a phone, the whole width is about 1.5 steps; on a monitor, less.
    const perPixel = 1 / Math.max(size.width * 0.65, 240);

    const down = (e: PointerEvent) => {
      st.dragging = true;
      st.lastX = e.clientX;
      st.lastMove = performance.now();
      st.velocity = 0;
      st.target = null;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!st.dragging) return;
      const dx = e.clientX - st.lastX;
      st.lastX = e.clientX;
      st.lastMove = performance.now();
      // Dragging left walks forward, the way you would swipe through pages.
      progress.current = THREE.MathUtils.clamp(progress.current - dx * perPixel, -0.3, count - 0.7);
      st.velocity = -dx * perPixel;
    };
    const up = () => {
      if (!st.dragging) return;
      st.dragging = false;
      el.style.cursor = "grab";
      // A stale velocity from a drag that paused before release should not
      // fling the walk.
      if (performance.now() - st.lastMove > 80) st.velocity = 0;
    };

    el.style.cursor = "grab";
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [gl, size.width, count, progress]);

  useFrame((_, delta) => {
    const st = s.current;
    const dt = Math.min(delta, 0.05);

    if (!st.dragging) {
      if (Math.abs(st.velocity) > 0.0004) {
        // Coast after a fling, then hand over to settling.
        progress.current += st.velocity;
        st.velocity *= 0.92;
      } else if (st.target !== null) {
        progress.current = THREE.MathUtils.damp(progress.current, st.target, 4, dt);
        if (Math.abs(progress.current - st.target) < 0.002) {
          progress.current = st.target;
          st.target = null;
        }
      } else {
        const nearest = Math.round(progress.current);
        const settled = Math.abs(progress.current - nearest) < 0.01;

        if (!settled) {
          progress.current = THREE.MathUtils.damp(progress.current, nearest, 5, dt);
        } else if (!paused && nearest < count - 1) {
          // Dwell on the line long enough to actually read it, then walk on.
          // Longer quotes get longer.
          st.dwell += dt;
          if (st.dwell > 7) {
            st.target = nearest + 1;
            st.dwell = 0;
          }
        }
      }
      progress.current = THREE.MathUtils.clamp(progress.current, -0.3, count - 0.7);
    } else {
      st.dwell = 0;
    }

    camera.position.z = cameraZ(progress.current);
    // A touch of lateral sway so the walk feels like a walk.
    camera.position.x = Math.sin(progress.current * 0.9) * 0.18;

    const focused = THREE.MathUtils.clamp(Math.round(progress.current), 0, count - 1);
    if (focused !== st.reported) {
      st.reported = focused;
      onFocusChange(focused);
    }
  });

  return null;
}

export function QuoteScene({ quotes, paused, onOpen, onFocusChange, jump, step }: SceneProps) {
  const placed = useMemo(() => placeQuotes(quotes), [quotes]);
  const progress = useRef(0);
  const [degraded, setDegraded] = useState(false);

  return (
    <Canvas
      dpr={[1, degraded ? 1.25 : 2]}
      // A narrow FOV reads as a long lens: text at the edges stays true.
      camera={{ position: [0, 0, cameraZ(0)], fov: 40, near: 0.1, far: 40 }}
      gl={{ antialias: !degraded, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
      frameloop="always"
    >
      <color attach="background" args={[BG]} />
      {/* The next quote should be just legible in the haze, the one after
          barely there. Fog does the grading. */}
      <fog attach="fog" args={[BG, STEP * 0.9, STEP * 2.3]} />

      <PerformanceMonitor onDecline={() => setDegraded(true)} flipflops={3} />
      <AdaptiveDpr pixelated />
      <ambientLight intensity={1.5} />

      <Dust length={placed.length * STEP + STEP * 3} count={degraded ? 200 : 520} />

      {placed.map((quote) => (
        <QuoteMesh key={quote.id} quote={quote} progress={progress} paused={paused} onOpen={onOpen} />
      ))}

      <Walk count={placed.length} paused={paused} progress={progress} onFocusChange={onFocusChange} jump={jump} step={step} />
      <Preload all />
    </Canvas>
  );
}
