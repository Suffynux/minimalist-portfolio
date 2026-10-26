"use client";
import Lenis from "lenis";
let lenis: Lenis | null = null;
export function scrollToY(
  top: number,
  { immediate = false }: { immediate?: boolean } = {},
) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis)
    lenis.scrollTo(top, { immediate: immediate || reduced, duration: 1.1 });
  else
    window.scrollTo({
      top,
      behavior: immediate || reduced ? "instant" : "smooth",
    });
}
export function scrollToElement(id: string) {
  const el = document.getElementById(id);
  if (el) scrollToY(el.getBoundingClientRect().top + scrollY);
}
/** Continuous wheel easing. Never snaps or pulls the visitor away from their scroll position. */
export function startSmoothScroll() {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const sync = () => {
    lenis?.destroy();
    lenis = null;
    if (!preference.matches)
      lenis = new Lenis({
        lerp: 0.12,
        smoothWheel: true,
        anchors: { duration: 1.1 },
        autoRaf: true,
      });
  };
  sync();
  preference.addEventListener("change", sync);
  return () => {
    preference.removeEventListener("change", sync);
    lenis?.destroy();
    lenis = null;
  };
}
