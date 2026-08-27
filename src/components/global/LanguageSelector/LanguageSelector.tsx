"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { motion } from "motion/react";
import type { Locale } from "@/lang";
import { setLocale } from "@/lib/locale-actions";
import styles from "./LanguageSelector.module.css";

export interface LanguageSelectorProps {
  locale: Locale;
}

const LOCALE_ORDER: Locale[] = ["en", "ru", "uk"];

const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  uk: "UA",
};

const TRANSITION = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

export default function LanguageSelector({ locale }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  function handleSelect(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      setLocale(next);
    });
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
        style={{
          backdropFilter: "blur(12.5px)",
          WebkitBackdropFilter: "blur(12.5px)",
        }}
      >
        {(open ? LOCALE_ORDER : [locale]).map((item, index) => {
          const isActive = item === locale;
          const isTrigger = !open;
          return (
            <motion.div key={item} layout>
              {open && index > 0 && <div className={styles.divider} />}
              <motion.button
                layout
                type="button"
                role={isTrigger ? undefined : "option"}
                aria-haspopup={isTrigger ? "listbox" : undefined}
                aria-expanded={isTrigger ? open : undefined}
                aria-selected={isTrigger ? undefined : isActive}
                className={`${styles.row} ${isTrigger ? styles.rowTrigger : styles.rowOption}`}
                onClick={() => (isTrigger ? setOpen(true) : handleSelect(item))}
              >
                <span
                  className={`font-instrument-sm-emphasized ${styles.label} ${
                    isActive ? styles.labelActive : ""
                  }`}
                >
                  {LOCALE_LABEL[item]}
                </span>
                {(isTrigger || isActive) && (
                  <span className={styles.iconWrap}>
                    <span
                      className={styles.icon}
                      style={{
                        maskImage: `url(/icons/right-arrow.svg)`,
                        WebkitMaskImage: `url(/icons/right-arrow.svg)`,
                      }}
                    />
                  </span>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
