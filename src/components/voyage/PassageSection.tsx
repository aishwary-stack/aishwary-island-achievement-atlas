import type { Island, PassageId } from "@/data/portfolio";
import { getPassage, otherPassages, passageStats, rowsForPassage } from "@/lib/voyage";

import { IslandRoute } from "./IslandRoute";
import { SkillFalls } from "./SkillFalls";

/** Where each passage's route enters, matching its channel at the fork (left, centre, right). */
const ENTRY: Record<PassageId, number> = { education: 0.2, experience: 0.5, skills: 0.8 };

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
    <section id="passage" aria-labelledby="passage-title" className="relative z-10 bg-sea-deep">
      {/* open sea behind every passage */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sea-deep via-sea/25 to-sea-deep" />
        <div className="absolute inset-0 bg-wavelines opacity-70 mask-fade-y" />
      </div>

      {/* passage header */}
      <div className="relative mx-auto max-w-6xl px-5 pb-4 pt-24 md:px-8 md:pt-32">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-haki md:text-sm">
          Route {p.numeral} · {p.routeName}
        </p>
        <h2
          id="passage-title"
          className="font-display mt-2 text-[clamp(3rem,15vw,8rem)] leading-[0.9] text-moon md:mt-3"
        >
          {p.title}
        </h2>
        <BrushStroke />
        <p className="mt-4 max-w-xl text-base leading-relaxed text-foam/85 md:text-xl">{p.blurb}</p>
        {passage !== "skills" && (
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-foam/60 md:text-sm">
            {passageStats(passage)} · tap one for the full log
          </p>
        )}
      </div>

      <div key={passage} className="relative animate-in fade-in-0 slide-in-from-bottom-8 duration-700">
        {passage === "skills" ? (
          <SkillFalls />
        ) : (
          <IslandRoute rows={rowsForPassage(passage)} onOpen={onOpen} entry={ENTRY[passage]} />
        )}
      </div>

      {/* other passages */}
      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-4 md:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.28em] text-foam/70">
          <span className="font-jp mr-2 text-base tracking-normal text-ember">次の航路</span>Sail another route
        </p>
        <div className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-2">
          {otherPassages(passage).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => onChoose(o.id)}
              className="group relative rounded-[6px] bg-parchment p-5 text-left text-ink shadow-paper transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haki"
            >
              <span className="font-display text-lg text-ember">Route {o.numeral}</span>
              <span className="font-display mt-0.5 block text-[clamp(1.8rem,7vw,2.6rem)] leading-none">{o.title}</span>
              <span className="mt-2 block text-sm leading-snug text-ink/75">{o.gateLine}</span>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold transition-transform group-hover:translate-x-1">
                Change course <span aria-hidden>→</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrushStroke() {
  return (
    <svg aria-hidden viewBox="0 0 320 18" className="mt-2 h-3 w-48 md:h-4 md:w-72" preserveAspectRatio="none">
      <path
        d="M3 11 C 60 4, 120 14, 180 8 S 280 6, 317 10 L 316 14 C 270 12, 210 17, 160 14 S 50 16, 4 15 Z"
        className="fill-ember"
        opacity={0.9}
      />
    </svg>
  );
}
