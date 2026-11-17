import type { Island, PassageId } from "@/data/portfolio";
import { getPassage, otherPassages, passageStats, rowsForPassage } from "@/lib/voyage";
import { cn } from "@/lib/utils";

import { IslandRoute } from "./IslandRoute";
import { SkillFalls } from "./SkillFalls";

export function PassageSection({
  passage,
  onChoose,
  onOpen,
}: {
  passage: PassageId;
  onChoose: (id: PassageId) => void;
  onOpen: (island: Island) => void;
}) {
  const p = getPassage(passage);

  return (
    <section id="passage" aria-labelledby="passage-title" className="relative z-10 scroll-mt-0">
      {/* open sea behind every passage */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sea/30 to-transparent" />
        <div className="absolute inset-0 bg-wavelines opacity-70 mask-fade-y" />
      </div>
      {/* passage header */}
      <div className="relative mx-auto max-w-6xl px-5 pb-6 pt-28 md:px-8 md:pt-36">
        <span
          aria-hidden
          className="font-jp pointer-events-none absolute right-2 top-14 select-none text-[11rem] leading-none text-foam/[0.05] md:right-6 md:text-[20rem]"
        >
          {p.kanji}
        </span>
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-haki">
          Route {p.numeral} · {p.routeName}
        </p>
        <h2 id="passage-title" className="font-display mt-3 text-[clamp(3rem,9vw,7.5rem)] leading-[0.88] text-moon text-moon-glow">
          {p.title}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-foam/80 md:text-lg">{p.blurb}</p>
        {passage !== "skills" && (
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-foam/60">
            {passageStats(passage)} · tap an island to open its log
          </p>
        )}
      </div>

      <div key={passage} className="animate-in fade-in-0 slide-in-from-bottom-8 duration-700">
        {passage === "skills" ? <SkillFalls /> : <IslandRoute rows={rowsForPassage(passage)} onOpen={onOpen} />}
      </div>

      {/* next passages */}
      <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-6 md:px-8">
        <p className="text-center font-mono text-xs uppercase tracking-[0.35em] text-foam/70">
          <span className="font-jp text-base tracking-normal text-ember">次の航路</span> · Sail another passage
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {otherPassages(passage).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => onChoose(o.id)}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-foam/15 bg-sea-abyss/70 p-6 text-left backdrop-blur-md transition-all duration-300",
                "hover:-translate-y-1 hover:border-haki/50 hover:shadow-haki focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <span aria-hidden className="font-jp absolute -right-2 -top-6 text-[8rem] leading-none text-foam/[0.06]">
                {o.kanji}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-haki">Route {o.numeral}</span>
              <span className="font-display mt-1 block text-4xl leading-none text-moon">{o.title}</span>
              <span className="mt-3 block max-w-sm text-sm text-foam/75">{o.gateLine}</span>
              <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-foam transition-transform group-hover:translate-x-1">
                Change course <span aria-hidden>→</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
