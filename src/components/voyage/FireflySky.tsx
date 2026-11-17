import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/hooks/use-frame-loop";

/**
 * Drifting haki-green sparks, like the embers floating over the sea in the video.
 * One fixed canvas behind every section after the video.
 */
export function FireflySky() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const haki = styles.getPropertyValue("--haki").trim() || "oklch(0.86 0.22 152)";
    const glow = styles.getPropertyValue("--glow").trim() || "oklch(0.9 0.14 85)";
    const foam = styles.getPropertyValue("--foam").trim() || "oklch(0.93 0.03 220)";
    const palette = [haki, haki, haki, glow, foam];

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const count = w < 768 ? 34 : 64;
    const sparks = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.8,
      vy: 0.08 + Math.random() * 0.32,
      sway: Math.random() * Math.PI * 2,
      color: palette[Math.floor(Math.random() * palette.length)] ?? haki,
      phase: Math.random() * Math.PI * 2,
    }));

    const reduced = prefersReducedMotion();
    let raf = 0;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of sparks) {
        if (!reduced) {
          s.y -= s.vy;
          s.x += Math.sin(t / 2400 + s.sway) * 0.18;
          if (s.y < -10) {
            s.y = h + 10;
            s.x = Math.random() * w;
          }
        }
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(t / 900 + s.phase));
        ctx.globalAlpha = twinkle * 0.85;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
