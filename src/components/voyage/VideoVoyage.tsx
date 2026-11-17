import { useEffect, useRef, useState } from "react";

import type { PassageId } from "@/data/portfolio";
import { profile } from "@/data/portfolio";
import { stickyProgress, useFrameLoop } from "@/hooks/use-frame-loop";
import { clamp, lerp, smoothstep, windowOpacity } from "@/lib/voyage";
import { cn } from "@/lib/utils";

import { ForkScene } from "./ForkScene";
import { RichText } from "./RichText";
import { ScrubVideo, type ScrubHandle, type ScrubLoad } from "./ScrubVideo";
import { pickVariant, type VoyageVariant } from "./voyage-media";

/**
 * The opening voyage: one pinned stage. The real video is scrubbed by scroll, then the
 * fork takes over on top of the video's last frame, with the same ship and the same sea.
 */

/** Share of the stage's scroll spent on the video; the rest is the fork. */
const VIDEO_SHARE = 0.72;
/** The video reaches its last frame slightly before the fork begins. */
const VIDEO_END_AT = 0.96;

interface Chapter {
  id: string;
  start: number;
  end: number;
  align: "center" | "left" | "right";
}

const CHAPTERS: Chapter[] = [
  { id: "name", start: -1, end: 0.1, align: "center" },
  { id: "founder", start: 0.15, end: 0.29, align: "left" },
  { id: "iims", start: 0.33, end: 0.47, align: "right" },
  { id: "crew", start: 0.52, end: 0.69, align: "left" },
  { id: "sail", start: 0.76, end: 0.92, align: "center" },
];

// Kochi (IIMK campus) → Bangalore (IIMB) as the voyage plays.
const FROM = { lat: 9.9312, lon: 76.2673 };
const TO = { lat: 12.9716, lon: 77.5946 };

export function VideoVoyage({ passage, onChoose }: { passage: PassageId; onChoose: (id: PassageId) => void }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrubRef = useRef<ScrubHandle | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const vignetteRef = useRef<HTMLDivElement | null>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);
  const coordRef = useRef<HTMLSpanElement | null>(null);
  const timeRef = useRef<HTMLSpanElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const forkProgress = useRef(0);
  const lastText = useRef("");
  const [variant, setVariant] = useState<VoyageVariant | null>(null);
  const [load, setLoad] = useState<ScrubLoad>({ ready: false, pct: 0, mb: 0, hd: false });

  // Pick the framing once we know the screen; switch only if the orientation flips.
  useEffect(() => {
    const choose = () =>
      setVariant((current) => {
        const next = pickVariant(window.innerWidth, window.innerHeight);
        return current?.id === next.id ? current : next;
      });
    choose();
    window.addEventListener("resize", choose);
    return () => window.removeEventListener("resize", choose);
  }, []);

  useFrameLoop(() => {
    const section = sectionRef.current;
    if (!section) return;
    const p = stickyProgress(section);
    const pv = clamp(p / VIDEO_SHARE);
    forkProgress.current = clamp((p - VIDEO_SHARE) / (1 - VIDEO_SHARE));

    scrubRef.current?.update(clamp(pv / VIDEO_END_AT));

    // Settle to exactly 1:1 framing before the hand-off so the ship lines up.
    const frame = frameRef.current;
    if (frame) frame.style.transform = `scale(${(1.06 - 0.06 * smoothstep(0, 0.9, pv)).toFixed(4)})`;
    if (vignetteRef.current) vignetteRef.current.style.opacity = (1 - smoothstep(0.9, 1, pv)).toFixed(3);

    CHAPTERS.forEach((c, i) => {
      const el = chapterRefs.current[i];
      if (!el) return;
      const o = windowOpacity(pv, c.start, c.end, 0.03);
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translate3d(0, ${((1 - o) * 26).toFixed(1)}px, 0)`;
      el.style.visibility = o < 0.01 ? "hidden" : "visible";
    });

    if (barRef.current) barRef.current.style.transform = `scaleX(${pv.toFixed(4)})`;
    const hud = (1 - smoothstep(0.92, 1, pv)).toFixed(3);
    if (hudRef.current) hudRef.current.style.opacity = hud;
    if (timelineRef.current) timelineRef.current.style.opacity = hud;
    if (hintRef.current) hintRef.current.style.opacity = String(1 - smoothstep(0.005, 0.04, pv));

    const text = `${lerp(FROM.lat, TO.lat, pv).toFixed(2)}°N · ${lerp(FROM.lon, TO.lon, pv).toFixed(2)}°E`;
    const time = `00:${String(Math.floor(pv * 40)).padStart(2, "0")}`;
    if (text + time !== lastText.current) {
      lastText.current = text + time;
      if (coordRef.current) coordRef.current.textContent = text;
      if (timeRef.current) timeRef.current.textContent = time;
    }
  }, sectionRef);

  const setChapterRef = (i: number) => (el: HTMLDivElement | null) => {
    chapterRefs.current[i] = el;
  };

  return (
    <section ref={sectionRef} aria-label="Opening voyage" className="relative z-10 h-[760svh] bg-sea-abyss md:h-[880vh]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div ref={frameRef} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.06)" }}>
          {variant && <ScrubVideo ref={scrubRef} variant={variant} onLoad={setLoad} />}
        </div>
        {/* cinematic vignette over the video only; it fades before the hand-off */}
        <div ref={vignetteRef} aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_45%,transparent_50%,var(--sea-abyss)_100%)] opacity-70" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-sea-abyss/85 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-sea-abyss/75 to-transparent" />
        </div>

        {variant && <ForkScene passage={passage} onChoose={onChoose} variant={variant} progress={forkProgress} />}

        {/* HUD */}
        <div
          ref={hudRef}
          className="pointer-events-none absolute inset-x-0 top-[4.5rem] z-20 flex items-start justify-between px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-foam/70 md:top-20 md:px-10 md:text-xs"
        >
          <div className="flex flex-col gap-1">
            <span className="text-haki">● Log pose locked</span>
            <span ref={coordRef} className="tabular-nums">9.93°N · 76.27°E</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="flex items-center gap-1.5">
              Grand Line
              <span
                className={cn(
                  "rounded-sm border px-1 py-px text-[9px] tracking-wider transition-colors duration-700",
                  load.hd ? "border-haki/70 text-haki" : "border-foam/30 text-foam/50",
                )}
              >
                HD
              </span>
            </span>
            <span className="tabular-nums">
              <span ref={timeRef}>00:00</span> / 00:40
            </span>
          </div>
        </div>

        {/* Chapters (only their text takes clicks, so the fork's gates stay tappable) */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <ChapterCard refFn={setChapterRef(0)} align="center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-haki md:text-sm">
              Log 01 · <span className="font-jp tracking-normal">航海の始まり</span>
            </p>
            <h1 className="font-display mt-3 text-[clamp(2.7rem,12.5vw,9.5rem)] leading-[0.9] text-moon text-moon-glow md:mt-4">
              {profile.name}
            </h1>
            <p className="font-jp mt-2 text-base text-foam/75 md:mt-3 md:text-2xl">{profile.nameJp}</p>
            <p className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[clamp(1rem,4.4vw,1.6rem)] font-semibold text-moon md:mt-6">
              {profile.taglineParts.map((part, i) => (
                <span key={part} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-haki" />}
                  <span className={cn(i === 2 && "text-haki")}>{part}</span>
                </span>
              ))}
            </p>
          </ChapterCard>

          <ChapterCard refFn={setChapterRef(1)} align="left">
            <Kicker jp="覇気" en="Founder & CTO" />
            <h2 className="font-display text-[clamp(2.4rem,9vw,6.5rem)] leading-[0.92] text-moon text-moon-glow">
              ₹0 → ₹1 Lakh.
              <br />
              <span className="text-haki text-haki-glow">In 3 weeks.</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-foam/90 md:mt-5 md:text-lg">
              <RichText text="Bootstrapped Open Cupboard: 3D websites, web apps and automations for brands." linkClassName="text-moon decoration-haki" />
            </p>
          </ChapterCard>

          <ChapterCard refFn={setChapterRef(2)} align="right">
            <Kicker jp="二刀" en="Two blades" right />
            <h2 className="font-display text-[clamp(2.4rem,9vw,6.5rem)] leading-[0.92] text-moon text-moon-glow">
              Two IIMs.
              <br />
              <span className="text-ember text-ember-glow">One voyage.</span>
            </h2>
            <ul className="mt-4 space-y-1.5 text-base text-foam/90 md:mt-5 md:text-lg">
              <li>
                <strong className="text-moon">IIM Kozhikode</strong> · BMS, first batch
              </li>
              <li>
                <strong className="text-moon">IIM Bangalore</strong> · BBA DBE
              </li>
            </ul>
          </ChapterCard>

          <ChapterCard refFn={setChapterRef(3)} align="left">
            <Kicker jp="仲間" en="Captain" />
            <h2 className="font-display text-[clamp(2.3rem,8.4vw,6rem)] leading-[0.92] text-moon text-moon-glow">
              Leads crews.
              <br />
              Ships products.
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {["12-member team", "43K → 370K+ subs", "5.8K → 37K+ learners"].map((s) => (
                <li
                  key={s}
                  className="rounded-sm border border-haki/50 bg-sea-abyss/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-haki md:text-sm"
                >
                  {s}
                </li>
              ))}
            </ul>
          </ChapterCard>

          <ChapterCard refFn={setChapterRef(4)} align="center">
            <Kicker jp="出航" en="Set sail" center />
            <h2 className="font-display text-[clamp(2.4rem,9vw,7rem)] leading-[0.92] text-moon text-moon-glow">
              Three routes ahead.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-foam/90 md:mt-5 md:text-lg">
              Keep scrolling. The sea is about to split.
            </p>
          </ChapterCard>
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="pointer-events-none absolute inset-x-0 bottom-9 z-20 flex flex-col items-center gap-3 text-foam/80 md:bottom-16"
        >
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.3em] md:inline">Scroll to set sail</span>
          <span className="relative hidden h-10 w-6 rounded-full border border-foam/50 md:block">
            <span className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 animate-bounce rounded-full bg-haki" />
          </span>
          <span aria-hidden className="flex animate-bounce flex-col items-center leading-none text-haki md:hidden">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="pointer-events-none absolute inset-x-4 bottom-5 z-20 md:inset-x-10">
          <div className="relative h-px w-full bg-foam/20">
            <div ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-haki" />
          </div>
        </div>

        {/* Loader: waits only for the quick version; HD fades in later */}
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-sea-abyss transition-opacity duration-700",
            load.ready ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          <Compass />
          <div className="px-6 text-center">
            <p className="font-display text-3xl text-moon md:text-4xl">Charting the Grand Line</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-foam/70 tabular-nums">
              {load.pct}% · {load.mb.toFixed(1)} MB
            </p>
          </div>
          <div className="h-px w-56 overflow-hidden bg-foam/15">
            <div className="h-full bg-haki transition-[width] duration-300" style={{ width: `${load.pct}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ChapterCard({
  refFn,
  align,
  children,
}: {
  refFn: (el: HTMLDivElement | null) => void;
  align: Chapter["align"];
  children: React.ReactNode;
}) {
  return (
    <div
      ref={refFn}
      className={cn(
        "pointer-events-none absolute inset-0 flex px-5 pb-24 will-change-[opacity,transform] md:px-16 md:pb-0",
        align === "center" && "items-end justify-center text-center md:items-center",
        align === "left" && "items-end justify-start md:items-center",
        align === "right" && "items-end justify-end text-right md:items-center",
      )}
      style={{ opacity: 0, visibility: "hidden" }}
    >
      <div className="pointer-events-auto relative w-full max-w-3xl md:w-auto">
        {/* soft shadow pool so text stays legible on bright frames */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-16 -inset-y-14 -z-10 bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--sea-abyss)_80%,transparent),transparent)] md:-inset-x-24 md:-inset-y-20"
        />
        {children}
      </div>
    </div>
  );
}

function Kicker({ jp, en, center = false, right = false }: { jp: string; en: string; center?: boolean; right?: boolean }) {
  return (
    <p
      className={cn(
        "mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-haki md:mb-4 md:text-sm",
        center && "justify-center",
        right && "justify-end",
      )}
    >
      <span className="font-jp text-lg tracking-normal text-ember md:text-2xl">{jp}</span>
      <span className="h-px w-8 bg-haki/60" />
      {en}
    </p>
  );
}

function Compass() {
  return (
    <div className="relative h-24 w-24">
      <div className="absolute inset-0 rounded-full border border-foam/30" />
      <div className="absolute inset-2 animate-spin-slow rounded-full border border-dashed border-haki/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-1.5 animate-[spin_2.4s_cubic-bezier(.6,0,.4,1)_infinite]">
          <div className="h-1/2 w-full rounded-t-full bg-ember" />
          <div className="h-1/2 w-full rounded-b-full bg-foam/70" />
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
    </div>
  );
}
