import { useEffect, useRef, useState } from "react";

import shipImg from "@/assets/ship-sunny.webp";
import { passages, type PassageId } from "@/data/portfolio";
import { stickyProgress, useFrameLoop } from "@/hooks/use-frame-loop";
import { useTilt } from "@/hooks/use-tilt";
import { lerp, passageStats, smoothstep } from "@/lib/voyage";
import { cn } from "@/lib/utils";

import { bandPolygon, CHANNELS, channelPath, shipOnFork, TRUNK } from "./channels";

/**
 * The fork: the ship comes down out of the video and the sea splits into three.
 * Scroll moves the ship; the chosen passage decides which channel it turns into.
 */
export function ForkScene({ passage, onChoose }: { passage: PassageId; onChoose: (id: PassageId) => void }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shipRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const gatesRef = useRef<HTMLDivElement | null>(null);
  const fogRef = useRef<HTMLDivElement | null>(null);
  const state = useRef({ x: 50, y: 12, heading: 0, p: 0 });
  const passageRef = useRef(passage);
  passageRef.current = passage;
  const [aspect, setAspect] = useState(16 / 9);

  useEffect(() => {
    const onResize = () => setAspect(window.innerWidth / Math.max(1, window.innerHeight));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useFrameLoop(() => {
    const section = sectionRef.current;
    if (!section) return;
    const p = stickyProgress(section);
    const s = state.current;
    s.p = lerp(s.p, p, 0.14);
    const target = shipOnFork(passageRef.current, s.p);
    s.x = lerp(s.x, target.x, 0.12);
    s.y = lerp(s.y, target.y, 0.12);
    s.heading = lerp(s.heading, target.heading, 0.1);

    const ship = shipRef.current;
    if (ship) {
      const scale = 0.72 + s.p * 0.26;
      ship.style.left = `${s.x}%`;
      ship.style.top = `${s.y}%`;
      ship.style.transform = `translate(-50%, -50%) rotate(${s.heading.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    }
    const title = titleRef.current;
    if (title) {
      const o = smoothstep(0.04, 0.2, p) * (1 - smoothstep(0.86, 1, p) * 0.4);
      title.style.opacity = o.toFixed(3);
      title.style.transform = `translate3d(0, ${((1 - o) * 30).toFixed(1)}px, 0)`;
    }
    const gates = gatesRef.current;
    if (gates) {
      gates.querySelectorAll<HTMLElement>("[data-gate]").forEach((g, i) => {
        const rise = smoothstep(0.3 + i * 0.06, 0.55 + i * 0.06, p);
        g.style.opacity = rise.toFixed(3);
        g.style.transform = `perspective(900px) translate3d(0, ${((1 - rise) * 90).toFixed(1)}px, 0) rotateX(${((1 - rise) * 70).toFixed(1)}deg)`;
        g.style.pointerEvents = rise > 0.6 ? "auto" : "none";
      });
    }
    if (fogRef.current) fogRef.current.style.opacity = String(1 - smoothstep(0, 0.18, p));
  }, sectionRef);

  return (
    <section
      ref={sectionRef}
      id="fork"
      aria-labelledby="fork-title"
      className="relative z-10 h-[230vh] md:h-[260vh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-ocean">
        <div className="absolute inset-0 bg-wavelines opacity-80" />

        {/* water channels */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="channel-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sea-light)" stopOpacity="0.25" />
              <stop offset="1" stopColor="var(--sea-light)" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id="channel-chosen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--haki)" stopOpacity="0.12" />
              <stop offset="1" stopColor="var(--haki)" stopOpacity="0.34" />
            </linearGradient>
          </defs>
          <polygon
            points={bandPolygon(TRUNK.from, { x: 50, y: 18 }, TRUNK.to, 6, 10, aspect)}
            fill="url(#channel-water)"
          />
          {passages.map((p) => {
            const ch = CHANNELS[p.id];
            const chosen = p.id === passage;
            return (
              <g key={p.id}>
                <polygon
                  points={bandPolygon(TRUNK.to, ch.ctrl, ch.end, 10, p.id === "entrepreneurship" ? 26 : 22, aspect)}
                  fill={chosen ? "url(#channel-chosen)" : "url(#channel-water)"}
                  className="transition-all duration-700"
                />
                <path
                  d={channelPath(p.id)}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  strokeWidth={chosen ? 2.5 : 1.5}
                  strokeDasharray="10 38"
                  className={cn("animate-current", chosen ? "stroke-haki" : "stroke-foam/50")}
                />
              </g>
            );
          })}
          <path
            d={`M ${TRUNK.from.x} ${TRUNK.from.y} L ${TRUNK.to.x} ${TRUNK.to.y}`}
            fill="none"
            vectorEffect="non-scaling-stroke"
            strokeWidth={1.5}
            strokeDasharray="10 38"
            className="animate-current stroke-foam/50"
          />
        </svg>

        {/* fog carried over from the video */}
        <div
          ref={fogRef}
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-sea-abyss to-transparent"
        />

        {/* ship */}
        <div
          ref={shipRef}
          className="absolute z-10 w-[clamp(52px,6.2vw,92px)] will-change-transform"
          style={{ left: "50%", top: "12%", transform: "translate(-50%, -50%)" }}
        >
          <div className="absolute left-1/2 top-[-60%] h-[80%] w-[70%] -translate-x-1/2 rounded-full bg-foam/25 blur-xl" />
          <img
            src={shipImg}
            alt="The crew's ship sailing toward the fork"
            className="relative w-full drop-shadow-[0_18px_24px_var(--sea-abyss)]"
            draggable={false}
          />
        </div>

        {/* title */}
        <div
          ref={titleRef}
          className="absolute inset-x-4 top-[12%] z-20 rounded-3xl bg-sea-abyss/55 p-5 text-center backdrop-blur-sm md:inset-x-auto md:left-12 md:top-[16%] md:max-w-[34%] md:bg-transparent md:p-0 md:text-left md:backdrop-blur-none lg:left-16"
          style={{ opacity: 0 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-haki">
            <span className="font-jp text-base tracking-normal text-ember">分岐点</span> · The fork
          </p>
          <h2 id="fork-title" className="font-display mt-3 text-[clamp(2.2rem,5vw,5rem)] leading-[0.9] text-moon text-moon-glow">
            The Grand Line splits in three.
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-foam/80 md:mx-0 md:text-base">
            Pick a passage and the ship will follow it. You can always come back to sail the others.
          </p>
        </div>

        {/* compass legend */}
        <div aria-hidden className="absolute right-12 top-[17%] z-20 hidden text-right font-mono text-[11px] uppercase tracking-[0.25em] text-foam/60 md:block lg:right-16">
          {passages.map((p) => (
            <p key={p.id} className={cn("mb-2 transition-colors", p.id === passage && "text-haki")}>
              {p.numeral} · {p.id === "education" ? "West" : p.id === "skills" ? "East" : "South"} · {p.title}
            </p>
          ))}
        </div>

        {/* gates */}
        <div
          ref={gatesRef}
          className="absolute inset-x-0 bottom-[4%] z-20 grid grid-cols-3 items-end gap-2 px-3 md:bottom-[6%] md:gap-8 md:px-12"
        >
          {passages.map((p) => (
            <Gate key={p.id} id={p.id} chosen={p.id === passage} onChoose={onChoose} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Gate({ id, chosen, onChoose }: { id: PassageId; chosen: boolean; onChoose: (id: PassageId) => void }) {
  const p = passages.find((x) => x.id === id)!;
  const tilt = useTilt<HTMLButtonElement>(12);
  const centre = id === "entrepreneurship";
  return (
    <div data-gate style={{ opacity: 0 }} className="origin-bottom will-change-transform">
      <div className={cn(centre && "md:-translate-y-6")}>
      <button
        ref={tilt.ref}
        type="button"
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
        onClick={() => onChoose(id)}
        aria-pressed={chosen}
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl border bg-sea-abyss/75 p-3 text-left backdrop-blur-md transition-[box-shadow,border-color,background-color] duration-300 md:rounded-3xl md:p-6",
          "hover:bg-sea-deep/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          chosen ? "border-haki/70 shadow-haki" : "border-foam/15 hover:border-foam/40",
        )}
        style={{ transition: "transform 0.25s ease-out, box-shadow 0.3s, border-color 0.3s" }}
      >
        <span
          aria-hidden
          className="font-jp pointer-events-none absolute -right-2 -top-4 text-[4.5rem] leading-none text-foam/[0.06] md:-right-3 md:-top-6 md:text-[9rem]"
        >
          {p.kanji}
        </span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-haki md:text-xs">
          Route {p.numeral}
          {centre && <span className="hidden rounded-full bg-haki/15 px-2 py-0.5 text-[9px] md:inline">Centre</span>}
        </span>
        <span className="font-display mt-1 block text-xl leading-tight text-moon md:mt-2 md:text-4xl">
          <span className="md:hidden">{p.short}</span>
          <span className="hidden md:inline">{p.title}</span>
        </span>
        <span className="mt-2 hidden text-sm leading-snug text-foam/75 md:block">{p.gateLine}</span>
        <span className="mt-3 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-foam/70 md:mt-5 md:text-xs">
          <span className="hidden md:inline">{passageStats(id)}</span>
          <span className={cn("transition-transform group-hover:translate-x-1", chosen ? "text-haki" : "text-foam")}>
            {chosen ? "Sailing ↓" : "Sail →"}
          </span>
        </span>
      </button>
      </div>
    </div>
  );
}
