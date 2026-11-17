import {
  educationRows,
  entrepreneurshipRows,
  passages,
  skillGroups,
  type Island,
  type IslandRow,
  type Passage,
  type PassageId,
} from "@/data/portfolio";

/** The centre channel is where the ship heads unless the visitor picks another. */
export const DEFAULT_PASSAGE: PassageId = "entrepreneurship";

export const PASSAGE_IDS: PassageId[] = passages.map((p) => p.id);

export function isPassageId(value: unknown): value is PassageId {
  return typeof value === "string" && (PASSAGE_IDS as string[]).includes(value);
}

export function parsePassage(value: unknown): PassageId {
  return isPassageId(value) ? value : DEFAULT_PASSAGE;
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
  if (id === "entrepreneurship") return entrepreneurshipRows;
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
