import { useCallback, useLayoutEffect, useRef, useState, type MutableRefObject } from "react";

import { passages, type PassageId } from "@/data/portfolio";
import { useFrameLoop } from "@/hooks/use-frame-loop";
import { lerp, smoothstep } from "@/lib/voyage";
import { cn } from "@/lib/utils";

import { channelPath, computeForkLayout, routePath, trunkPath, type ForkLayout, type Pt } from "./fork-geometry";
import { SHIP_SPRITE, type VoyageVariant } from "./voyage-media";

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * The fork, layered on top of the video's final frame. The same ship (cut out of that
 * frame) and the same sea take over seamlessly, then the sea splits into three routes.
 * `progress` is 0–1 through the fork and is written by the parent each frame.
 */
export function ForkScene({
  passage,
  onChoose,
  variant,
  progress,
}: {
  passage: PassageId;
  onChoose: (id: PassageId) => void;
  variant: VoyageVariant;
  progress: MutableRefObject<number>;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const plateRef = useRef<HTMLImageElement | null>(null);
  const shadeRef = useRef<HTMLDivElement | null>(null);
  const shipRef = useRef<HTMLDivElement | null>(null);
  const routeRef = useRef<SVGPathElement | null>(null);
  const wakeRef = useRef<SVGPathElement | null>(null);
  const wakeCoreRef = useRef<SVGPathElement | null>(null);
  const revealRef = useRef<SVGRectElement | null>(null);
  const channelsRef = useRef<SVGGElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const gatesRef = useRef<HTMLDivElement | null>(null);
  const anchors = useRef(new Map<PassageId, HTMLElement>());
  const [layout, setLayout] = useState<ForkLayout | null>(null);
  const layoutRef = useRef<ForkLayout | null>(null);
  const state = useRef({ p: 0, x: 0, y: 0, heading: 0, scale: 1, total: 0, placed: false });

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const r = root.getBoundingClientRect();
    if (r.width < 10 || r.height < 10) return;
    const gates = {} as Record<PassageId, Pt>;
    for (const p of passages) {
      const el = anchors.current.get(p.id);
      const g = el?.getBoundingClientRect();
      gates[p.id] = g ? { x: g.left + g.width / 2 - r.left, y: g.top - r.top } : { x: r.width / 2, y: r.height * 0.85 };
    }
    const next = computeForkLayout(r.width, r.height, variant, gates);
    layoutRef.current = next;
    setLayout(next);
  }, [variant]);

  useLayoutEffect(() => {
    measure();
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(root);
    return () => ro.disconnect();
  }, [measure]);

  // Re-read the route length whenever the route changes.
  useLayoutEffect(() => {
    const route = routeRef.current;
    if (!route || !layout) return;
    state.current.total = route.getTotalLength();
    const dash = `${state.current.total} ${state.current.total + 1}`;
    wakeRef.current?.setAttribute("stroke-dasharray", dash);
    wakeCoreRef.current?.setAttribute("stroke-dasharray", dash);
  }, [layout, passage]);

  useFrameLoop(() => {
    const l = layoutRef.current;
    const route = routeRef.current;
    if (!l || !route) return;
    const s = state.current;
    const pf = progress.current;
    // Smooth only after the hand-off, so the ship sits exactly on the video's ship at first.
    s.p = pf < 0.02 ? pf : lerp(s.p, pf, 0.2);
    const p = s.p;

    const appear = smoothstep(0, 0.05, p);
    if (plateRef.current) plateRef.current.style.opacity = appear.toFixed(3);
    if (shadeRef.current) shadeRef.current.style.opacity = smoothstep(0.04, 0.24, p).toFixed(3);

    // 1. rise from the video's framing to the cruising spot
    const rise = ease(smoothstep(0.03, 0.3, p));
    let x = lerp(l.start.x, l.cruise.x, rise);
    let y = lerp(l.start.y, l.cruise.y, rise);
    let heading = 0;
    let scale = lerp(1, l.cruiseScale, rise);

    // 2. sail the chosen route
    const sail = ease(smoothstep(0.46, 1, p));
    const along = s.total * sail;
    if (sail > 0 && s.total > 0) {
      const pt = route.getPointAtLength(along);
      const a = route.getPointAtLength(Math.min(s.total, along + 8));
      const b = route.getPointAtLength(Math.max(0, along - 8));
      x = pt.x;
      y = pt.y;
      heading = (Math.atan2(-(a.x - b.x), a.y - b.y) * 180) / Math.PI;
      scale = lerp(l.cruiseScale, l.endScale, sail);
    }

    const settled = p < 0.04 || !s.placed;
    const k = settled ? 1 : 0.22;
    s.x = lerp(s.x, x, k);
    s.y = lerp(s.y, y, k);
    s.heading = lerp(s.heading, heading, settled ? 1 : 0.16);
    s.scale = lerp(s.scale, scale, k);
    s.placed = true;

    const ship = shipRef.current;
    if (ship) {
      ship.style.opacity = appear.toFixed(3);
      ship.style.transform = `translate3d(${(s.x - l.box.width / 2).toFixed(1)}px, ${(s.y - l.box.height / 2).toFixed(1)}px, 0) rotate(${s.heading.toFixed(2)}deg) scale(${s.scale.toFixed(4)})`;
    }
    const wakeOffset = String(s.total - along);
    wakeRef.current?.setAttribute("stroke-dashoffset", wakeOffset);
    wakeCoreRef.current?.setAttribute("stroke-dashoffset", wakeOffset);

    // channels flow down from the ship
    const reveal = smoothstep(0.12, 0.42, p);
    revealRef.current?.setAttribute("height", String(lerp(l.cruise.y, l.H, reveal)));
    channelsRef.current?.setAttribute("opacity", smoothstep(0.1, 0.2, p).toFixed(3));

    const title = titleRef.current;
    if (title) {
      const o = smoothstep(0.1, 0.24, p);
      title.style.opacity = o.toFixed(3);
      title.style.transform = `translate3d(0, ${((1 - o) * 24).toFixed(1)}px, 0)`;
    }
    const gates = gatesRef.current;
    if (gates) {
      gates.querySelectorAll<HTMLElement>("[data-gate]").forEach((g, i) => {
        const o = smoothstep(0.22 + i * 0.04, 0.38 + i * 0.04, p);
        g.style.opacity = o.toFixed(3);
        g.style.transform = `translate3d(0, ${((1 - o) * 40).toFixed(1)}px, 0)`;
        g.style.pointerEvents = o > 0.6 ? "auto" : "none";
      });
    }
  }, rootRef);

  const band = layout?.phone ? 34 : 54;

  return (
    <div ref={rootRef} className="absolute inset-0 z-[15]" aria-labelledby="fork-title" role="region">
      {/* the video's sea, with the ship painted out */}
      <img
        ref={plateRef}
        src={variant.sea}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0 }}
        draggable={false}
      />
      <div
        ref={shadeRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_40%,transparent_20%,color-mix(in_oklch,var(--sea-abyss)_70%,transparent)_100%)]"
        style={{ opacity: 0 }}
      />

      {layout && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0"
          width={layout.W}
          height={layout.H}
          viewBox={`0 0 ${layout.W} ${layout.H}`}
        >
          <defs>
            <clipPath id="fork-reveal">
              <rect ref={revealRef} x={0} y={0} width={layout.W} height={0} />
            </clipPath>
            <filter id="fork-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation={layout.phone ? 6 : 9} />
            </filter>
          </defs>
          <g ref={channelsRef} clipPath="url(#fork-reveal)" opacity={0}>
            {/* soft water glow under each channel */}
            <g filter="url(#fork-soft)">
              <path d={trunkPath(layout)} className="fill-none stroke-foam" strokeOpacity={0.12} strokeWidth={band} strokeLinecap="round" />
              {passages.map((p) => (
                <path
                  key={p.id}
                  d={channelPath(layout, p.id)}
                  className={cn("fill-none transition-[stroke-opacity] duration-700", p.id === passage ? "stroke-haki" : "stroke-foam")}
                  strokeOpacity={p.id === passage ? 0.22 : 0.1}
                  strokeWidth={band}
                  strokeLinecap="round"
                />
              ))}
            </g>
            {/* currents */}
            {passages.map((p) => {
              const chosen = p.id === passage;
              return (
                <path
                  key={p.id}
                  d={channelPath(layout, p.id)}
                  className={cn("animate-current fill-none", chosen ? "stroke-haki" : "stroke-foam")}
                  strokeOpacity={chosen ? 0.95 : 0.4}
                  strokeWidth={chosen ? 2.5 : 1.5}
                  strokeDasharray="10 38"
                  strokeLinecap="round"
                />
              );
            })}
            <path
              d={trunkPath(layout)}
              className="animate-current fill-none stroke-haki"
              strokeOpacity={0.8}
              strokeWidth={2.5}
              strokeDasharray="10 38"
              strokeLinecap="round"
            />
          </g>
          {/* the route the ship sails, and the wake it leaves */}
          <path ref={routeRef} d={routePath(layout, passage)} fill="none" stroke="none" />
          <path
            ref={wakeRef}
            d={routePath(layout, passage)}
            className="fill-none stroke-foam"
            strokeOpacity={0.22}
            strokeWidth={layout.phone ? 16 : 22}
            strokeLinecap="round"
            filter="url(#fork-soft)"
          />
          <path
            ref={wakeCoreRef}
            d={routePath(layout, passage)}
            className="fill-none stroke-foam"
            strokeOpacity={0.5}
            strokeWidth={layout.phone ? 2 : 3}
            strokeDasharray="1 0"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* the video's own ship */}
      {layout && (
        <div
          ref={shipRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 origin-center will-change-transform"
          style={{ width: layout.box.width, height: layout.box.height, opacity: 0 }}
        >
          <ShipWake />
          <img src={SHIP_SPRITE} alt="" className="relative h-full w-full select-none" draggable={false} />
        </div>
      )}

      {/* title */}
      <div
        ref={titleRef}
        className="absolute inset-x-5 top-[11%] z-10 text-center md:inset-x-auto md:left-12 md:top-[15%] md:max-w-[30%] md:text-left lg:left-16"
        style={{ opacity: 0 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-haki md:text-sm">
          <span className="font-jp mr-2 text-sm tracking-normal text-ember md:text-base">分岐点</span>The fork
        </p>
        <h2
          id="fork-title"
          className="font-display mt-2 text-[clamp(1.9rem,7.6vw,4.6rem)] leading-[0.95] text-moon text-moon-glow md:mt-3"
        >
          The sea splits in three.
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-sm text-foam/85 md:mx-0 md:mt-3 md:text-base">
          Pick a route. The ship follows.
        </p>
      </div>

      {/* gates */}
      <div
        ref={gatesRef}
        className="absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-10 grid grid-cols-3 items-end gap-2 px-3 md:bottom-[5%] md:gap-6 md:px-10 lg:px-16"
      >
        {passages.map((p) => (
          <div
            key={p.id}
            ref={(el) => {
              if (el) anchors.current.set(p.id, el);
              else anchors.current.delete(p.id);
            }}
            className={cn("mx-auto w-full max-w-[19rem]", p.id === "experience" && "md:-translate-y-4")}
          >
            <div data-gate style={{ opacity: 0 }} className="will-change-transform">
              <Gate id={p.id} chosen={p.id === passage} onChoose={onChoose} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Bow wave and stern wash, drawn in the sprite's own 600×900 box so they turn with the ship. */
function ShipWake() {
  return (
    <svg aria-hidden viewBox="0 0 600 900" className="absolute inset-0 h-full w-full overflow-visible">
      <defs>
        <linearGradient id="stern-wash" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="var(--foam)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--foam)" stopOpacity="0" />
        </linearGradient>
        <filter id="wake-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <g filter="url(#wake-soft)">
        <path d="M300 80 L 250 -420 L 350 -420 Z" fill="url(#stern-wash)" />
        <path d="M300 860 C 230 700 150 520 60 300" className="fill-none stroke-foam" strokeOpacity={0.32} strokeWidth={26} strokeLinecap="round" />
        <path d="M300 860 C 370 700 450 520 540 300" className="fill-none stroke-foam" strokeOpacity={0.32} strokeWidth={26} strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Gate({ id, chosen, onChoose }: { id: PassageId; chosen: boolean; onChoose: (id: PassageId) => void }) {
  const p = passages.find((x) => x.id === id)!;
  return (
    <button
      type="button"
      onClick={() => onChoose(id)}
      aria-pressed={chosen}
      className={cn(
        "group relative block w-full rounded-[6px] bg-parchment px-2.5 pb-2.5 pt-3 text-left text-ink shadow-paper transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haki md:px-5 md:pb-4 md:pt-5",
        chosen ? "ring-2 ring-haki" : "",
      )}
    >
      {/* grommet where the channel meets the tag */}
      <span aria-hidden className="absolute left-1/2 top-1.5 h-2 w-2 -translate-x-1/2 rounded-full border border-ink/40 bg-sea-deep md:top-2 md:h-2.5 md:w-2.5" />
      <span className="flex items-center justify-between gap-1">
        <span className="font-display text-sm text-ember md:text-lg">{p.numeral}</span>
        {chosen && (
          <span className="rounded-sm border border-ember/70 px-1 text-[9px] font-bold uppercase tracking-wider text-ember md:px-1.5 md:text-[11px]">
            On course
          </span>
        )}
      </span>
      <span className="font-display mt-0.5 block text-[clamp(0.95rem,4.1vw,2.1rem)] leading-[1.05]">{p.short}</span>
      <span className="mt-1.5 hidden text-sm leading-snug text-ink/75 md:block">{p.gateLine}</span>
      <span className="mt-1.5 block text-[11px] font-semibold text-ink/80 md:mt-3 md:text-sm">
        {chosen ? "Sailing ↓" : "Set course →"}
      </span>
    </button>
  );
}
