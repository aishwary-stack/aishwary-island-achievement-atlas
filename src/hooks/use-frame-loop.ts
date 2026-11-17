import { useEffect, useRef, type RefObject } from "react";

/**
 * Runs `onFrame` on every animation frame while `targetRef` is near the viewport.
 * The callback is read from a ref, so it can close over fresh props without
 * restarting the loop.
 */
export function useFrameLoop(
  onFrame: (time: number) => void,
  targetRef?: RefObject<Element | null>,
  rootMargin = "25% 0px",
) {
  const cb = useRef(onFrame);
  cb.current = onFrame;

  useEffect(() => {
    let raf = 0;
    let running = false;

    const tick = (t: number) => {
      cb.current(t);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const el = targetRef?.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      start();
      return stop;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start();
        else {
          // Run one more frame so elements settle in their final state.
          cb.current(performance.now());
          stop();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [targetRef, rootMargin]);
}

/** 0 at the moment the section's top hits the viewport top, 1 when its bottom reaches the viewport bottom. */
export function stickyProgress(el: Element) {
  const rect = el.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  if (total <= 0) return rect.top <= 0 ? 1 : 0;
  return Math.min(1, Math.max(0, -rect.top / total));
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
