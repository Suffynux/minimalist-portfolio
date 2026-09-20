"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import type { Group } from "three";
import type { Placed } from "@/lib/quotes/layout";

const FONT = "/fonts/InstrumentSerif-Regular.ttf";
const FONT_ITALIC = "/fonts/InstrumentSerif-Italic.ttf";

/** Palette in scene space. Brighter than the page, since these sit on ink. */
const TIER_COLOR: Record<Placed["tier"], string> = {
  own: "#F2F0E9",
  curated: "#C9CBB8",
  visitor: "#9DAB6B"
};

type Props = {
  quote: Placed;
  paused: boolean;
  onOpen: (quote: Placed) => void;
  dimmed: boolean;
};

export function QuoteMesh({ quote, paused, onOpen, dimmed }: Props) {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  // Each quote breathes on its own phase, so the field never pulses together.
  useFrame((state) => {
    if (!group.current || paused) return;
    const t = state.clock.elapsedTime + quote.seed * 100;
    group.current.position.y = quote.worldY + Math.sin(t * 0.22) * 0.18;
    group.current.position.x = quote.worldX + Math.cos(t * 0.17) * 0.12;
    group.current.rotation.z = Math.sin(t * 0.13) * 0.012;
  });

  const scale = hovered ? 1.06 : 1;
  const opacity = dimmed ? quote.opacity * 0.25 : quote.opacity;

  return (
    <group ref={group} position={[quote.worldX, quote.worldY, quote.worldZ]}>
      <Billboard follow lockZ>
        <Text
          font={quote.tier === "own" ? FONT_ITALIC : FONT}
          fontSize={quote.fontSize * scale}
          maxWidth={quote.maxWidth}
          lineHeight={1.22}
          letterSpacing={-0.01}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color={TIER_COLOR[quote.tier]}
          fillOpacity={opacity}
          outlineWidth={0}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onOpen(quote);
          }}
        >
          {quote.body}
        </Text>

        {quote.author_name ? (
          <Text
            font={FONT}
            fontSize={quote.fontSize * 0.36}
            position={[0, -quote.attributionOffset, 0]}
            anchorX="center"
            anchorY="middle"
            color="#6E7A45"
            fillOpacity={opacity * 0.9}
            letterSpacing={0.1}
          >
            {quote.author_name.toUpperCase()}
          </Text>
        ) : null}
      </Billboard>
    </group>
  );
}
