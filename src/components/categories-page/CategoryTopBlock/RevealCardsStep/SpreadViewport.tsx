"use client";
import { useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { animate } from "motion/react";
import { clampPan, focusTransform, readRevealMetrics, zoomBounds, type Point } from "./revealGeometry";
import styles from "./RevealCardsStep.module.css";

export { clampPan } from "./revealGeometry";
export interface SpreadViewportHandle {
  focus: (point: Point, duration: number, complete: () => void) => () => void;
}

export default function SpreadViewport({ width, height, locked, apiRef, onReady, children }: {
  width: number; height: number; locked: boolean;
  apiRef: RefObject<SpreadViewportHandle | null>;
  onReady: (origin: Point) => void;
  children: ReactNode;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const lockedRef = useRef(locked);
  useLayoutEffect(() => { lockedRef.current = locked; }, [locked]);

  useLayoutEffect(() => {
    const el = viewport.current!, inner = content.current!;
    const metrics = readRevealMetrics();
    let vw = 0, vh = 0, fit = 1, max = 1, scale = 1, x = 0, y = 0, moved = false;
    let stopAnimation: (() => void) | undefined;
    const pointers = new Map<number, Point>();
    const paint = () => {
      // Zoomed spreads need a bounded gutter to center even their outermost cards.
      const zoomed = scale > fit;
      el.dataset.zoomed = String(zoomed);
      x = clampPan(x, width * scale, vw, zoomed ? vw / 2 : 0);
      y = clampPan(y, height * scale, vh, zoomed ? vh / 2 : 0);
      inner.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    };
    const change = (factor: number | null, cx = vw / 2, cy = vh / 2) => {
      const next = factor === null ? fit : Math.max(fit, Math.min(max, scale * factor));
      x = cx - (cx - x) * next / scale; y = cy - (cy - y) * next / scale;
      scale = next; paint();
    };
    const resize = () => {
      const nextWidth = el.clientWidth, nextHeight = el.clientHeight;
      if (!nextWidth || !nextHeight || (nextWidth === vw && nextHeight === vh)) return;
      const ratio = scale / fit;
      const atMax = scale >= max;
      const center = { x: (vw / 2 - x) / scale, y: (vh / 2 - y) / scale };
      const initial = !vw;
      vw = nextWidth; vh = nextHeight;
      const mobile = window.matchMedia('(max-width: 768px)').matches;
      const overviewWidth = mobile ? 79.9 : 85.662;
      const maxWidth = mobile ? 111.189 : 169.589;
      ({ fit, max } = zoomBounds(width, height, vw, vh, metrics, overviewWidth, maxWidth));
      scale = lockedRef.current ? fit : atMax ? max : Math.min(max, fit * ratio);
      const next = focusTransform(initial ? { x: width / 2, y: height / 2 } : center, scale, width, height, vw, vh, scale > fit);
      x = next.x; y = next.y; paint();
      if (initial) {
        const rect = el.getBoundingClientRect();
        const panel = el.closest('[data-reading-panel]')!.getBoundingClientRect();
        // Shared origin below the whole panel, expressed in spread coordinates.
        onReady({ x: (panel.left + panel.width / 2 - rect.left - x) / scale, y: (panel.bottom - rect.top - y) / scale + height });
      }
    };
    apiRef.current = {
      focus(point, duration, complete) {
        stopAnimation?.();
        const from = { x, y, scale };
        const animation = animate(0, 1, {
          duration, ease: metrics.ease,
          onUpdate(progress) {
            // Resizing during focus must not leave stale bounds.
            const focusScale = max;
            const target = focusTransform(point, focusScale, width, height, vw, vh, true);
            x = from.x + (target.x - from.x) * progress;
            y = from.y + (target.y - from.y) * progress;
            scale = from.scale + (target.scale - from.scale) * progress;
            paint();
          },
          onComplete: complete,
        });
        stopAnimation = () => animation.stop();
        return stopAnimation;
      },
    };
    const observer = new ResizeObserver(resize); observer.observe(el); resize();
    const wheel = (e: WheelEvent) => {
      e.preventDefault(); if (lockedRef.current) return;
      const box = el.getBoundingClientRect();
      change(Math.exp(-e.deltaY * .002), e.clientX - box.left, e.clientY - box.top);
    };
    const down = (e: PointerEvent) => {
      if (lockedRef.current || (e.pointerType === 'mouse' && e.button !== 0)) return;
      if (!pointers.size) moved = false;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    };
    const move = (e: PointerEvent) => {
      const previous = pointers.get(e.pointerId); if (!previous) return;
      const dx = e.clientX - previous.x, dy = e.clientY - previous.y;
      if (!moved && Math.hypot(dx, dy) < 5) return;
      moved = true; el.setPointerCapture(e.pointerId);
      if (pointers.size === 2) {
        const other = [...pointers.entries()].find(([id]) => id !== e.pointerId)![1];
        const oldDistance = Math.hypot(previous.x - other.x, previous.y - other.y);
        const distance = Math.hypot(e.clientX - other.x, e.clientY - other.y);
        const box = el.getBoundingClientRect();
        if (oldDistance > 0) change(distance / oldDistance, (previous.x + other.x) / 2 - box.left, (previous.y + other.y) / 2 - box.top);
        x += dx / 2; y += dy / 2;
      } else { x += dx; y += dy; }
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); paint();
    };
    const up = (e: PointerEvent) => { pointers.delete(e.pointerId); if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId); };
    const click = (e: MouseEvent) => { if (moved || lockedRef.current) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    const reset = () => { if (!lockedRef.current) change(null); };
    el.addEventListener('wheel', wheel, { passive: false }); el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    el.addEventListener('click', click, true); el.addEventListener('dblclick', reset);
    return () => {
      stopAnimation?.(); apiRef.current = null;
      observer.disconnect(); el.removeEventListener('wheel', wheel); el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
      el.removeEventListener('click', click, true); el.removeEventListener('dblclick', reset);
    };
  }, [width, height, apiRef, onReady]);
  return <div ref={viewport} className={styles.spreadViewport} data-spread-viewport>
    <div ref={content} className={styles.spreadContent} style={{ width, height }}>{children}</div>
  </div>;
}
