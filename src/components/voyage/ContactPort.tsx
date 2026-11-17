import { ArrowUpRight, Copy, Globe, Instagram, Linkedin, Mail } from "lucide-react";
import { toast } from "sonner";

import { contact, OPEN_CUPBOARD_URL, portraits, profile } from "@/data/portfolio";

export function ContactPort() {
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      toast.success("Email copied", { description: contact.email });
    } catch {
      toast.error("Couldn’t copy. The email is " + contact.email);
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative z-10 overflow-hidden bg-sea-deep">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-sea-deep via-sea-abyss/70 to-sea-abyss" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 pb-16 pt-20 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-14 md:px-8 md:pb-24 md:pt-28">
        <PosterWall />

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-haki md:text-sm">
            <span className="font-jp mr-2 text-base tracking-normal text-ember">港</span>Port of call
          </p>
          <h2 id="contact-title" className="font-display mt-2 text-[clamp(2.6rem,11vw,6rem)] leading-[0.92] text-moon">
            Drop anchor.
            <br />
            Let’s build.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-foam/85 md:text-lg">
            A venture, a product to ship or a wild idea? Send it over. Replies come faster than a Den Den Mushi.
          </p>

          <div className="mt-7 grid gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-foam/15 bg-sea-abyss p-2 pl-4 transition-colors hover:border-haki/50">
              <Mail className="h-5 w-5 shrink-0 text-haki" />
              <a
                href={`mailto:${contact.email}`}
                className="min-w-0 flex-1 break-all py-2.5 text-[15px] font-semibold text-moon underline-offset-4 hover:underline sm:text-base md:text-lg"
              >
                {contact.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                className="flex h-11 shrink-0 items-center gap-2 rounded-md bg-haki px-3.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copy</span>
              </button>
            </div>
            <SocialLink href={contact.instagram.url} label="Instagram" handle={contact.instagram.handle} icon={<Instagram className="h-5 w-5" />} />
            <SocialLink href={contact.linkedin.url} label="LinkedIn" handle={contact.linkedin.handle} icon={<Linkedin className="h-5 w-5" />} />
            <SocialLink href={OPEN_CUPBOARD_URL} label="His studio · Open Cupboard" handle="opencupboard.in" icon={<Globe className="h-5 w-5" />} />
          </div>
        </div>
      </div>

      <footer className="relative border-t border-foam/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-7 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-foam/60 md:flex-row md:px-8 md:text-left">
          <span>
            © {new Date().getFullYear()} {profile.name} · Kochi ⇄ Bangalore
          </span>
          <a href="#top" className="text-foam/80 transition-colors hover:text-haki">
            Back to the start ↑
          </a>
        </div>
      </footer>
    </section>
  );
}

/** A One Piece-style bounty poster with his real photo, and two snapshots pinned beside it. */
function PosterWall() {
  const [hills, festive] = portraits.crew;
  return (
    <div className="relative mx-auto w-full max-w-[24rem] md:max-w-[26rem]">
      <div className="@container relative z-10 mx-auto w-[86%] -rotate-[1.5deg] bg-parchment px-[6%] pb-[6%] pt-[5%] text-ink shadow-poster md:w-[80%]">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-30 mix-blend-multiply" />
        <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_42px_color-mix(in_oklch,var(--wood)_45%,transparent)]" />
        <p className="font-poster relative text-center text-[23.5cqw] leading-[0.82] tracking-[0.01em]">WANTED</p>
        <div className="relative mt-[4%] border-[3px] border-ink/85 bg-ink/10 p-[1.5%]">
          <img
            src={portraits.wanted.src}
            alt={portraits.wanted.alt}
            className="aspect-[37/35] w-full object-cover object-[50%_20%] [filter:sepia(0.35)_saturate(0.85)_contrast(1.06)]"
            loading="lazy"
          />
        </div>
        <p className="font-poster relative mt-[3%] text-center text-[9cqw] leading-none tracking-[0.12em]">DEAD OR ALIVE</p>
        <p className="font-poster relative mt-[3%] text-center text-[10.2cqw] leading-[0.95]">AISHWARY NAGARIA</p>
        <p className="font-poster relative mt-[3%] flex items-baseline justify-center gap-[2cqw] text-[13cqw] leading-none">
          <span className="text-[11cqw]">฿</span>1,00,000<span className="text-[7cqw]">-</span>
        </p>
        <p className="relative mt-[2%] text-center text-[3.6cqw] font-bold uppercase tracking-[0.18em] text-ink/70">
          Raised from ₹0 in 3 weeks
        </p>
        <p className="relative mt-[4%] border-t border-ink/30 pt-[3%] text-center text-[3.4cqw] font-bold uppercase tracking-[0.22em] text-ink/75">
          Wanted by founders · recruiters · crews
        </p>
      </div>

      {/* snapshots pinned under the poster, never over its text */}
      <div className="relative z-20 -mt-[3%] flex items-start justify-between px-[3%]">
        {hills && (
          <Polaroid
            src={hills.src}
            alt={hills.alt}
            caption={hills.caption}
            className="relative w-[50%] -rotate-[5deg]"
            aspect="aspect-[4/3]"
          />
        )}
        {festive && (
          <Polaroid
            src={festive.src}
            alt={festive.alt}
            caption={festive.caption}
            className="relative mt-[5%] w-[42%] rotate-[4deg]"
            aspect="aspect-[4/5]"
          />
        )}
      </div>
    </div>
  );
}

function Polaroid({
  src,
  alt,
  caption,
  className,
  aspect,
}: {
  src: string;
  alt: string;
  caption: string;
  className?: string;
  aspect: string;
}) {
  return (
    <figure className={`bg-moon p-[5%] pb-0 shadow-poster ${className ?? ""}`}>
      <span aria-hidden className="absolute -top-3 left-1/2 h-5 w-[42%] -translate-x-1/2 -rotate-3 bg-parchment/80 shadow-sm" />
      <img src={src} alt={alt} className={`${aspect} w-full object-cover`} loading="lazy" />
      <figcaption className="font-hand px-1 py-[6%] text-center text-[clamp(0.95rem,3.8vw,1.25rem)] leading-none text-ink">{caption}</figcaption>
    </figure>
  );
}

function SocialLink({ href, label, handle, icon }: { href: string; label: string; handle: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-lg border border-foam/15 bg-sea-abyss p-3 transition-colors hover:border-haki/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:p-4"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-foam/10 text-haki">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-foam/60">{label}</span>
        <span className="block break-words text-base font-semibold text-moon">{handle}</span>
      </span>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-foam/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-haki" />
    </a>
  );
}
