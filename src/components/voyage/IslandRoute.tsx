import { ArrowUpRight } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import type { Island, IslandRow } from "@/data/portfolio";
import { useFrameLoop } from "@/hooks/use-frame-loop";
import { clamp, lerp } from "@/lib/voyage";
import { cn } from "@/lib/utils";

import { IslandArt } from "./IslandArt";
import { RichText } from "./RichText";
import { SHIP_SPRITE } from "./voyage-media";

type Pt = { x: number; y: number };

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
function smoothPath(pts: Pt[]) {
  const first = pts[0];
  if (!first || pts.length < 2) return "";
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
 * A chain of islands. A sea route winds past every island's dock and the video's ship
 * sails it as you scroll; each log gets its year stamped once the ship arrives.
 */
export function IslandRoute({
  rows,
  onOpen,
  entry = 0.5,
}: {
  rows: IslandRow[];
  onOpen: (island: Island) => void;
  /** Where the route enters at the top, as a share of the width (matches the fork channel). */
  entry?: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const routeRef = useRef<SVGPathElement | null>(null);
  const sailedRef = useRef<SVGPathElement | null>(null);
  const shipRef = useRef<HTMLDivElement | null>(null);
  const docks = useRef(new Map<string, HTMLElement>());
  const stops = useRef(new Map<string, Set<HTMLElement>>());
  const [geom, setGeom] = useState({ d: "", w: 0, h: 0 });
  const route = useRef({ total: 0, dockLengths: new Map<string, number>(), len: 0 });

  const islands = rows.flatMap((r) => r.islands);

  const registerStop = (id: string) => (el: HTMLElement | null) => {
    if (!el) return;
    const set = stops.current.get(id) ?? new Set<HTMLElement>();
    set.add(el);
    stops.current.set(id, set);
  };

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const box = wrap.getBoundingClientRect();
    const pts: Pt[] = [{ x: box.width * entry, y: 0 }];
    for (const island of islands) {
      const el = docks.current.get(island.id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      pts.push({ x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top });
    }
    pts.push({ x: box.width / 2, y: box.height });
    setGeom({ d: smoothPath(pts), w: box.width, h: box.height });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, entry]);

  useLayoutEffect(() => {
    measure();
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [measure]);

  // Cache the route length and how far along it each dock sits.
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
      let best = 0;
      let bestD = Infinity;
      for (const s of samples) {
        const dd = (s.x - cx) ** 2 + (s.y - cy) ** 2;
        if (dd < bestD) {
          bestD = dd;
          best = s.l;
        }
      }
      dockLengths.set(island.id, best);
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
    }
    if (sailedRef.current) sailedRef.current.style.strokeDashoffset = String(r.total - len);
    for (const [id, dockLen] of r.dockLengths) {
      const visited = String(len >= dockLen - 30);
      for (const el of stops.current.get(id) ?? []) {
        if (el.dataset["visited"] !== visited) el.dataset["visited"] = visited;
      }
    }
  }, wrapRef);

  let singleIndex = 0;

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-8 md:px-8">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-visible"
        width={geom.w}
        height={geom.h}
        viewBox={`0 0 ${Math.max(1, geom.w)} ${Math.max(1, geom.h)}`}
      >
        <path ref={routeRef} d={geom.d} fill="none" className="stroke-foam/25" strokeWidth={2} strokeDasharray="2 12" strokeLinecap="round" />
        <path ref={sailedRef} d={geom.d} fill="none" className="stroke-foam/70" strokeWidth={3} strokeLinecap="round" />
      </svg>

      <div ref={shipRef} aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 w-[46px] will-change-transform md:w-[62px]">
        <img src={SHIP_SPRITE} alt="" className="w-full drop-shadow-[0_10px_12px_var(--sea-abyss)]" draggable={false} />
      </div>

      <div className="relative z-20 flex flex-col gap-20 md:gap-32">
        {rows.map((row, ri) => {
          if (row.islands.length > 1) {
            return (
              <div key={ri} className="relative">
                <div className="grid grid-cols-2 gap-3 md:gap-20">
                  {row.islands.map((island) => (
                    <IslandArtButton
                      key={island.id}
                      island={island}
                      onOpen={onOpen}
                      dockRef={(el) => (el ? docks.current.set(island.id, el) : docks.current.delete(island.id))}
                      stopRef={registerStop(island.id)}
                    />
                  ))}
                </div>
                {row.strait && (
                  <p className="pointer-events-none mx-auto mt-2 w-fit rounded-sm border border-foam/25 bg-sea-abyss/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-foam/80 md:absolute md:left-1/2 md:top-[30%] md:mt-0 md:-translate-x-1/2">
                    ⇄ {row.strait}
                  </p>
                )}
                <div className="mt-6 grid gap-6 md:mt-10 md:grid-cols-2 md:gap-20">
                  {row.islands.map((island) => (
                    <LogCard key={island.id} island={island} onOpen={onOpen} stopRef={registerStop(island.id)} />
                  ))}
                </div>
              </div>
            );
          }
          const island = row.islands[0];
          if (!island) return null;
          const side = singleIndex++ % 2 === 0 ? "left" : "right";
          return (
            <div
              key={island.id}
              className={cn(
                "flex flex-col gap-5 md:grid md:grid-cols-2 md:items-center md:gap-16",
                side === "right" && "md:[&>*:first-child]:order-2",
              )}
            >
              <IslandArtButton
                island={island}
                onOpen={onOpen}
                align={side}
                dockRef={(el) => (el ? docks.current.set(island.id, el) : docks.current.delete(island.id))}
                stopRef={registerStop(island.id)}
              />
              <LogCard island={island} onOpen={onOpen} stopRef={registerStop(island.id)} tilt={side === "left" ? -1 : 1} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function IslandArtButton({
  island,
  onOpen,
  align,
  dockRef,
  stopRef,
}: {
  island: Island;
  onOpen: (island: Island) => void;
  align?: "left" | "right";
  dockRef: (el: HTMLElement | null) => void;
  stopRef: (el: HTMLElement | null) => void;
}) {
  return (
    <button
      ref={stopRef}
      data-visited="false"
      type="button"
      onClick={() => onOpen(island)}
      aria-label={`Open the log for ${island.title}`}
      className={cn(
        "group/stop relative block cursor-pointer rounded-[2rem] transition-transform duration-300 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        align ? "w-[74%] md:w-full" : "w-full",
        align === "right" && "self-end md:self-auto",
      )}
    >
      <span aria-hidden className="absolute inset-x-[8%] bottom-[6%] h-[22%] animate-ripple rounded-[50%] border border-foam/25" />
      <span aria-hidden className="absolute inset-x-[8%] bottom-[6%] h-[22%] animate-ripple rounded-[50%] border border-foam/15 [animation-delay:2.2s]" />
      <span className="block animate-bob">
        <IslandArt art={island.art} title={`${island.title} island`} className="drop-shadow-[0_24px_30px_var(--sea-abyss)]" />
      </span>
      <span ref={dockRef} aria-hidden className="absolute bottom-[10%] left-1/2 h-1 w-1 -translate-x-1/2" />
    </button>
  );
}

function YearStamp({ year }: { year: string }) {
  return (
    <span
      aria-label={`Year ${year}`}
      className={cn(
        "relative flex h-[3.6rem] w-[3.6rem] shrink-0 items-center justify-center rounded-full border-[3px] border-ember text-ember mix-blend-multiply md:h-20 md:w-20",
        "-rotate-12 scale-150 opacity-0 transition-[scale,opacity] duration-300 ease-[cubic-bezier(.2,1.7,.4,1)]",
        "group-data-[visited=true]/stop:scale-100 group-data-[visited=true]/stop:opacity-90",
      )}
    >
      <span aria-hidden className="absolute inset-[3px] rounded-full border border-dashed border-ember/70" />
      <span className="font-display text-base leading-none md:text-2xl">{year}</span>
    </span>
  );
}

function LogCard({
  island,
  onOpen,
  stopRef,
  tilt = 0,
}: {
  island: Island;
  onOpen: (island: Island) => void;
  stopRef: (el: HTMLElement | null) => void;
  tilt?: number;
}) {
  return (
    <article ref={stopRef} data-visited="false" className="group/stop relative">
      {/* second sheet underneath */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[4px] bg-parchment-deep"
        style={{ transform: `translate(6px, 8px) rotate(${tilt * 1.4}deg)` }}
      />
      <div className="relative overflow-hidden rounded-[4px] bg-parchment p-5 text-ink shadow-paper md:p-7">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-20 mix-blend-multiply" />
        <header className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/60 md:text-xs">
              <span className="whitespace-nowrap">{island.period}</span>
              {island.location && (
                <>
                  {" · "}
                  <span className="whitespace-nowrap font-semibold text-ink/50">{island.location}</span>
                </>
              )}
            </p>
            <h3 className="font-display mt-1.5 text-[clamp(1.55rem,6.4vw,2.6rem)] leading-[1.02] text-ink">
              {island.orgUrl ? (
                <a href={island.orgUrl} target="_blank" rel="noreferrer" className="underline decoration-ember/60 decoration-2 underline-offset-4 hover:decoration-ember">
                  {island.title}
                </a>
              ) : (
                island.title
              )}
            </h3>
            <p className="mt-1 text-sm font-bold text-ember md:text-base">{island.role}</p>
          </div>
          <YearStamp year={island.year} />
        </header>

        <p className="relative mt-4 text-[clamp(1.2rem,5vw,1.75rem)] font-extrabold leading-[1.12] tracking-tight text-ink">
          {island.headline}
        </p>
        <p className="relative mt-2 text-[15px] leading-snug text-ink/80 md:text-base">
          <RichText text={island.brief} linkClassName="text-ink decoration-ember/60" />
        </p>

        {island.stats && (
          <dl className="relative mt-4 grid grid-cols-3 gap-2 border-y border-dashed border-ink/25 py-3">
            {island.stats.map((s) => (
              <div key={s.label} className="min-w-0">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-[clamp(1.15rem,5vw,1.9rem)] leading-none text-ink">{s.value}</dd>
                <dd className="mt-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-ink/55 md:text-[11px]">{s.label}</dd>
              </div>
            ))}
          </dl>
        )}

        <footer className="relative mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={() => onOpen(island)}
            className="inline-flex items-center gap-2 rounded-[3px] bg-ink px-4 py-2.5 text-sm font-bold text-parchment transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          >
            Open the full log <span aria-hidden>→</span>
          </button>
          {island.orgUrl && (
            <a
              href={island.orgUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-bold text-ink underline decoration-ember/60 decoration-2 underline-offset-4 hover:decoration-ember"
            >
              {island.orgUrl.replace(/^https?:\/\//, "")}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </footer>
      </div>
    </article>
  );
}
