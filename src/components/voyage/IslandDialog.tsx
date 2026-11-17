import { ArrowUpRight, MapPin, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useEffect } from "react";

import type { Island } from "@/data/portfolio";
import { pauseSmoothScroll } from "@/lib/smooth-scroll";

import { IslandArt } from "./IslandArt";
import { RichText } from "./RichText";

/** The full logbook entry for an island, written on parchment. */
export function IslandDialog({ island, onClose }: { island: Island | null; onClose: () => void }) {
  useEffect(() => {
    pauseSmoothScroll(!!island);
    return () => pauseSmoothScroll(false);
  }, [island]);

  return (
    <DialogPrimitive.Root open={!!island} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-sea-abyss/85 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[88svh] w-[calc(100vw-1.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[6px] bg-parchment text-ink shadow-poster outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-6">
          {island && (
            <>
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.2] mix-blend-multiply" />
              <div data-lenis-prevent className="relative overflow-y-auto overscroll-contain px-5 pb-8 pt-5 md:px-10 md:pb-10 md:pt-8">
                <DialogPrimitive.Close className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ink/25 bg-parchment text-ink/75 transition-colors hover:bg-ink hover:text-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink md:right-4 md:top-4">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close log</span>
                </DialogPrimitive.Close>

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <div className="relative w-32 shrink-0 rounded-[6px] bg-sea-deep p-2 sm:w-44">
                    <IslandArt art={island.art} />
                  </div>
                  <div className="min-w-0 pr-10">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember">Ship’s log · {island.year}</p>
                    <DialogPrimitive.Title className="font-display mt-1 text-[clamp(1.9rem,8vw,3rem)] leading-[1] text-ink">
                      {island.orgUrl ? (
                        <a href={island.orgUrl} target="_blank" rel="noreferrer" className="underline decoration-ember/60 decoration-2 underline-offset-4">
                          {island.title}
                        </a>
                      ) : (
                        island.title
                      )}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="mt-1.5 text-base font-bold text-ink/85">{island.role}</DialogPrimitive.Description>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/70">
                      <span>
                        <RichText text={island.org} linkClassName="text-ink decoration-ember/60" />
                      </span>
                      <span aria-hidden>·</span>
                      <span>{island.period}</span>
                      {island.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {island.location}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-[clamp(1.3rem,5.4vw,1.9rem)] font-extrabold leading-[1.1] tracking-tight">{island.headline}</p>

                {island.stats && (
                  <dl className="mt-4 grid grid-cols-3 gap-3 border-y border-dashed border-ink/25 py-3">
                    {island.stats.map((s) => (
                      <div key={s.label} className="min-w-0">
                        <dt className="sr-only">{s.label}</dt>
                        <dd className="font-display text-[clamp(1.2rem,5.4vw,2rem)] leading-none">{s.value}</dd>
                        <dd className="mt-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-ink/55 md:text-[11px]">{s.label}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="mt-5 space-y-3.5 text-[15px] leading-relaxed text-ink/90 md:text-base">
                  {island.story.map((para, i) => (
                    <p key={i}>
                      <RichText text={para} linkClassName="text-ink decoration-ember/60" />
                    </p>
                  ))}
                </div>

                <h4 className="mt-7 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/60">Treasure found</h4>
                <ul className="mt-3 space-y-2">
                  {island.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-[15px] text-ink/90">
                      <span aria-hidden className="mt-0.5 text-ember">✦</span>
                      <span>
                        <RichText text={h} linkClassName="text-ink decoration-ember/60" />
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {island.tags.map((t) => (
                    <span key={t} className="rounded-sm border border-ink/25 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-ink/75">
                      {t}
                    </span>
                  ))}
                </div>

                {island.link && (
                  <a
                    href={island.link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-7 inline-flex items-center gap-2 rounded-[3px] bg-ink px-5 py-3 text-sm font-bold text-parchment transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                  >
                    {island.link.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
