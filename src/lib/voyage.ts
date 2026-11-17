import {
  autoLinks,
  educationRows,
  experienceRows,
  passages,
  skillGroups,
  type Island,
  type IslandRow,
  type Passage,
  type PassageId,
} from "@/data/portfolio";

/** The centre channel is where the ship heads unless the visitor picks another. */
export const DEFAULT_PASSAGE: PassageId = "experience";

export const PASSAGE_IDS: PassageId[] = passages.map((p) => p.id);

/** Old share links used "entrepreneurship" for the centre passage. */
const LEGACY_PASSAGES: Record<string, PassageId> = { entrepreneurship: "experience" };

export function isPassageId(value: unknown): value is PassageId {
  return typeof value === "string" && (PASSAGE_IDS as string[]).includes(value);
}

/** A known passage id (including legacy names), or undefined. */
export function normalizePassage(value: unknown): PassageId | undefined {
  if (isPassageId(value)) return value;
  if (typeof value === "string" && value in LEGACY_PASSAGES) return LEGACY_PASSAGES[value];
  return undefined;
}

export function parsePassage(value: unknown): PassageId {
  return normalizePassage(value) ?? DEFAULT_PASSAGE;
}

export function getPassage(id: PassageId): Passage {
  const found = passages.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown passage ${id}`);
  return found;
}

export function otherPassages(id: PassageId): Passage[] {
  return passages.filter((p) => p.id !== id);
}

export function rowsForPassage(id: PassageId): IslandRow[] {
  if (id === "education") return educationRows;
  if (id === "experience") return experienceRows;
  return [];
}

export function islandsOf(rows: IslandRow[]): Island[] {
  return rows.flatMap((r) => r.islands);
}

export function allSkills(): string[] {
  return Array.from(new Set(skillGroups.flatMap((g) => g.skills)));
}

export function passageStats(id: PassageId): string {
  if (id === "skills") return `${allSkills().length} skills`;
  const count = islandsOf(rowsForPassage(id)).length;
  return `${count} islands`;
}

export type TextPart = { text: string; href?: string };

/** Splits copy so every auto-linked name (e.g. Open Cupboard) becomes its own linked part. */
export function splitLinks(text: string, links = autoLinks): TextPart[] {
  const parts: TextPart[] = [];
  let rest = text;
  while (rest.length) {
    let best: { index: number; text: string; href: string } | null = null;
    for (const l of links) {
      const index = rest.indexOf(l.text);
      if (index !== -1 && (!best || index < best.index || (index === best.index && l.text.length > best.text.length))) {
        best = { index, text: l.text, href: l.href };
      }
    }
    if (!best) {
      parts.push({ text: rest });
      break;
    }
    if (best.index > 0) parts.push({ text: rest.slice(0, best.index) });
    parts.push({ text: best.text, href: best.href });
    rest = rest.slice(best.index + best.text.length);
  }
  return parts;
}

/* ---------- motion maths ---------- */

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Opacity of a caption that lives between `start` and `end` (0–1 of the scroll),
 * fading in and out over `fade`.
 */
export function windowOpacity(p: number, start: number, end: number, fade = 0.035) {
  if (p < start - fade || p > end + fade) return 0;
  const fadeIn = smoothstep(start - fade, start + fade, p);
  const fadeOut = 1 - smoothstep(end - fade, end + fade, p);
  return Math.min(fadeIn, fadeOut);
}

/**
 * Where an object-fit: cover frame of aspect `aspect` sits inside a W×H viewport.
 * Used to pin the cut-out ship exactly where the video's ship was on the last frame.
 */
export function coverRect(W: number, H: number, aspect: number) {
  const width = Math.max(W, H * aspect);
  const height = width / aspect;
  return { left: (W - width) / 2, top: (H - height) / 2, width, height };
}
