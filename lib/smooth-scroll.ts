"use client";

import Lenis from "lenis";
import Snap from "lenis/snap";

let lenis: Lenis | null = null;

/** Scrolls with the same easing as the wheel when smooth scrolling is running. */
export function scrollToY(top: number, { immediate = false }: { immediate?: boolean } = {}) {
  if (lenis) lenis.scrollTo(top, { immediate, duration: 1.15, force: true });
  else window.scrollTo({ top, behavior: immediate ? "instant" : "smooth" });
}

export function scrollToElement(id: string) {
  const el = document.getElementById(id);
  if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY);
}

/**
 * Wheel and trackpad scrolling glide instead of stepping, then settle on the
 * nearest chapter. Touch keeps the native momentum, which already feels right.
 */
export function startSmoothScroll(getSnapPoints: () => number[]) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { duration: 1.15 }, stopInertiaOnNavigate: true, autoRaf: true });
  const snap = new Snap(lenis, { type: "proximity", distanceThreshold: "28%", debounce: 260, duration: 0.85, easing: t => 1 - Math.pow(1 - t, 3) });
  let removers: (() => void)[] = [];
  const refresh = () => {
    removers.forEach(remove => remove());
    removers = getSnapPoints().map(point => snap.add(Math.round(point)));
  };
  refresh();
  const observer = new ResizeObserver(refresh);
  observer.observe(document.body);
  return () => {
    observer.disconnect();
    snap.destroy();
    lenis?.destroy();
    lenis = null;
  };
}
