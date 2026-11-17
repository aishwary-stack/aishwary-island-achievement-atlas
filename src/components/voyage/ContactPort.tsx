import { ArrowUpRight, Copy, Instagram, Linkedin, Mail } from "lucide-react";
import { toast } from "sonner";

import { contact, profile } from "@/data/portfolio";
import { useTilt } from "@/hooks/use-tilt";

export function ContactPort() {
  const tilt = useTilt<HTMLDivElement>(8);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      toast.success("Email copied", { description: contact.email });
    } catch {
      toast.error("Couldn’t copy. The email is " + contact.email);
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sea-abyss/70 to-sea-abyss" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-24 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16 md:px-8 md:pb-24 md:pt-32">
        {/* wanted poster */}
        <div className="mx-auto w-full max-w-sm [perspective:1200px]">
          <div
            ref={tilt.ref}
            onPointerMove={tilt.onPointerMove}
            onPointerLeave={tilt.onPointerLeave}
            className="relative rotate-[-2deg] bg-parchment p-6 shadow-deep"
            style={{ transition: "transform 0.25s ease-out" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-grain opacity-25 mix-blend-multiply" />
            <div className="relative border-2 border-ink/70 p-5 text-center">
              <p className="font-display text-6xl leading-none tracking-wide text-ink">WANTED</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.4em] text-ink/70">Builder at large</p>
              <div className="relative mx-auto mt-4 flex aspect-[4/3] w-full items-center justify-center overflow-hidden border-2 border-ink/60 bg-sea-deep">
                <div className="absolute inset-0 bg-wavelines opacity-60" />
                <span className="font-display relative text-8xl text-moon text-haki-glow">AN</span>
                <span className="font-jp absolute bottom-2 right-3 text-sm text-foam/70">創</span>
              </div>
              <p className="font-display mt-4 text-4xl leading-none text-ink">{profile.name.toUpperCase()}</p>
              <p className="mt-3 flex items-center justify-center gap-2 text-ink">
                <span className="font-display text-3xl">฿</span>
                <span className="font-display text-3xl tracking-wider">∞ IDEAS</span>
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/60">Only alive · preferably mid-build</p>
            </div>
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-haki">
            <span className="font-jp text-base tracking-normal text-ember">港</span> · Port of call
          </p>
          <h2 id="contact-title" className="font-display mt-3 text-[clamp(3rem,8vw,6.5rem)] leading-[0.88] text-moon text-moon-glow">
            Drop anchor. Let’s build.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-foam/80 md:text-lg">
            Got a venture, a collab, a product to ship or just a wild idea? Send a message. Aishwary answers faster than
            a Den Den Mushi.
          </p>

          <div className="mt-8 grid gap-3">
            <div className="group flex items-center gap-3 rounded-2xl border border-foam/15 bg-sea-abyss/70 p-2 pl-4 backdrop-blur-md transition-colors hover:border-haki/50">
              <Mail className="h-5 w-5 shrink-0 text-haki" />
              <a
                href={`mailto:${contact.email}`}
                className="min-w-0 flex-1 truncate py-3 text-base font-medium text-moon underline-offset-4 hover:underline md:text-lg"
              >
                {contact.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="flex h-11 items-center gap-2 rounded-xl bg-haki px-4 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copy</span>
              </button>
            </div>
            <div className="grid gap-3">
              <SocialLink href={contact.instagram.url} label="Instagram" handle={contact.instagram.handle} icon={<Instagram className="h-5 w-5" />} />
              <SocialLink href={contact.linkedin.url} label="LinkedIn" handle="Aishwary Nagaria" icon={<Linkedin className="h-5 w-5" />} />
            </div>
          </div>
        </div>
      </div>

      <footer className="relative border-t border-foam/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-foam/60 md:flex-row md:px-8 md:text-left">
          <span>© {new Date().getFullYear()} {profile.name} · Kochi ⇄ Bangalore</span>
          <a href="#top" className="text-foam/80 transition-colors hover:text-haki">
            Back to the start ↑
          </a>
        </div>
      </footer>
    </section>
  );
}

function SocialLink({ href, label, handle, icon }: { href: string; label: string; handle: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-2xl border border-foam/15 bg-sea-abyss/70 p-4 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-haki/50 hover:shadow-haki focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-foam/10 text-haki">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-foam/60">{label}</span>
        <span className="block truncate text-base font-medium text-moon">{handle}</span>
      </span>
      <ArrowUpRight className="h-5 w-5 text-foam/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-haki" />
    </a>
  );
}
