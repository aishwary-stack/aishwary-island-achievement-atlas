import { Compass } from "lucide-react";
import { useEffect, useRef } from "react";

import shipImg from "@/assets/ship-sunny.webp";
import { passages, type PassageId } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/** The log pose: fixed header with voyage progress and passage shortcuts. */
export function VoyageNav({ passage, onChoose }: { passage: PassageId; onChoose: (id: PassageId) => void }) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (markerRef.current) markerRef.current.style.left = `${p * 100}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 md:px-8 md:py-4">
        <a
          href="#top"
          className="group flex items-center gap-2 rounded-full border border-foam/15 bg-sea-abyss/60 py-1.5 pl-1.5 pr-4 backdrop-blur-md transition-colors hover:border-haki/50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-haki text-primary-foreground">
            <Compass className="h-4 w-4 transition-transform duration-700 group-hover:rotate-180" />
          </span>
          <span className="font-display text-xl leading-none text-moon">
            <span className="sm:hidden">A. Nagaria</span>
            <span className="hidden sm:inline">Aishwary Nagaria</span>
          </span>
        </a>

        <nav aria-label="Passages" className="flex items-center gap-1 rounded-full border border-foam/15 bg-sea-abyss/60 p-1 backdrop-blur-md">
          {passages.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onChoose(p.id)}
              aria-current={p.id === passage ? "true" : undefined}
              title={p.title}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-full px-3 font-mono text-[11px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                p.id === passage ? "bg-haki text-primary-foreground" : "text-foam/80 hover:bg-foam/10 hover:text-moon",
              )}
            >
              <span className="font-jp text-sm normal-case">{p.kanji}</span>
              <span className="hidden lg:inline">{p.short}</span>
            </button>
          ))}
          <a
            href="#contact"
            className="flex h-8 items-center rounded-full px-3 font-mono text-[11px] uppercase tracking-wider text-foam/80 transition-colors hover:bg-foam/10 hover:text-moon"
          >
            <span className="hidden sm:inline">Contact</span>
            <span className="font-jp text-sm sm:hidden">港</span>
          </a>
        </nav>
      </div>
      {/* voyage progress */}
      <div className="relative mx-4 h-px bg-foam/10 md:mx-8">
        <div ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-haki/40 to-haki" />
        <img
          ref={markerRef}
          src={shipImg}
          alt=""
          aria-hidden
          className="absolute top-1/2 w-3 -translate-x-1/2 -translate-y-1/2 -rotate-90"
        />
      </div>
    </header>
  );
}
