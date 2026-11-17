import { useEffect, useRef } from "react";

import { skillGroups } from "@/data/portfolio";
import { cn } from "@/lib/utils";

import { SHIP_SPRITE } from "./voyage-media";

/**
 * Skills passage: the sea runs out and the ship drops down a waterfall.
 * Each rock ledge on the way down holds a group of skills, hung as wooden planks.
 */
export function SkillFalls() {
  const ledgeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = ledgeRefs.current.filter(Boolean) as HTMLDivElement[];
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => (el.dataset["lit"] = "true"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          (e.target as HTMLElement).dataset["lit"] = String(e.isIntersecting || e.boundingClientRect.top < 0);
        }
      },
      { rootMargin: "0px 0px -35% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative pb-10">
      {/* the edge of the world */}
      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <div className="relative h-28 md:h-40">
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-sea-light/50" />
          <div className="absolute inset-x-0 bottom-0 h-2 rounded-full bg-foam/70 blur-[1px]" />
          <div className="absolute inset-x-[8%] bottom-0 h-8 rounded-[50%] bg-foam/30 blur-xl" />
          <p className="absolute inset-x-0 top-4 text-center text-[11px] font-bold uppercase tracking-[0.28em] text-foam/80 md:text-xs">
            <span className="font-jp mr-2 text-base tracking-normal text-ember">世界の果て</span>The edge of the sea
          </p>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <div className="relative">
        {/* the falls: right on phones (Route III came from the right), centre on desktop; they pour into the pool below */}
        <div aria-hidden className="absolute -bottom-14 top-0 right-0 w-[24%] overflow-clip [mask-image:linear-gradient(to_bottom,black_calc(100%-3.5rem),transparent)] md:-bottom-20 md:left-1/2 md:right-auto md:w-[18%] md:-translate-x-1/2">
          <div className="absolute inset-0 bg-falls-base" />
          <div className="absolute inset-0 bg-falls-streaks-slow" />
          <div className="absolute inset-0 bg-falls-streaks" />
          <div className="absolute inset-0 bg-gradient-to-r from-sea-abyss/70 via-transparent to-sea-abyss/70" />
          <div className="absolute inset-y-0 -left-2 w-5 bg-rock-deep [clip-path:polygon(0_0,100%_0,60%_8%,100%_16%,40%_27%,90%_38%,50%_49%,100%_61%,45%_72%,95%_84%,55%_93%,100%_100%,0_100%)]" />
          <div className="absolute inset-y-0 -right-2 w-5 bg-rock-deep [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,45%_92%,0_83%,55%_71%,10%_60%,50%_50%,0_39%,60%_27%,5%_16%,40%_7%)]" />
          {/* the ship riding down */}
          <div className="sticky top-[36vh] z-10 flex justify-center pt-6">
            <div className="relative w-[44px] animate-[bob_1.6s_ease-in-out_infinite] md:w-[60px]">
              <img src={SHIP_SPRITE} alt="" className="w-full drop-shadow-[0_14px_14px_var(--sea-abyss)]" draggable={false} />
              <span className="absolute -left-4 top-1/3 h-3 w-3 animate-float-up rounded-full bg-foam/70" />
              <span className="absolute -right-3 top-1/2 h-2 w-2 animate-float-up rounded-full bg-foam/70 [animation-delay:1.2s]" />
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 animate-float-up rounded-full bg-foam/60 [animation-delay:2.4s]" />
            </div>
          </div>
        </div>

        <div className="relative flex flex-col gap-10 py-12 md:gap-20 md:py-20">
          {skillGroups.map((g, i) => {
            const right = i % 2 === 1;
            return (
              <div
                key={g.id}
                ref={(el) => {
                  ledgeRefs.current[i] = el;
                }}
                data-lit="false"
                className={cn("group/ledge relative mr-[28%] md:mr-0 md:w-[40%]", right ? "md:ml-auto" : "md:mr-auto")}
              >
                <div
                  className={cn(
                    "relative transition-[opacity,translate] duration-700",
                    "translate-y-6 opacity-40 group-data-[lit=true]/ledge:translate-y-0 group-data-[lit=true]/ledge:opacity-100",
                  )}
                >
                  {/* rock ledge with a mossy, broken top edge */}
                  <div className="relative rounded-b-[14px] bg-gradient-to-b from-rock to-rock-deep px-4 pb-5 pt-7 shadow-paper [clip-path:polygon(0_10px,5%_2px,13%_9px,22%_0,31%_7px,42%_1px,53%_8px,63%_0,74%_7px,85%_2px,93%_9px,100%_3px,100%_100%,0_100%)] md:px-6 md:pb-6 md:pt-8">
                    <div aria-hidden className="absolute inset-x-0 top-0 h-3 bg-jungle-deep/90 [clip-path:polygon(0_10px,5%_2px,13%_9px,22%_0,31%_7px,42%_1px,53%_8px,63%_0,74%_7px,85%_2px,93%_9px,100%_3px,100%_100%,0_100%)]" />
                    <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-25 mix-blend-overlay" />
                    <p className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-foam/65">
                      Ledge {String(i + 1).padStart(2, "0")} · <span className="font-jp tracking-normal text-ember">{g.kanji}</span>
                    </p>
                    <h3 className="font-display relative mt-1 text-[clamp(1.6rem,6.6vw,2.5rem)] leading-none text-moon">{g.title}</h3>
                    <ul className="relative mt-4 flex flex-wrap gap-x-2 gap-y-2.5">
                      {g.skills.map((s, si) => (
                        <li
                          key={s}
                          className={cn(
                            "plank rounded-[3px] px-2.5 py-1.5 text-[13px] font-bold leading-tight md:text-sm",
                            si % 2 === 0 ? "-rotate-1" : "rotate-1",
                            s === "Google Sheets" ? "plank-gold text-ink" : "text-moon",
                          )}
                        >
                          {s === "Google Sheets" && <span aria-hidden>★ </span>}
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>

        {/* splashdown pool */}
        <div aria-hidden className="relative h-32 overflow-hidden md:h-44">
          <div className="absolute inset-x-4 top-4 h-20 rounded-[50%] bg-sea-light/40 blur-sm md:inset-x-[20%]" />
          <div className="absolute right-[6%] top-8 h-14 w-[40%] animate-ripple rounded-[50%] border border-foam/40 md:left-1/2 md:right-auto md:w-[34%] md:-translate-x-1/2" />
          <div className="absolute right-[6%] top-8 h-14 w-[40%] animate-ripple rounded-[50%] border border-foam/25 [animation-delay:1.8s] md:left-1/2 md:right-auto md:w-[34%] md:-translate-x-1/2" />
        </div>
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.28em] text-foam/70 md:text-xs">
          Splashdown · {skillGroups.reduce((n, g) => n + g.skills.length, 0)} skills charted
        </p>
      </div>
    </div>
  );
}
