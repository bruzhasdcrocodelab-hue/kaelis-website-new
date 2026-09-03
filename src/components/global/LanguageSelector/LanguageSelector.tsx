"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { motion } from "motion/react";
import type { Dictionary, Locale } from "@/lang";
import { setLocale } from "@/lib/locale-actions";
import BottomSheetSelect from "@/components/global/BottomSheetSelect";
import styles from "./LanguageSelector.module.css";

export interface LanguageSelectorProps {
  locale: Locale;
  languageNames: Dictionary["header"]["languageNames"];
}

const LOCALE_ORDER: Locale[] = ["en", "ru", "uk"];

const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  uk: "UA",
};

const MOBILE_QUERY = "(max-width: 768px)";

const TRANSITION = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

/** Tracks a media query, SSR-safe (starts false, corrects on mount). */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export default function LanguageSelector({ locale, languageNames }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(MOBILE_QUERY);

  useEffect(() => {
    if (!open || isMobile) return;

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
  }, [open, isMobile]);

  function handleSelect(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      setLocale(next);
    });
  }

  const expanded = open && !isMobile;

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <motion.div
        className={`${styles.shell} ${expanded ? "" : styles.shellCollapsed}`}
        layout
        initial={false}
        animate={{ borderRadius: expanded ? 12 : 30 }}
        transition={TRANSITION}
        role={expanded ? "listbox" : undefined}
        // style={{
        //   backdropFilter: "blur(12.5px)",
        //   WebkitBackdropFilter: "blur(12.5px)",
        // }}
      >
        {(expanded ? LOCALE_ORDER : [locale]).map((item, index) => {
          const isActive = item === locale;
          const isTrigger = !expanded;
          return (
            <motion.div key={item} layout>
              {expanded && index > 0 && <div className={styles.divider} />}
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
      {isMobile && (
        <BottomSheetSelect<Locale>
          open={open}
          onClose={() => setOpen(false)}
          options={LOCALE_ORDER.map((item) => ({
            value: item,
            label: languageNames[item],
          }))}
          selectedValue={locale}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}
