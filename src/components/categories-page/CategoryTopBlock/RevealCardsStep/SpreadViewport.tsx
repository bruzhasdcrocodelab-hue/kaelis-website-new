"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Locale } from "@/lang";
import { readingMessages } from "@/lib/tarot/messages";
import styles from "./RevealCardsStep.module.css";

export function clampPan(value: number, content: number, viewport: number) {
  return content <= viewport ? (viewport - content) / 2 : Math.max(viewport - content, Math.min(0, value));
}
export default function SpreadViewport({ width, height, locale, children }: { width: number; height: number; locale: Locale; children: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const controls = useRef<(factor: number | null) => void>(() => {});
  const [zoom, setZoom] = useState(1);
  const text = readingMessages[locale];
  useEffect(() => {
    const el = viewport.current!, inner = content.current!;
    let vw = el.clientWidth, vh = 300, fit = 1, scale = 1, x = 0, y = 0, moved = false;
    const pointers = new Map<number, { x: number; y: number }>();
    const paint = () => {
      x = clampPan(x, width * scale, vw); y = clampPan(y, height * scale, vh);
      inner.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      setZoom(scale / fit);
    };
    const change = (factor: number | null, cx = vw / 2, cy = vh / 2) => {
      const next = factor === null ? fit : Math.max(fit, Math.min(fit * 3, scale * factor));
      x = cx - (cx - x) * next / scale; y = cy - (cy - y) * next / scale;
      scale = next; paint();
    };
    controls.current = change;
    const resize = () => {
      vw = el.clientWidth;
      vh = Math.max(280, Math.min(840, height * Math.min(1, vw / width)));
      el.style.height = `${vh}px`;
      fit = Math.min(1, vw / width, vh / height); scale = fit; x = 0; y = 0; paint();
    };
    const observer = new ResizeObserver(resize); observer.observe(el); resize();
    const wheel = (e: WheelEvent) => {
      e.preventDefault(); const box = el.getBoundingClientRect();
      change(Math.exp(-e.deltaY * .002), e.clientX - box.left, e.clientY - box.top);
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
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
    const click = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    const reset = () => change(null);
    el.addEventListener("wheel", wheel, { passive: false }); el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true); el.addEventListener("dblclick", reset);
    return () => {
      observer.disconnect(); el.removeEventListener("wheel", wheel); el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true); el.removeEventListener("dblclick", reset);
    };
  }, [width, height]);
  return <>
    {/* <div className={styles.zoomControls} onClick={e => e.stopPropagation()}>
      <button type="button" aria-label={text.zoomOut} disabled={zoom <= 1.001} onClick={() => controls.current(1 / 1.25)}>−</button>
      <button type="button" aria-label={text.reset} onClick={() => controls.current(null)}>{Math.round(zoom * 100)}%</button>
      <button type="button" aria-label={text.zoomIn} disabled={zoom >= 2.999} onClick={() => controls.current(1.25)}>+</button>
    </div> */}
    <div ref={viewport} className={styles.spreadViewport}>
      <div ref={content} className={styles.spreadContent} style={{ width, height }}>{children}</div>
    </div>
  </>;
}
