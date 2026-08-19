"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Dictionary } from "@/lang";
import styles from "./TriggerButton.module.css";

export type GuideId = "analyst" | "witch" | "psychologist" | "friend";

export interface TriggerButtonProps {
  dictionary: Dictionary["categoryPage"]["topBlock"]["guides"];
  value?: GuideId;
  onChange?: (guide: GuideId) => void;
}

const GUIDE_ORDER: GuideId[] = ["analyst", "witch", "psychologist", "friend"];

const GUIDE_ICON: Record<GuideId, string> = {
  analyst: "/icons/analyst.svg",
  witch: "/icons/witch.svg",
  psychologist: "/icons/psychologist.svg",
  friend: "/icons/friend.svg",
};

export default function TriggerButton({ dictionary, value, onChange }: TriggerButtonProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<GuideId>("analyst");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = value ?? internalValue;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleSelect(guide: GuideId) {
    setInternalValue(guide);
    onChange?.(guide);
    setOpen(false);
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`font-instrument-sm-emphasized ${styles.triggerLabel}`}>
          {dictionary[selected]}
        </span>
        <span className={styles.iconWrap}>
          <span
            className={styles.icon}
            style={{ maskImage: `url(${GUIDE_ICON[selected]})`, WebkitMaskImage: `url(${GUIDE_ICON[selected]})` }}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.panelPositioner}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              className={styles.panel}
              role="listbox"
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              exit={{ y: -8 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {GUIDE_ORDER.map((guide) => {
                const isActive = guide === selected;
                return (
                  <button
                    key={guide}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
                    onClick={() => handleSelect(guide)}
                  >
                    <span className={styles.menuItemContent}>
                      <span className={styles.iconWrap}>
                        <span
                          className={`${styles.icon} ${isActive ? styles.iconGradient : ""}`}
                          style={{
                            maskImage: `url(${GUIDE_ICON[guide]})`,
                            WebkitMaskImage: `url(${GUIDE_ICON[guide]})`,
                          }}
                        />
                      </span>
                      <span
                        className={`font-instrument-sm-emphasized ${styles.menuItemLabel} ${
                          isActive ? styles.menuItemLabelActive : ""
                        }`}
                      >
                        {dictionary[guide]}
                      </span>
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
