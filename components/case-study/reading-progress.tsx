"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * A hairline progress bar pinned under the navbar. On a page this long it is
 * the cheapest way to answer "how much is left?" without a visible scrollbar.
 *
 * Hidden from assistive tech: it duplicates information the scrollbar already
 * conveys, and announcing a continuously changing value would be noise.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

  // Spring-smoothed so the bar glides instead of jittering per scroll event.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reduceMotion ? scrollYProgress : scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-olive"
    />
  );
}
