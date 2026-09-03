"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import styles from "./BottomSheetSelect.module.css";

export interface BottomSheetOption<T extends string> {
  value: T;
  label: string;
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

export default function BottomSheetSelect<T extends string>({
  open,
  onClose,
  options,
  selectedValue,
  onSelect,
  labelledBy,
}: BottomSheetSelectProps<T>) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  function handleDragEnd(_event: unknown, info: PanInfo) {
    if (info.offset.y > DRAG_CLOSE_OFFSET || info.velocity.y > DRAG_CLOSE_VELOCITY) {
      onClose();
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={styles.root}>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={BACKDROP_TRANSITION}
            onClick={onClose}
          />
          <motion.div
            className={`effect-blur ${styles.sheet}`}
            role="listbox"
            aria-labelledby={labelledBy}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SHEET_TRANSITION}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.9 }}
            onDragEnd={handleDragEnd}
          >
            <div className={styles.grabberRow}>
              <span className={styles.grabber} />
            </div>
            <div className={styles.list}>
              {options.map((option, index) => {
                const isActive = option.value === selectedValue;
                return (
                  <div key={option.value} className={styles.optionGroup}>
                    {index > 0 && <span className={styles.divider} />}
                    <button
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      className={`${styles.option} ${isActive ? styles.optionActive : ""}`}
                      onClick={() => {
                        onSelect(option.value);
                        onClose();
                      }}
                    >
                      <span
                        className={`font-instrument-lg-emphasized ${styles.optionLabel} ${
                          isActive ? styles.optionLabelActive : ""
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
