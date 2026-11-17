import { useCallback, useRef } from "react";

/** Pointer-driven 3D tilt. Spread the returned handlers on the element to tilt. */
export function useTilt<T extends HTMLElement>(max = 10) {
  const ref = useRef<T | null>(null);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      const el = ref.current;
      if (!el || e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateZ(0)`;
    },
    [max],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
