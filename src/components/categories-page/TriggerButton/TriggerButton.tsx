"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Dictionary } from "@/lang";
import styles from "./TriggerButton.module.css";

export type GuideId = "analyst" | "witch" | "psychologist" | "friend";

export interface TriggerButtonProps {
  dictionary: Dictionary["categoryPage"]["topBlock"]["guides"];
  value?: string;
  onChange?: (guide: string) => void;
  options?: { value: string; label: string; icon: string }[];
  disabled?: boolean;
}

export const GUIDE_ORDER: GuideId[] = ["analyst", "witch", "psychologist", "friend"];

export const GUIDE_ICON: Record<GuideId, string> = {
  analyst: "/icons/analyst.svg",
  witch: "/icons/witch.svg",
  psychologist: "/icons/psychologist.svg",
  friend: "/icons/friend.svg",
};

const TRANSITION = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

export default function TriggerButton({ dictionary, value, onChange, options, disabled }: TriggerButtonProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>("analyst");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = value ?? internalValue;
  const choices = options ?? GUIDE_ORDER.map(guide => ({ value: guide, label: dictionary[guide], icon: GUIDE_ICON[guide] }));
  const visible = open ? choices : choices.filter(choice => choice.value === selected);

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

  function handleSelect(guide: string) {
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
        {visible.map(({ value: guide, label, icon }) => {
          const isActive = guide === selected;
          const isTrigger = !open;
          return (
            <motion.button
              key={guide}
              layout
              type="button"
              disabled={disabled}
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
                  {label}
                </span>
              )}
              <span className={styles.iconWrap}>
                <span
                  className={`${styles.icon} ${!isTrigger && isActive ? styles.iconGradient : ""}`}
                  style={{
                    maskImage: `url(${icon})`,
                    WebkitMaskImage: `url(${icon})`,
                  }}
                />
              </span>
              {!isTrigger && (
                <span
                  className={`font-instrument-sm-emphasized ${styles.itemLabel} ${
                    isActive ? styles.itemLabelActive : ""
                  }`}
                >
                  {label}
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
