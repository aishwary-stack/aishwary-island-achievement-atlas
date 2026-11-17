import { useEffect, useRef, useState } from "react";

import desktopVideo from "@/assets/grand-line-voyage-720p.mp4.asset.json";
import mobileVideo from "@/assets/grand-line-voyage-480p.mp4.asset.json";
import posterFirst from "@/assets/voyage-poster-first.jpg.asset.json";
import { profile } from "@/data/portfolio";
import { stickyProgress, useFrameLoop } from "@/hooks/use-frame-loop";
import { lerp, smoothstep, windowOpacity } from "@/lib/voyage";
import { cn } from "@/lib/utils";

/**
 * The opening voyage: the real video, scrubbed frame by frame by the scroll position.
 * The file is downloaded once into memory so seeking is instant in every direction.
 */

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
  { id: "sail", start: 0.76, end: 0.94, align: "center" },
];

// Kochi (IIMK BMS campus) → Bangalore (IIMB) as the voyage plays.
const FROM = { lat: 9.9312, lon: 76.2673 };
const TO = { lat: 12.9716, lon: 77.5946 };

type LoadState = { ready: boolean; pct: number; mb: number; streaming: boolean };

export function VideoVoyage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement | null>(null);
  const coordRef = useRef<HTMLSpanElement | null>(null);
  const timeRef = useRef<HTMLSpanElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const motion = useRef({ smooth: 0, mx: 0, my: 0, tx: 0, ty: 0, lastText: "" });
  const [load, setLoad] = useState<LoadState>({ ready: false, pct: 0, mb: 0, streaming: false });

  // Download the video into memory, with progress.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const src = small ? mobileVideo.url : desktopVideo.url;
    const expected = small ? mobileVideo.size : desktopVideo.size;
    const controller = new AbortController();
    let objectUrl: string | null = null;

    const onReady = () => setLoad((s) => ({ ...s, ready: true, pct: 100 }));
    video.addEventListener("loadeddata", onReady);

    (async () => {
      try {
        const res = await fetch(src, { signal: controller.signal });
        if (!res.ok || !res.body) throw new Error(`Video request failed (${res.status})`);
        const total = Number(res.headers.get("content-length")) || expected;
        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let received = 0;
        let lastPct = -1;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            received += value.length;
            const pct = Math.min(99, Math.floor((received / total) * 100));
            if (pct !== lastPct) {
              lastPct = pct;
              setLoad((s) => ({ ...s, pct, mb: received / 1_048_576 }));
            }
          }
        }
        const blob = new Blob(chunks as BlobPart[], { type: "video/mp4" });
        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
        video.load();
      } catch (err) {
        if (controller.signal.aborted) return;
        console.warn("Falling back to streaming the voyage video", err);
        setLoad((s) => ({ ...s, streaming: true }));
        video.src = src;
        video.load();
      }
    })();

    return () => {
      controller.abort();
      video.removeEventListener("loadeddata", onReady);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  // Pointer parallax for the 3D frame.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      motion.current.tx = e.clientX / window.innerWidth - 0.5;
      motion.current.ty = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrameLoop(() => {
    const section = sectionRef.current;
    if (!section) return;
    const p = stickyProgress(section);
    const m = motion.current;

    const video = videoRef.current;
    if (video && video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
      const target = p * (video.duration - 0.06);
      m.smooth = Math.abs(target - m.smooth) < 0.004 ? target : lerp(m.smooth, target, 0.2);
      if (!video.seeking && Math.abs(video.currentTime - m.smooth) > 0.01) {
        video.currentTime = m.smooth;
      }
    }

    m.mx = lerp(m.mx, m.tx, 0.06);
    m.my = lerp(m.my, m.ty, 0.06);

    const tiltOut = smoothstep(0.93, 1, p);
    const frame = frameRef.current;
    if (frame) {
      frame.style.transform = `perspective(1400px) rotateX(${(tiltOut * 32 - m.my * 2.4).toFixed(2)}deg) rotateY(${(m.mx * 3.2).toFixed(2)}deg) scale(${(1.08 - p * 0.05 - tiltOut * 0.12).toFixed(4)}) translateY(${(-tiltOut * 7).toFixed(2)}%)`;
      frame.style.opacity = String(1 - tiltOut * 0.4);
    }

    CHAPTERS.forEach((c, i) => {
      const el = chapterRefs.current[i];
      if (!el) return;
      const o = windowOpacity(p, c.start, c.end, 0.03);
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translate3d(0, ${((1 - o) * 28).toFixed(1)}px, 0)`;
      el.style.filter = o > 0.98 ? "none" : `blur(${((1 - o) * 10).toFixed(1)}px)`;
      el.style.visibility = o < 0.01 ? "hidden" : "visible";
    });

    if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
    if (hintRef.current) hintRef.current.style.opacity = String(1 - smoothstep(0.005, 0.04, p));

    const lat = lerp(FROM.lat, TO.lat, p);
    const lon = lerp(FROM.lon, TO.lon, p);
    const secs = p * 40;
    const text = `${lat.toFixed(2)}°N · ${lon.toFixed(2)}°E`;
    const time = `00:${String(Math.floor(secs)).padStart(2, "0")}`;
    if (text + time !== m.lastText) {
      m.lastText = text + time;
      if (coordRef.current) coordRef.current.textContent = text;
      if (timeRef.current) timeRef.current.textContent = time;
    }
  }, sectionRef);

  const setChapterRef = (i: number) => (el: HTMLDivElement | null) => {
    chapterRefs.current[i] = el;
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Opening voyage"
      className="relative z-10 h-[520vh] bg-sea-abyss md:h-[660vh]"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div
          ref={frameRef}
          className="absolute inset-0 origin-[50%_85%] will-change-transform"
          style={{ transform: "scale(1.08)" }}
        >
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            poster={posterFirst.url}
            aria-hidden
            className="h-full w-full object-cover"
          />
          {/* cinematic vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_45%,transparent_45%,var(--sea-abyss)_100%)] opacity-80" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-sea-abyss/90 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sea-abyss/80 to-transparent" />
        </div>

        {/* HUD */}
        <div className="pointer-events-none absolute inset-x-0 top-20 z-20 flex items-start justify-between px-5 font-mono text-[10px] uppercase tracking-[0.25em] text-foam/70 md:px-10 md:text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-haki">● Log pose locked</span>
            <span ref={coordRef}>9.93°N · 76.27°E</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span>Grand Line · Night</span>
            <span>
              <span ref={timeRef}>00:00</span> / 00:40
            </span>
          </div>
        </div>

        {/* Chapters */}
        <div className="absolute inset-0 z-20">
          <Chapter refFn={setChapterRef(0)} align="center">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-haki md:text-sm">
              Log 01 · <span className="font-jp tracking-normal">航海の始まり</span>
            </p>
            <h1 className="font-display mt-4 text-[clamp(3.4rem,11vw,10rem)] leading-[0.85] text-moon text-moon-glow">
              {profile.name}
            </h1>
            <p className="font-jp mt-3 text-lg text-foam/80 md:text-2xl">{profile.nameJp}</p>
            <p className="mt-6 text-base font-medium text-foam md:text-xl">{profile.tagline}</p>
          </Chapter>

          <Chapter refFn={setChapterRef(1)} align="left">
            <Kicker jp="覇気" en="Will" />
            <h2 className="font-display text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.9] text-moon text-moon-glow">
              Founder <span className="text-haki text-haki-glow">&</span> CTO.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-foam/90 md:text-lg">
              Building <strong className="text-moon">Open Cupboard</strong>. He owns the technical strategy and delivery,
              turning business needs into digital solutions for B2B and B2C clients.
            </p>
          </Chapter>

          <Chapter refFn={setChapterRef(2)} align="right">
            <Kicker jp="二刀" en="Two blades" />
            <h2 className="font-display text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.9] text-moon text-moon-glow">
              Two IIMs.
              <br />
              <span className="text-ember text-ember-glow">One voyage.</span>
            </h2>
            <ul className="mt-5 space-y-2 text-base text-foam/90 md:text-lg">
              <li>
                <strong className="text-moon">IIM Kozhikode</strong> · BMS ’29/30, on campus
              </li>
              <li>
                <strong className="text-moon">IIM Bangalore</strong> · BBA DBE ’29, online
              </li>
            </ul>
          </Chapter>

          <Chapter refFn={setChapterRef(3)} align="left">
            <Kicker jp="仲間" en="The crew" />
            <h2 className="font-display text-[clamp(2.6rem,6.4vw,6rem)] leading-[0.9] text-moon text-moon-glow">
              Every crew needs
              <br />a builder.
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Product Management", "Web Development", "Digital Growth"].map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-haki/40 bg-sea-abyss/60 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-haki backdrop-blur-md"
                >
                  {s}
                </span>
              ))}
            </div>
          </Chapter>

          <Chapter refFn={setChapterRef(4)} align="center">
            <Kicker jp="出航" en="Set sail" center />
            <h2 className="font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.9] text-moon text-moon-glow">
              The sea splits ahead.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base text-foam/90 md:text-lg">
              Three passages are waiting. Keep scrolling and choose your course.
            </p>
          </Chapter>
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="pointer-events-none absolute inset-x-0 bottom-12 z-20 flex flex-col items-center gap-3 text-foam/80 md:bottom-16"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.35em]">Scroll to set sail</span>
          <span className="relative h-10 w-6 rounded-full border border-foam/50">
            <span className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 animate-bounce rounded-full bg-haki" />
          </span>
        </div>

        {/* Timeline */}
        <div className="absolute inset-x-5 bottom-6 z-20 md:inset-x-10">
          <div className="relative h-px w-full bg-foam/20">
            <div ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-haki shadow-haki" />
            {CHAPTERS.slice(1).map((c) => (
              <span
                key={c.id}
                className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-foam/50"
                style={{ left: `${c.start * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Loader */}
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-sea-abyss/85 backdrop-blur-sm transition-opacity duration-700",
            load.ready ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          <Compass />
          <div className="text-center">
            <p className="font-display text-3xl text-moon md:text-4xl">Charting the Grand Line</p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-foam/70">
              {load.streaming ? "Streaming the voyage…" : `${load.pct}% · ${load.mb.toFixed(1)} MB`}
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

function Chapter({
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
        "absolute inset-0 flex px-5 pb-36 will-change-[opacity,transform] md:px-16",
        align === "center" && "items-end justify-center text-center md:items-center md:pb-0",
        align === "left" && "items-end justify-start md:items-center md:pb-0",
        align === "right" && "items-end justify-end text-right md:items-center md:pb-0",
      )}
      style={{ opacity: 0, visibility: "hidden" }}
    >
      <div
        className={cn(
          "relative max-w-3xl",
          align !== "center" &&
            "rounded-3xl bg-gradient-to-br from-sea-abyss/70 to-sea-abyss/20 p-6 backdrop-blur-[2px] md:bg-none md:p-0 md:backdrop-blur-none",
        )}
      >
        {/* soft shadow pool so text stays legible on bright frames */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-24 -inset-y-20 -z-10 hidden bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--sea-abyss)_78%,transparent),transparent)] md:block"
        />
        {children}
      </div>
    </div>
  );
}

function Kicker({ jp, en, center = false }: { jp: string; en: string; center?: boolean }) {
  return (
    <p
      className={cn(
        "mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.35em] text-haki md:text-sm",
        center && "justify-center",
      )}
    >
      <span className="font-jp text-xl tracking-normal text-ember md:text-2xl">{jp}</span>
      <span className="h-px w-8 bg-haki/60" />
      {en}
    </p>
  );
}

function Compass() {
  return (
    <div className="relative h-24 w-24">
      <div className="absolute inset-0 rounded-full border border-foam/30" />
      <div className="absolute inset-2 rounded-full border border-dashed border-haki/40 animate-spin-slow" />
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

