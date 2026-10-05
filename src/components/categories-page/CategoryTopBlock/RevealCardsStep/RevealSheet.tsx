"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls, type Transition } from "motion/react";
import type { Locale } from "@/lang";
import { revealMessages } from "./revealMessages";
import styles from "./RevealCardsStep.module.css";

export default function RevealSheet({ open, onClose, title, locale, transition, children, card = false }: {
  open: boolean; onClose: () => void; title: string; locale: Locale; transition: Transition; children: ReactNode; card?: boolean;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const drag = useDragControls();
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = [...document.body.children].filter((node): node is HTMLElement => node instanceof HTMLElement && node !== rootRef.current);
    const inert = background.map(node => node.inert);
    background.forEach(node => { node.inert = true; });
    sheetRef.current?.focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key !== "Tab") return;
      const focusable = [...(sheetRef.current?.querySelectorAll<HTMLElement>('button, [tabindex="0"]') ?? [])].filter(node => node.getClientRects().length > 0);
      const first = focusable[0], last = focusable.at(-1);
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === sheetRef.current)) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === sheetRef.current)) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      document.body.style.overflow = overflow;
      background.forEach((node, index) => { node.inert = inert[index]; });
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;
  return createPortal(<AnimatePresence>
    {open && <div ref={rootRef} className={styles.sheetRoot} data-reading-sheet>
      <motion.div className={styles.sheetBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={transition} onClick={onClose} data-sheet-backdrop />
      <motion.div ref={sheetRef} className={`${styles.sheet} ${card ? styles.cardSheet : ""}`} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={transition}
        drag="y" dragListener={false} dragControls={drag} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: .9 }}
        onDragEnd={(_, info) => {
          const style = getComputedStyle(sheetRef.current!);
          if (info.offset.y > parseFloat(style.getPropertyValue("--reveal-sheet-drag-offset")) ||
            info.velocity.y > parseFloat(style.getPropertyValue("--reveal-sheet-drag-velocity"))) onClose();
        }}>
        <div className={styles.sheetHeader} onPointerDown={event => {
          if (!(event.target as HTMLElement).closest("button")) drag.start(event);
        }} data-sheet-handle>
          <span className={styles.sheetGrabber} />
          <p className={styles.sheetEyebrow}>{card ? revealMessages[locale].discoverMeaning : revealMessages[locale].learnMore}</p>
          <h2 id={titleId} className={styles.sheetTitle}>{title}</h2>
        </div>
        <div className={styles.sheetContent} tabIndex={0}>{children}</div>
      </motion.div>
    </div>}
  </AnimatePresence>, document.body);
}
