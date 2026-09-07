"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Dictionary } from "@/lang";
import styles from "./TriggerButton.module.css";

export type GuideId = "analyst" | "witch" | "psychologist" | "friend";

export interface TriggerButtonProps {
  dictionary: Dictionary["categoryPage"]["topBlock"]["guides"];
  value?: GuideId;
  onChange?: (guide: GuideId) => void;
}

export const GUIDE_ORDER: GuideId[] = ["analyst", "witch", "psychologist", "friend"];

export const GUIDE_ICON: Record<GuideId, string> = {
  analyst: "/icons/analyst.svg",
  witch: "/icons/witch.svg",
  psychologist: "/icons/psychologist.svg",
  friend: "/icons/friend.svg",
};

const TRANSITION = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

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
      <motion.div
        className={styles.shell}
        layout
        initial={false}
        animate={{ borderRadius: open ? 12 : 30 }}
        transition={TRANSITION}
        role={open ? "listbox" : undefined}
      >
        {(open ? GUIDE_ORDER : [selected]).map((guide) => {
          const isActive = guide === selected;
          const isTrigger = !open;
          return (
            <motion.button
              key={guide}
              layout
              type="button"
              role={isTrigger ? undefined : "option"}
              aria-haspopup={isTrigger ? "listbox" : undefined}
              aria-expanded={isTrigger ? open : undefined}
              aria-selected={isTrigger ? undefined : isActive}
              className={`${styles.item} ${isTrigger ? styles.itemTrigger : styles.itemOption} ${
                !isTrigger && isActive ? styles.itemActive : ""
              }`}
              onClick={() => (isTrigger ? setOpen(true) : handleSelect(guide))}
            >
              {isTrigger && (
                <span className={`font-instrument-sm-emphasized ${styles.itemLabel}`}>
                  {dictionary[guide]}
                </span>
              )}
              <span className={styles.iconWrap}>
                <span
                  className={`${styles.icon} ${!isTrigger && isActive ? styles.iconGradient : ""}`}
                  style={{
                    maskImage: `url(${GUIDE_ICON[guide]})`,
                    WebkitMaskImage: `url(${GUIDE_ICON[guide]})`,
                  }}
                />
              </span>
              {!isTrigger && (
                <span
                  className={`font-instrument-sm-emphasized ${styles.itemLabel} ${
                    isActive ? styles.itemLabelActive : ""
                  }`}
                >
                  {dictionary[guide]}
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
