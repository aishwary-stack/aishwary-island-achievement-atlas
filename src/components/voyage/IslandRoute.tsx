import { useCallback, useLayoutEffect, useRef, useState } from "react";

import shipImg from "@/assets/ship-sunny.webp";
import type { Island, IslandRow } from "@/data/portfolio";
import { useFrameLoop } from "@/hooks/use-frame-loop";
import { useTilt } from "@/hooks/use-tilt";
import { clamp, lerp } from "@/lib/voyage";
import { cn } from "@/lib/utils";

import { IslandArt } from "./IslandArt";

type Pt = { x: number; y: number };

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
function smoothPath(pts: Pt[]) {
  if (pts.length < 2) return "";
  const first = pts[0];
  if (!first) return "";
  let d = `M ${first.x.toFixed(1)} ${first.y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p0 = pts[i - 1] ?? p1;
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/**
 * A chain of achievement islands. A sea route winds through every island's dock and
 * the ship sails it as you scroll; islands light up once the ship has reached them.
 */
export function IslandRoute({ rows, onOpen }: { rows: IslandRow[]; onOpen: (island: Island) => void }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const routeRef = useRef<SVGPathElement | null>(null);
  const sailedRef = useRef<SVGPathElement | null>(null);
  const shipRef = useRef<HTMLDivElement | null>(null);
  const docks = useRef(new Map<string, HTMLElement>());
  const stops = useRef(new Map<string, HTMLElement>());
  const [geom, setGeom] = useState({ d: "", w: 0, h: 0 });
  const route = useRef({ total: 0, dockLengths: new Map<string, number>(), len: 0 });

  const islands = rows.flatMap((r) => r.islands);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const box = wrap.getBoundingClientRect();
    const pts: Pt[] = [{ x: box.width / 2, y: 0 }];
    for (const island of islands) {
      const el = docks.current.get(island.id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      pts.push({ x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top });
    }
    pts.push({ x: box.width / 2, y: box.height });
    setGeom({ d: smoothPath(pts), w: box.width, h: box.height });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  useLayoutEffect(() => {
    measure();
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [measure]);

  // Cache total length and how far along the route each dock sits.
  useLayoutEffect(() => {
    const path = routeRef.current;
    const wrap = wrapRef.current;
    if (!path || !wrap || !geom.d) return;
    const total = path.getTotalLength();
    const box = wrap.getBoundingClientRect();
    const samples: { l: number; x: number; y: number }[] = [];
    for (let l = 0; l <= total; l += 8) {
      const pt = path.getPointAtLength(l);
      samples.push({ l, x: pt.x, y: pt.y });
    }
    const dockLengths = new Map<string, number>();
    for (const island of islands) {
      const el = docks.current.get(island.id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2 - box.left;
      const cy = r.top + r.height / 2 - box.top;
      let best = { l: 0, x: 0, y: 0 };
      let bestD = Infinity;
      for (const s of samples) {
        const dd = (s.x - cx) ** 2 + (s.y - cy) ** 2;
        if (dd < bestD) {
          bestD = dd;
          best = s;
        }
      }
      dockLengths.set(island.id, best.l);
    }
    route.current.total = total;
    route.current.dockLengths = dockLengths;
    if (sailedRef.current) sailedRef.current.style.strokeDasharray = `${total} ${total}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geom]);

  useFrameLoop(() => {
    const wrap = wrapRef.current;
    const path = routeRef.current;
    const r = route.current;
    if (!wrap || !path || !r.total) return;
    const box = wrap.getBoundingClientRect();
    const p = clamp((window.innerHeight * 0.55 - box.top) / box.height);
    r.len = lerp(r.len, p * r.total, 0.14);
    const len = r.len;
    const pt = path.getPointAtLength(len);
    const ahead = path.getPointAtLength(Math.min(r.total, len + 6));
    const behind = path.getPointAtLength(Math.max(0, len - 6));
    const heading = (Math.atan2(-(ahead.x - behind.x), ahead.y - behind.y) * 180) / Math.PI;
    if (shipRef.current) {
      shipRef.current.style.transform = `translate(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px) translate(-50%, -50%) rotate(${heading.toFixed(1)}deg)`;
      shipRef.current.style.opacity = p > 0 && p < 1 ? "1" : "0.85";
    }
    if (sailedRef.current) sailedRef.current.style.strokeDashoffset = String(r.total - len);
    for (const [id, dockLen] of r.dockLengths) {
      const el = stops.current.get(id);
      if (!el) continue;
      const visited = len >= dockLen - 30;
      if ((el.dataset["visited"] === "true") !== visited) el.dataset["visited"] = String(visited);
    }
  }, wrapRef);

  let singleIndex = 0;

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-10 md:px-8">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-visible"
        width={geom.w}
        height={geom.h}
        viewBox={`0 0 ${Math.max(1, geom.w)} ${Math.max(1, geom.h)}`}
      >
        <path ref={routeRef} d={geom.d} fill="none" className="stroke-foam/25" strokeWidth={2} strokeDasharray="2 12" strokeLinecap="round" />
        <path
          ref={sailedRef}
          d={geom.d}
          fill="none"
          className="stroke-haki"
          strokeWidth={3}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 6px var(--haki))" }}
        />
      </svg>

      <div
        ref={shipRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 w-[54px] will-change-transform md:w-[74px]"
      >
        <div className="absolute left-1/2 top-[-40%] h-[70%] w-[60%] -translate-x-1/2 rounded-full bg-foam/30 blur-lg" />
        <img src={shipImg} alt="" className="relative w-full drop-shadow-[0_12px_14px_var(--sea-abyss)]" draggable={false} />
      </div>

      <div className="relative z-20 flex flex-col gap-24 md:gap-36">
        {rows.map((row, ri) => {
          if (row.islands.length > 1) {
            return (
              <div key={ri} className="relative">
                <div className="grid grid-cols-2 gap-3 md:gap-20">
                  {row.islands.map((island) => (
                    <IslandStop
                      key={island.id}
                      island={island}
                      layout="stacked"
                      onOpen={onOpen}
                      dockRef={(el) => (el ? docks.current.set(island.id, el) : docks.current.delete(island.id))}
                      stopRef={(el) => (el ? stops.current.set(island.id, el) : stops.current.delete(island.id))}
                    />
                  ))}
                </div>
                {row.strait && (
                  <p className="pointer-events-none absolute left-1/2 top-[18%] hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-haki/30 bg-sea-abyss/70 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-haki backdrop-blur md:block">
                    ⇄ {row.strait}
                  </p>
                )}
                {row.strait && (
                  <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-haki md:hidden">
                    ⇄ {row.strait}
                  </p>
                )}
              </div>
            );
          }
          const island = row.islands[0];
          if (!island) return null;
          const side = singleIndex++ % 2 === 0 ? "left" : "right";
          return (
            <IslandStop
              key={island.id}
              island={island}
              layout={side}
              flagship={island.id === "open-cupboard"}
              onOpen={onOpen}
              dockRef={(el) => (el ? docks.current.set(island.id, el) : docks.current.delete(island.id))}
              stopRef={(el) => (el ? stops.current.set(island.id, el) : stops.current.delete(island.id))}
            />
          );
        })}
      </div>
    </div>
  );
}

function IslandStop({
  island,
  layout,
  flagship = false,
  onOpen,
  dockRef,
  stopRef,
}: {
  island: Island;
  layout: "stacked" | "left" | "right";
  flagship?: boolean;
  onOpen: (island: Island) => void;
  dockRef: (el: HTMLElement | null) => void;
  stopRef: (el: HTMLElement | null) => void;
}) {
  const tilt = useTilt<HTMLButtonElement>(14);
  const stacked = layout === "stacked";

  const art = (
    <button
      ref={tilt.ref}
      type="button"
      onClick={() => onOpen(island)}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      aria-label={`Open the log for ${island.title}`}
      className={cn(
        "group/art relative block cursor-pointer rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        stacked ? "w-full" : flagship ? "w-[82%] md:w-full" : "w-[72%] md:w-full",
        !stacked && layout === "right" && "self-end md:self-auto",
      )}
      style={{ transition: "transform 0.25s ease-out" }}
    >
      {/* ripples */}
      <span aria-hidden className="absolute inset-x-[8%] bottom-[6%] h-[22%] rounded-[50%] border border-foam/25 animate-ripple" />
      <span
        aria-hidden
        className="absolute inset-x-[8%] bottom-[6%] h-[22%] rounded-[50%] border border-haki/30 animate-ripple [animation-delay:2.2s]"
      />
      <span className="block animate-bob transition-[filter] duration-500 group-hover/art:drop-shadow-[0_0_28px_var(--haki)]">
        <IslandArt art={island.art} title={`${island.title} island`} className="drop-shadow-[0_24px_30px_var(--sea-abyss)]" />
      </span>
      {/* dock: where the route touches the island */}
      <span ref={dockRef} aria-hidden className="absolute bottom-[10%] left-1/2 h-1 w-1 -translate-x-1/2" />
      {/* year flag */}
      <span
        aria-hidden
        className={cn("absolute top-[2%] flex items-start", layout === "right" ? "left-[10%]" : "right-[10%]")}
      >
        <span className="h-16 w-[2px] bg-wood md:h-24" />
        <span
          className={cn(
            "font-display -ml-px mt-0 px-2.5 py-1 text-base leading-none transition-colors duration-500 md:px-3 md:py-1.5 md:text-2xl",
            "bg-foam/80 text-sea-abyss [clip-path:polygon(0_0,100%_0,86%_50%,100%_100%,0_100%)]",
            "group-data-[visited=true]/stop:bg-haki",
          )}
        >
          {island.year}
        </span>
      </span>
    </button>
  );

  const card = (
    <div
      className={cn(
        "relative rounded-3xl border border-foam/15 bg-sea-abyss/70 p-5 backdrop-blur-md transition-[border-color,box-shadow,transform] duration-500 md:p-7",
        "group-data-[visited=true]/stop:border-haki/50 group-data-[visited=true]/stop:shadow-haki",
        "translate-y-4 group-data-[visited=true]/stop:translate-y-0",
        stacked && "p-4 md:p-6",
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-haki md:text-xs">
        {island.period}
        {island.location && <span className="text-foam/60"> · {island.location}</span>}
      </p>
      <h3
        className={cn(
          "font-display mt-2 leading-[0.95] text-moon",
          stacked ? "text-2xl md:text-5xl" : flagship ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl",
        )}
      >
        {island.title}
      </h3>
      <p className={cn("mt-1 font-medium text-gold", stacked ? "text-xs md:text-base" : "text-sm md:text-base")}>
        {island.role}
      </p>
      <p className={cn("mt-3 leading-relaxed text-foam/80", stacked ? "hidden text-sm sm:block md:text-base" : "text-sm md:text-base")}>
        {island.brief}
      </p>
      <button
        type="button"
        onClick={() => onOpen(island)}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-haki/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-haki transition-colors hover:bg-haki hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Open the log <span aria-hidden>→</span>
      </button>
    </div>
  );

  if (stacked) {
    return (
      <div ref={stopRef} data-visited="false" className="group/stop flex flex-col items-center gap-4">
        {art}
        {card}
      </div>
    );
  }

  return (
    <div
      ref={stopRef}
      data-visited="false"
      className={cn(
        "group/stop flex flex-col gap-6 md:grid md:grid-cols-2 md:items-center md:gap-16",
        layout === "right" && "md:[&>*:first-child]:order-2",
      )}
    >
      {art}
      {card}
    </div>
  );
}
