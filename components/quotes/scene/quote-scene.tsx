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
    /** Units of progress per second, after a fling. */
    velocity: 0,
    armed: false,
    dragging: false,
    startX: 0,
    startY: 0,
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

  // Native listeners on the canvas so a drag that starts in empty space still
  // moves the walk. Intent is decided after a few pixels: a mostly-vertical
  // gesture is handed back to the page to scroll, and only a horizontal one
  // captures the pointer. Capturing on pointerdown would kill page scroll
  // exactly the way touch-action:none does.
  useEffect(() => {
    const el = gl.domElement;
    const st = s.current;
    const perPixel = 1 / Math.max(size.width * 0.65, 240);
    const SLOP = 8;

    const down = (e: PointerEvent) => {
      st.armed = true;
      st.dragging = false;
      st.startX = e.clientX;
      st.startY = e.clientY;
      st.lastX = e.clientX;
      st.lastMove = performance.now();
    };
    const move = (e: PointerEvent) => {
      if (st.dragging) {
        const now = performance.now();
        const dx = e.clientX - st.lastX;
        const ms = Math.max(now - st.lastMove, 1);
        st.lastX = e.clientX;
        st.lastMove = now;
        // Dragging left walks forward, the way you swipe through pages.
        progress.current = THREE.MathUtils.clamp(progress.current - dx * perPixel, -0.3, count - 0.7);
        st.velocity = (-dx * perPixel * 1000) / ms;
        return;
      }
      if (!st.armed) return;
      const dx = e.clientX - st.startX;
      const dy = e.clientY - st.startY;
      if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        st.armed = false; // vertical: the page scrolls
        return;
      }
      st.dragging = true;
      st.target = null;
      st.velocity = 0;
      st.lastX = e.clientX;
      st.lastMove = performance.now();
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const up = () => {
      st.armed = false;
      if (!st.dragging) return;
      st.dragging = false;
      el.style.cursor = "grab";
      // A drag that stopped moving before release should not fling.
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
    // Clamped so a backgrounded tab does not teleport the walk on return.
    const dt = Math.min(delta, 1 / 30);

    if (!st.dragging) {
      if (Math.abs(st.velocity) > 0.05) {
        // Coast after a fling. Decay is expressed per second, so it feels the
        // same at 60Hz and 120Hz.
        progress.current += st.velocity * dt;
        st.velocity *= Math.pow(0.06, dt);
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
      // iOS Safari's collapsing URL bar fires resize on scroll; re-measuring
      // the canvas each time makes the camera jitter.
      resize={{ scroll: false }}
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
