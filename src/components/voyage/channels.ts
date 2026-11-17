import type { PassageId } from "@/data/portfolio";

/**
 * Geometry of the fork, in percent of the viewport (0–100 on both axes).
 * The trunk comes down from the video, splits, and fans into three channels.
 */

type Pt = { x: number; y: number };

export const TRUNK = { from: { x: 50, y: -4 }, to: { x: 50, y: 40 } };

export const CHANNELS: Record<PassageId, { ctrl: Pt; end: Pt }> = {
  education: { ctrl: { x: 32, y: 56 }, end: { x: 12, y: 104 } },
  entrepreneurship: { ctrl: { x: 50, y: 70 }, end: { x: 50, y: 104 } },
  skills: { ctrl: { x: 68, y: 56 }, end: { x: 88, y: 104 } },
};

export function quad(a: Pt, c: Pt, b: Pt, t: number): Pt {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
}

function quadTangent(a: Pt, c: Pt, b: Pt, t: number): Pt {
  return { x: 2 * (1 - t) * (c.x - a.x) + 2 * t * (b.x - c.x), y: 2 * (1 - t) * (c.y - a.y) + 2 * t * (b.y - c.y) };
}

/** Polygon points for a widening water band along a quadratic curve. */
export function bandPolygon(a: Pt, c: Pt, b: Pt, w0: number, w1: number, aspect: number, steps = 28) {
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = quad(a, c, b, t);
    const tan = quadTangent(a, c, b, t);
    // Work in screen space (x scaled by aspect) so the band keeps an even width,
    // then convert the offset back to viewBox units. Width is in % of viewport width.
    const sx = tan.x * aspect;
    const sy = tan.y;
    const len = Math.hypot(sx, sy) || 1;
    const nx = -sy / len;
    const ny = sx / len;
    const half = (w0 + (w1 - w0) * t) / 2;
    const dx = nx * half;
    const dy = ny * half * aspect;
    left.push({ x: p.x + dx, y: p.y + dy });
    right.push({ x: p.x - dx, y: p.y - dy });
  }
  return [...left, ...right.reverse()].map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
}

export function channelPath(id: PassageId) {
  const ch = CHANNELS[id];
  return `M ${TRUNK.to.x} ${TRUNK.to.y} Q ${ch.ctrl.x} ${ch.ctrl.y} ${ch.end.x} ${ch.end.y}`;
}

/** Ship position (percent) and heading (degrees, 0 = bow pointing down) for fork progress. */
export function shipOnFork(id: PassageId, p: number): { x: number; y: number; heading: number } {
  const split = 0.5;
  if (p <= split) {
    const t = p / split;
    const y = TRUNK.from.y + 16 + (TRUNK.to.y - TRUNK.from.y - 16) * t;
    return { x: 50, y, heading: 0 };
  }
  const t = Math.min(1, (p - split) / (1 - split)) * 0.34;
  const ch = CHANNELS[id];
  const pos = quad(TRUNK.to, ch.ctrl, ch.end, t);
  const tan = quadTangent(TRUNK.to, ch.ctrl, ch.end, Math.max(t, 0.02));
  const heading = (Math.atan2(-tan.x * 1.6, tan.y) * 180) / Math.PI;
  return { x: pos.x, y: pos.y, heading };
}
