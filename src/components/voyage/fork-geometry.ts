import type { PassageId } from "@/data/portfolio";
import { coverRect } from "@/lib/voyage";

import { SHIP_FILL, type VoyageVariant } from "./voyage-media";

/**
 * Geometry of the fork, in viewport pixels. The ship starts exactly where the video's
 * ship was on the last frame, rises to a cruising spot, then sails a route down one of
 * three channels to its gate.
 */

export type Pt = { x: number; y: number };

export interface ForkLayout {
  W: number;
  H: number;
  phone: boolean;
  /** The sprite's box at full (video) scale. */
  box: { width: number; height: number };
  start: Pt;
  cruise: Pt;
  cruiseScale: number;
  endScale: number;
  split: Pt;
  /** Top-centre of each gate. */
  gates: Record<PassageId, Pt>;
}

export function computeForkLayout(W: number, H: number, variant: VoyageVariant, gates: Record<PassageId, Pt>): ForkLayout {
  const phone = W < 768;
  const frame = coverRect(W, H, variant.aspect);
  const b = variant.shipBox;
  const box = { width: b.w * frame.width, height: b.h * frame.height };
  const start = {
    x: frame.left + (b.x + b.w / 2) * frame.width,
    y: frame.top + (b.y + b.h / 2) * frame.height,
  };
  const targetHeight = H * (phone ? 0.19 : 0.24);
  const cruiseScale = Math.min(1, targetHeight / (SHIP_FILL * box.height));
  const cruise = { x: W / 2, y: H * (phone ? 0.37 : 0.31) };
  const split = { x: W / 2, y: H * (phone ? 0.57 : 0.54) };
  return { W, H, phone, box, start, cruise, cruiseScale, endScale: cruiseScale * 0.78, split, gates };
}

function curveTo(from: Pt, to: Pt) {
  const k = (to.y - from.y) * 0.55;
  return `C ${from.x.toFixed(1)} ${(from.y + k).toFixed(1)} ${to.x.toFixed(1)} ${(to.y - k).toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
}

/** Visible water channel from the split to a gate. */
export function channelPath(l: ForkLayout, id: PassageId) {
  const g = l.gates[id];
  return `M ${l.split.x.toFixed(1)} ${l.split.y.toFixed(1)} ${curveTo(l.split, g)}`;
}

export function trunkPath(l: ForkLayout) {
  return `M ${l.cruise.x.toFixed(1)} ${(l.cruise.y - 10).toFixed(1)} L ${l.split.x.toFixed(1)} ${l.split.y.toFixed(1)}`;
}

/** The route the ship sails: cruise spot → split → just above the chosen gate. */
export function routePath(l: ForkLayout, id: PassageId) {
  const g = l.gates[id];
  const shipHalf = (SHIP_FILL * l.box.height * l.endScale) / 2;
  const end = { x: g.x, y: Math.max(l.split.y + 20, g.y - shipHalf - 10) };
  return `M ${l.cruise.x.toFixed(1)} ${l.cruise.y.toFixed(1)} L ${l.split.x.toFixed(1)} ${l.split.y.toFixed(1)} ${curveTo(l.split, end)}`;
}
