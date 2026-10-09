"use client";

import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, animate, motion, useMotionValue, usePresence, useReducedMotion } from "motion/react";
import styles from "./BottomSheetSelect.module.css";

export interface BottomSheetOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon?: string;
}

export interface BottomSheetSelectProps<T extends string> {
  open: boolean;
  onClose: () => void;
  options: BottomSheetOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  labelledBy?: string;
}

const BACKDROP_TRANSITION = { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const };
const SHEET_TRANSITION = { duration: 0.32, ease: [0.32, 0.72, 0, 1] as const };
const DRAG_CLOSE_OFFSET = 90;
const DRAG_CLOSE_VELOCITY = 500;

export default function BottomSheetSelect<T extends string>({ open, ...props }: BottomSheetSelectProps<T>) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>{open && <SheetContent {...props} />}</AnimatePresence>,
    document.body,
  );
}

function SheetContent<T extends string>({ onClose, options, selectedValue, onSelect, labelledBy }: Omit<BottomSheetSelectProps<T>, "open">) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const entered = useRef(false);
  const panStart = useRef(0);
  const [present, safeToRemove] = usePresence();
  const reduced = useReducedMotion();
  const y = useMotionValue(0);
  useLayoutEffect(() => { closeRef.current = onClose; }, [onClose]);
  useLayoutEffect(() => {
    const height = sheetRef.current?.offsetHeight ?? 0;
    if (!entered.current) {
      y.set(height);
      entered.current = true;
    }
    const animation = animate(y, present ? 0 : height, { ...SHEET_TRANSITION, duration: reduced ? 0 : SHEET_TRANSITION.duration });
    void animation.then(() => { if (!present) safeToRemove?.(); });
    return () => y.stop();
  }, [present, safeToRemove, reduced, y]);
  useLayoutEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = [...document.body.children].filter((node): node is HTMLElement => node instanceof HTMLElement && node !== rootRef.current);
    const inert = background.map(node => node.inert);
    background.forEach(node => { node.inert = true; });
    sheetRef.current?.focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); }
      if (event.key !== "Tab") return;
      const focusable = [...(sheetRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? [])].filter(node => node.getClientRects().length > 0);
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
  }, []);

  return (
        <div ref={rootRef} className={styles.root}>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { ...SHEET_TRANSITION, duration: reduced ? 0 : SHEET_TRANSITION.duration } }}
            transition={{ ...BACKDROP_TRANSITION, duration: reduced ? 0 : BACKDROP_TRANSITION.duration }}
            onClick={onClose}
          />
          <motion.div
            ref={sheetRef}
            className={`effect-blur ${styles.sheet}`}
            role="listbox"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            style={{ y }}
            onPanStart={() => { if (present) { y.stop(); panStart.current = y.get(); } }}
            onPan={(_, info) => { if (present) y.set(Math.max(0, panStart.current + info.offset.y * .9)); }}
            onPanEnd={(_, info) => {
              if (!present) return;
              if (info.offset.y > DRAG_CLOSE_OFFSET || info.velocity.y > DRAG_CLOSE_VELOCITY) onClose();
              else void animate(y, 0, { ...SHEET_TRANSITION, duration: reduced ? 0 : SHEET_TRANSITION.duration });
            }}
          >
            <div className={styles.grabberRow}>
              <span className={styles.grabber} />
            </div>
            <div className={styles.list}>
              {options.map((option, index) => {
                const isActive = option.value === selectedValue;
                const prev = options[index - 1];
                const showDivider =
                  index > 0 && !isActive && prev.value !== selectedValue;
                const hasDetail = Boolean(option.icon || option.description);
                return (
                  <div key={option.value} className={styles.optionGroup}>
                    {showDivider && <span className={styles.divider} />}
                    <button
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      className={`${styles.option} ${
                        hasDetail ? styles.optionDetail : ""
                      } ${isActive ? styles.optionActive : ""}`}
                      onClick={() => {
                        onSelect(option.value);
                        onClose();
                      }}
                    >
                      {option.icon && (
                        <span className={styles.optionIconWrap}>
                          <span
                            className={`${styles.optionIcon} ${
                              isActive ? styles.optionIconActive : ""
                            }`}
                            style={{
                              maskImage: `url(${option.icon})`,
                              WebkitMaskImage: `url(${option.icon})`,
                            }}
                          />
                        </span>
                      )}
                      <span className={styles.optionText}>
                        <span
                          className={`font-instrument-lg-emphasized ${styles.optionLabel} ${
                            isActive ? styles.optionLabelActive : ""
                          }`}
                        >
                          {option.label}
                        </span>
                        {option.description && (
                          <span
                            className={`font-instrument-xxs ${styles.optionDescription} ${
                              isActive ? styles.optionDescriptionActive : ""
                            }`}
                          >
                            {option.description}
                          </span>
                        )}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
  );
}
