import video1080 from "@/assets/grand-line-voyage-1080p.mp4.asset.json";
import video540 from "@/assets/grand-line-voyage-540p.mp4.asset.json";
import phone1280 from "@/assets/grand-line-voyage-phone-1280.mp4.asset.json";
import phone640 from "@/assets/grand-line-voyage-phone-640.mp4.asset.json";
import posterFirst from "@/assets/voyage-poster-first.jpg.asset.json";
import seaDesktop from "@/assets/voyage-sea-desktop.jpg.asset.json";
import seaPhone from "@/assets/voyage-sea-phone.jpg.asset.json";
import shipSprite from "@/assets/voyage-ship.webp.asset.json";

/**
 * Two framings of the same voyage video. Landscape screens get the full 16:9 frame,
 * portrait phones get a centre crop encoded natively at 9:16 so nothing is upscaled.
 * Each framing has a quick low-res file (shown first) and an HD file swapped in when ready.
 */

export interface MediaFile {
  url: string;
  size: number;
}

/** Where the cut-out ship sprite sits on the video's final frame, as fractions of the frame. */
export interface FrameBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface VoyageVariant {
  id: "landscape" | "portrait";
  aspect: number;
  quick: MediaFile;
  hd: MediaFile;
  poster: string;
  /** The final frame with the ship and its wake painted out. */
  sea: string;
  shipBox: FrameBox;
}

const file = (a: { url: string; size: number }): MediaFile => ({ url: a.url, size: a.size });

// The sprite was cut from a 600×900 box at (660, 60) of the 1920×1080 final frame.
// The portrait video is the 609px-wide centre crop starting at x = 655.5.
export const VARIANTS: Record<VoyageVariant["id"], VoyageVariant> = {
  landscape: {
    id: "landscape",
    aspect: 16 / 9,
    quick: file(video540),
    hd: file(video1080),
    poster: posterFirst.url,
    sea: seaDesktop.url,
    shipBox: { x: 660 / 1920, y: 60 / 1080, w: 600 / 1920, h: 900 / 1080 },
  },
  portrait: {
    id: "portrait",
    aspect: 9 / 16,
    quick: file(phone640),
    hd: file(phone1280),
    poster: posterFirst.url,
    sea: seaPhone.url,
    shipBox: { x: (660 - 655.5) / 609, y: 60 / 1080, w: 600 / 609, h: 900 / 1080 },
  },
};

export const SHIP_SPRITE = shipSprite.url;
/** The hull fills this share of the sprite box height (bow to stern lantern). */
export const SHIP_FILL = 0.92;

export function pickVariant(width: number, height: number): VoyageVariant {
  return width / Math.max(1, height) < 0.85 ? VARIANTS.portrait : VARIANTS.landscape;
}
