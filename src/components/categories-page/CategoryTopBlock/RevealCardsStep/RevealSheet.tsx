"use client";

import { useId, useLayoutEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, animate, motion, useMotionValue, usePresence, type Transition } from "motion/react";
import type { Locale } from "@/lang";
import { revealMessages } from "./revealMessages";
import styles from "./RevealCardsStep.module.css";

type RevealSheetProps = {
  open: boolean; onClose: () => void; title: string; locale: Locale; transition: Transition; children: ReactNode; card?: boolean;
};

export default function RevealSheet({ open, ...props }: RevealSheetProps) {
  if (typeof document === "undefined") return null;
  return createPortal(<AnimatePresence>
    {open && <SheetContent {...props} />}
  </AnimatePresence>, document.body);
}

function SheetContent({ onClose, title, locale, transition, children, card = false }: Omit<RevealSheetProps, "open">) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [present, safeToRemove] = usePresence();
  const y = useMotionValue(0);
  const entered = useRef(false);
  const panStart = useRef(0);
  const titleId = useId();
  useLayoutEffect(() => {
    const height = sheetRef.current?.offsetHeight ?? 0;
    if (!entered.current) {
      y.set(height);
      entered.current = true;
    }
    const animation = animate(y, present ? 0 : height, transition);
    void animation.then(() => { if (!present) safeToRemove?.(); });
    return () => y.stop();
  }, [present, safeToRemove, transition, y]);
  useLayoutEffect(() => {
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
  }, [onClose]);

  return <div ref={rootRef} className={styles.sheetRoot} data-reading-sheet>
      <motion.div className={styles.sheetBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={transition} onClick={onClose} data-sheet-backdrop />
      <motion.div ref={sheetRef} className={`${styles.sheet} ${card ? styles.cardSheet : ""}`} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}
        style={{ y }}>
        <motion.div className={styles.sheetHeader}
          onPanStart={() => { if (present) { y.stop(); panStart.current = y.get(); } }}
          onPan={(_, info) => { if (present) y.set(Math.max(0, panStart.current + info.offset.y * .9)); }}
          onPanEnd={(_, info) => {
            if (!present) return;
            if (info.offset.y > 90 || info.velocity.y > 500) onClose();
            else void animate(y, 0, transition);
          }} data-sheet-handle>
          <span className={styles.sheetGrabber} />
          <p className={styles.sheetEyebrow}>{card ? revealMessages[locale].discoverMeaning : revealMessages[locale].learnMore}</p>
          <h2 id={titleId} className={styles.sheetTitle}>{title}</h2>
        </motion.div>
        <div className={styles.sheetContent} tabIndex={0}>{children}</div>
      </motion.div>
    </div>;
}
