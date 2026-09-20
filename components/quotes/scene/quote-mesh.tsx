"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { Group, Material, Mesh } from "three";
import { FOCAL, STEP, type Placed } from "@/lib/quotes/layout";

const FONT = "/fonts/InstrumentSerif-Regular.ttf";
const FONT_ITALIC = "/fonts/InstrumentSerif-Italic.ttf";

const TIER_COLOR: Record<Placed["tier"], string> = {
  own: "#F2F0E9",
  curated: "#DAD9CB",
  visitor: "#C9CFB0"
};

type Props = {
  quote: Placed;
  /** Ref shared with the rig: the camera's current position in the procession. */
  progress: React.MutableRefObject<number>;
  paused: boolean;
  onOpen: (quote: Placed) => void;
};

/**
 * Picks a font size so the quote fits the visible area at reading distance.
 *
 * Text sized in world units is the same size on every screen, which is why the
 * sphere version showed three giant word fragments on a phone. This measures
 * the frustum at the focal distance and fits the quote into a box that is a
 * fraction of it, so a phone gets phone-sized type and a monitor gets more.
 */
function fitFontSize(body: string, visibleWidth: number, visibleHeight: number, compact: boolean) {
  const maxWidth = visibleWidth * (compact ? 0.84 : 0.7);
  const maxHeight = visibleHeight * 0.52;
  const avgGlyph = 0.46; // Instrument Serif is narrow; average advance in em
  const lineHeight = 1.18;

  // Start from a comfortable line length and shrink until the block fits.
  let fontSize = maxWidth / ((compact ? 18 : 28) * avgGlyph);
  for (let i = 0; i < 12; i += 1) {
    const charsPerLine = Math.max(8, Math.floor(maxWidth / (fontSize * avgGlyph)));
    const lines = Math.ceil(body.length / charsPerLine);
    if (lines * fontSize * lineHeight <= maxHeight) break;
    fontSize *= 0.9;
  }
  return { fontSize, maxWidth };
}

export function QuoteMesh({ quote, progress, paused, onOpen }: Props) {
  const group = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);
  const labelRef = useRef<Mesh>(null);
  const { viewport, camera, size } = useThree();
  const compact = size.width < 640;

  // Frustum size at the focal plane, which is where this quote will be when
  // it is the one in focus.
  const { fontSize, maxWidth } = useMemo(() => {
    const v = viewport.getCurrentViewport(camera, [0, 0, -FOCAL]);
    return fitFontSize(quote.body, v.width, v.height, compact);
  }, [quote.body, viewport, camera, compact, size.width, size.height]);

  const label = quote.author_name
    ? quote.author_name.toUpperCase()
    : quote.posted_by
      ? `VIA ${quote.posted_by.toUpperCase()}`
      : quote.tier === "own"
        ? "SUFIYAN"
        : "ANONYMOUS";

  useFrame((state) => {
    const g = group.current;
    if (!g) return;

    // Signed distance from the focal position: 0 = in focus, negative = still
    // ahead of the reader, positive = already walked past.
    const offset = progress.current - quote.index;

    // Visibility falls off over roughly a step and a half ahead, and much
    // faster behind - once you have walked through a line it should be gone,
    // not hanging over your shoulder.
    const ahead = Math.max(0, -offset);
    const behind = Math.max(0, offset);
    const opacity = Math.max(0, 1 - ahead / 1.6) * Math.max(0, 1 - behind / 0.45);

    // Quotes that cannot be seen do not need to be drawn.
    g.visible = opacity > 0.01;
    if (!g.visible) return;

    for (const ref of [bodyRef, labelRef]) {
      const mesh = ref.current;
      if (!mesh) continue;
      const material = mesh.material as Material;
      material.transparent = true;
      material.opacity = ref === labelRef ? opacity * 0.85 : opacity;
    }

    // Gentle breathing so a quote in focus never sits perfectly still.
    if (!paused) {
      const t = state.clock.elapsedTime + quote.seed * 40;
      g.position.y = quote.worldY + Math.sin(t * 0.35) * 0.06;
      g.position.x = quote.worldX + Math.cos(t * 0.27) * 0.04;
    }
  });

  return (
    <group ref={group} position={[quote.worldX, quote.worldY, quote.worldZ]}>
      <Text
        ref={bodyRef}
        font={quote.tier === "own" ? FONT_ITALIC : FONT}
        fontSize={fontSize}
        maxWidth={maxWidth}
        lineHeight={1.18}
        letterSpacing={-0.012}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color={TIER_COLOR[quote.tier]}
        onClick={(e) => {
          e.stopPropagation();
          onOpen(quote);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        {quote.body}
      </Text>

      <Text
        ref={labelRef}
        font={FONT}
        fontSize={fontSize * 0.3}
        position={[0, -(fontSize * 1.18 * Math.max(1, Math.ceil(quote.body.length / 26)) * 0.5) - fontSize * 0.9, 0]}
        anchorX="center"
        anchorY="middle"
        color="#9DAB6B"
        letterSpacing={0.16}
      >
        {label}
      </Text>
    </group>
  );
}
