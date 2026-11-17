import { ArrowUpRight, MapPin, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import type { Island } from "@/data/portfolio";

import { IslandArt } from "./IslandArt";

/** The full logbook entry for an island, written on parchment. */
export function IslandDialog({ island, onClose }: { island: Island | null; onClose: () => void }) {
  return (
    <DialogPrimitive.Root open={!!island} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-sea-abyss/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[90svh] w-[calc(100vw-1.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[1.75rem] bg-parchment shadow-deep outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-6"
        >
          {island && (
            <>
              <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.18] mix-blend-multiply" />
              <div className="relative overflow-y-auto px-6 pb-8 pt-6 md:px-10 md:pb-10 md:pt-8">
                <DialogPrimitive.Close className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink/70 transition-colors hover:bg-ink hover:text-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close log</span>
                </DialogPrimitive.Close>

                <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                  <div className="relative w-36 shrink-0 rounded-[1.5rem] bg-sea-deep p-2 shadow-deep sm:w-44">
                    <IslandArt art={island.art} />
                  </div>
                  <div className="min-w-0 pr-8">
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember">
                      Ship’s log · {island.year}
                    </p>
                    <DialogPrimitive.Title className="font-display mt-1 text-4xl leading-[0.95] text-ink md:text-5xl">
                      {island.title}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="mt-2 text-base font-semibold text-ink/85">
                      {island.role}
                    </DialogPrimitive.Description>
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/70">
                      <span>{island.org}</span>
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

                <div className="my-6 h-px w-full bg-[repeating-linear-gradient(90deg,var(--ink)_0_6px,transparent_6px_12px)] opacity-25" />

                <div className="space-y-4 text-[15px] leading-relaxed text-ink/90 md:text-base">
                  {island.story.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <h4 className="mt-7 font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60">Treasure found</h4>
                <ul className="mt-3 space-y-2">
                  {island.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-[15px] text-ink/90">
                      <span aria-hidden className="mt-0.5 text-ember">✦</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {island.tags.map((t) => (
                    <span key={t} className="rounded-full border border-ink/20 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-ink/75">
                      {t}
                    </span>
                  ))}
                </div>

                {island.link && (
                  <a
                    href={island.link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-parchment transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
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
