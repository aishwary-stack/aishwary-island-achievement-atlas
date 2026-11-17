import Lenis from "lenis";

/**
 * Inertial wheel scrolling on desktop so the scroll-driven video and ship glide instead
 * of jumping one wheel notch at a time. Touch scrolling stays native.
 */
let lenis: Lenis | null = null;

export function startSmoothScroll() {
  if (typeof window === "undefined" || lenis) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, autoRaf: true, anchors: { offset: 0 }, syncTouch: false });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

export function pauseSmoothScroll(paused: boolean) {
  if (!lenis) return;
  if (paused) lenis.stop();
  else lenis.start();
}

export function scrollToElement(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 3) });
  else el.scrollIntoView({ behavior: "smooth" });
}
