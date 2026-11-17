import { useEffect, useRef } from "react";

import shipImg from "@/assets/ship-sunny.webp";
import { skillGroups } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/**
 * Skills passage: the sea runs out and the ship drops down a waterfall.
 * Each rock ledge on the way down is a group of skills that lights up as the ship passes.
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
      { rootMargin: "0px 0px -45% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative pb-10">
      {/* the edge of the world */}
      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <div className="relative h-40 overflow-hidden rounded-t-[3rem] md:h-56">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sea/60 to-sea-light/70" />
          <div className="absolute inset-x-0 bottom-0 h-3 bg-foam/70 blur-[2px]" />
          <div className="absolute inset-x-[10%] bottom-0 h-10 rounded-[50%] bg-foam/40 blur-xl" />
          <p className="absolute inset-x-0 top-8 text-center font-mono text-[11px] uppercase tracking-[0.35em] text-foam/80">
            <span className="font-jp text-base tracking-normal text-ember">世界の果て</span> · The edge of the sea
          </p>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        {/* the falls */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-4 w-[26%] overflow-clip md:left-1/2 md:w-[22%] md:-translate-x-1/2"
        >
          <div className="absolute inset-0 bg-falls-base" />
          <div className="absolute inset-0 bg-falls-streaks-slow" />
          <div className="absolute inset-0 bg-falls-streaks" />
          <div className="absolute inset-0 bg-gradient-to-r from-sea-abyss/75 via-transparent to-sea-abyss/75" />
          <div className="absolute inset-y-0 -left-2 w-5 bg-rock-deep [clip-path:polygon(0_0,100%_0,60%_8%,100%_16%,40%_27%,90%_38%,50%_49%,100%_61%,45%_72%,95%_84%,55%_93%,100%_100%,0_100%)]" />
          <div className="absolute inset-y-0 -right-2 w-5 bg-rock-deep [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,45%_92%,0_83%,55%_71%,10%_60%,50%_50%,0_39%,60%_27%,5%_16%,40%_7%)]" />
          {/* the ship riding down */}
          <div className="sticky top-[38vh] z-10 flex justify-center pt-6">
            <div className="relative w-[58px] animate-[bob_1.6s_ease-in-out_infinite] md:w-[76px]">
              <img src={shipImg} alt="" className="w-full drop-shadow-[0_14px_14px_var(--sea-abyss)]" draggable={false} />
              <span className="absolute -left-4 top-1/3 h-3 w-3 rounded-full bg-foam/70 animate-float-up" />
              <span className="absolute -right-3 top-1/2 h-2 w-2 rounded-full bg-foam/70 animate-float-up [animation-delay:1.2s]" />
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 rounded-full bg-foam/60 animate-float-up [animation-delay:2.4s]" />
            </div>
          </div>
        </div>

        <div className="relative flex flex-col gap-14 py-16 md:gap-24 md:py-24">
          {skillGroups.map((g, i) => {
            const right = i % 2 === 1;
            return (
              <div
                key={g.id}
                ref={(el) => {
                  ledgeRefs.current[i] = el;
                }}
                data-lit="false"
                className={cn(
                  "group/ledge relative ml-[30%] md:ml-0 md:w-[39%]",
                  right ? "md:ml-auto" : "md:mr-auto",
                )}
              >
                {/* spray bridge to the falls */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-10 hidden h-px w-[18%] bg-gradient-to-r from-foam/0 via-foam/50 to-foam/0 md:block",
                    right ? "-left-[18%]" : "-right-[18%]",
                  )}
                />
                <div
                  className={cn(
                    "relative overflow-hidden rounded-[1.75rem] border border-foam/10 bg-rock-deep/80 p-5 backdrop-blur-md transition-all duration-700 md:p-7",
                    "opacity-50 group-data-[lit=true]/ledge:opacity-100",
                    "group-data-[lit=true]/ledge:border-haki/45 group-data-[lit=true]/ledge:shadow-haki",
                    "translate-y-6 group-data-[lit=true]/ledge:translate-y-0",
                  )}
                >
                  <span
                    aria-hidden
                    className="font-jp pointer-events-none absolute -right-2 -top-5 text-[6rem] leading-none text-foam/[0.06] md:text-[8rem]"
                  >
                    {g.kanji}
                  </span>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-haki md:text-xs">
                    Ledge {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display mt-1 text-3xl leading-none text-moon md:text-4xl">{g.title}</h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {g.skills.map((s, si) => (
                      <li
                        key={s}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm transition-all duration-500",
                          s === "Google Sheets"
                            ? "border-gold/60 bg-gold/15 text-gold"
                            : "border-foam/20 bg-sea-abyss/50 text-foam/90",
                          "group-data-[lit=true]/ledge:border-haki/35",
                        )}
                        style={{ transitionDelay: `${si * 60}ms` }}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* splashdown pool */}
        <div aria-hidden className="relative h-40 md:h-52">
          <div className="absolute left-4 top-0 w-[26%] md:left-1/2 md:w-[22%] md:-translate-x-1/2">
            <div className="h-10 bg-gradient-to-b from-foam/50 to-transparent" />
          </div>
          <div className="absolute inset-x-4 top-6 h-24 rounded-[50%] bg-sea-light/40 blur-sm md:inset-x-[20%]" />
          <div className="absolute left-[16%] top-10 h-16 w-[30%] rounded-[50%] border border-foam/40 animate-ripple md:left-1/2 md:w-[34%] md:-translate-x-1/2" />
          <div className="absolute left-[16%] top-10 h-16 w-[30%] rounded-[50%] border border-haki/30 animate-ripple [animation-delay:1.8s] md:left-1/2 md:w-[34%] md:-translate-x-1/2" />
        </div>
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.35em] text-foam/70">
          Splashdown · every ledge charted
        </p>
      </div>
    </div>
  );
}
