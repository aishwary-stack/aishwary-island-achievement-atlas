import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import { clamp } from "@/lib/voyage";
import { cn } from "@/lib/utils";

import type { MediaFile, VoyageVariant } from "./voyage-media";

/**
 * The opening video, driven by scroll.
 *
 * Seeking a video on every frame stutters, so when the scroll moves forward the
 * video simply plays toward the target at a speed proportional to the gap, and only
 * seeks when the scroll goes backwards or jumps. A small file loads first so the
 * voyage starts fast; the HD file is downloaded in the background and cross-faded in.
 */

export interface ScrubHandle {
  /** Ask the video to show `fraction` (0–1) of its length. Call every animation frame. */
  update: (fraction: number) => void;
  pause: () => void;
}

export interface ScrubLoad {
  ready: boolean;
  pct: number;
  mb: number;
  hd: boolean;
}

async function downloadToBlob(
  media: MediaFile,
  signal: AbortSignal,
  onProgress?: (received: number, total: number) => void,
): Promise<string> {
  const res = await fetch(media.url, { signal });
  if (!res.ok || !res.body) throw new Error(`Video request failed (${res.status})`);
  const total = Number(res.headers.get("content-length")) || media.size;
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      received += value.length;
      onProgress?.(received, total);
    }
  }
  return URL.createObjectURL(new Blob(chunks as BlobPart[], { type: "video/mp4" }));
}

function waitFor(el: HTMLVideoElement, event: string) {
  return new Promise<void>((resolve) => el.addEventListener(event, () => resolve(), { once: true }));
}

export const ScrubVideo = forwardRef<
  ScrubHandle,
  { variant: VoyageVariant; onLoad: (state: ScrubLoad) => void; className?: string }
>(function ScrubVideo({ variant, onLoad, className }, ref) {
  const quickRef = useRef<HTMLVideoElement | null>(null);
  const hdRef = useRef<HTMLVideoElement | null>(null);
  const engine = useRef({ active: null as HTMLVideoElement | null, canPlay: true, playPending: false });
  const [hdVisible, setHdVisible] = useState(false);
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;

  useImperativeHandle(
    ref,
    () => ({
      update(fraction: number) {
        const e = engine.current;
        const v = e.active;
        if (!v || v.readyState < 2 || !Number.isFinite(v.duration) || v.duration <= 0) return;
        const end = v.duration - 0.05;
        const target = clamp(fraction) * end;
        const diff = target - v.currentTime;
        const nearEnd = v.ended || v.currentTime >= v.duration - 0.08;

        if (e.canPlay && !nearEnd && diff > 0.035 && diff < 1.4) {
          // Play forward toward the target: smooth, every frame decoded in order.
          const rate = clamp(diff * 3, 0.3, 4);
          if (Math.abs(v.playbackRate - rate) > 0.06) v.playbackRate = rate;
          if (v.paused && !e.playPending) {
            e.playPending = true;
            v.play().then(
              () => (e.playPending = false),
              () => {
                e.playPending = false;
                e.canPlay = false; // e.g. iOS low-power mode: fall back to seeking
              },
            );
          }
          return;
        }
        if (!v.paused) v.pause();
        // Small overshoot from playing is fine; seek for backwards scrolls and big jumps.
        if ((diff <= -0.12 || diff >= 0.035) && !v.seeking) v.currentTime = target;
      },
      pause() {
        const v = engine.current.active;
        if (v && !v.paused) v.pause();
      },
    }),
    [],
  );

  useEffect(() => {
    const quick = quickRef.current;
    const hd = hdRef.current;
    if (!quick || !hd) return;
    const controller = new AbortController();
    const urls: string[] = [];
    let quickUrl: string | null = null;
    let lastPct = -1;
    const report = (s: Partial<ScrubLoad>) => onLoadRef.current({ ready: false, pct: 0, mb: 0, hd: false, ...s });
    engine.current.active = null;
    setHdVisible(false);

    const startHd = async () => {
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      if (conn?.saveData) return;
      try {
        const url = await downloadToBlob(variant.hd, controller.signal);
        urls.push(url);
        hd.src = url;
        hd.load();
        await waitFor(hd, "loadeddata");
        if (controller.signal.aborted) return;
        const from = engine.current.active ?? quick;
        hd.currentTime = from.currentTime;
        await waitFor(hd, "seeked");
        if (controller.signal.aborted) return;
        from.pause();
        engine.current.active = hd;
        setHdVisible(true);
        onLoadRef.current({ ready: true, pct: 100, mb: variant.quick.size / 1_048_576, hd: true });
        // Free the small file once the fade has finished.
        window.setTimeout(() => {
          if (controller.signal.aborted) return;
          quick.removeAttribute("src");
          quick.load();
          if (quickUrl) URL.revokeObjectURL(quickUrl);
        }, 900);
      } catch (err) {
        if (!controller.signal.aborted) console.warn("HD voyage unavailable, staying on the quick version", err);
      }
    };

    (async () => {
      try {
        quickUrl = await downloadToBlob(variant.quick, controller.signal, (received, total) => {
          const pct = Math.min(99, Math.floor((received / total) * 100));
          if (pct !== lastPct) {
            lastPct = pct;
            report({ pct, mb: received / 1_048_576 });
          }
        });
        urls.push(quickUrl);
        quick.src = quickUrl;
      } catch (err) {
        if (controller.signal.aborted) return;
        console.warn("Streaming the voyage video instead of preloading it", err);
        quick.src = variant.quick.url;
      }
      quick.load();
      await waitFor(quick, "loadeddata");
      if (controller.signal.aborted) return;
      engine.current.active = quick;
      report({ ready: true, pct: 100, mb: variant.quick.size / 1_048_576 });
      void startHd();
    })();

    return () => {
      controller.abort();
      engine.current.active = null;
      for (const u of urls) URL.revokeObjectURL(u);
    };
  }, [variant]);

  const videoClass = "absolute inset-0 h-full w-full object-cover";
  return (
    <div className={cn("absolute inset-0", className)}>
      <video
        ref={quickRef}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        poster={variant.poster}
        aria-hidden
        className={videoClass}
      />
      <video
        ref={hdRef}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden
        className={cn(videoClass, "transition-opacity duration-700", hdVisible ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
});
