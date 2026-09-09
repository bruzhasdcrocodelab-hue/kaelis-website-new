"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import type { Dictionary, Locale } from "@/lang";
import { setLocale } from "@/lib/locale-actions";
import BottomSheetSelect from "@/components/global/BottomSheetSelect";
import styles from "./LanguageSelector.module.css";

export interface LanguageSelectorProps {
  locale: Locale;
  languageNames: Dictionary["header"]["languageNames"];
  languageShort: Dictionary["header"]["languageShort"];
}

const LOCALE_ORDER: Locale[] = ["en", "ru", "uk"];

const MOBILE_QUERY = "(max-width: 768px)";

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

export default function LanguageSelector({
  locale,
  languageNames,
  languageShort,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
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
    <div
      className={styles.wrapper}
      ref={wrapperRef}
      data-header-dropdown-open={expanded || undefined}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        className={`${styles.trigger} ${expanded ? styles.triggerOpen : ""}`}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={`font-instrument-sm-emphasized ${styles.triggerLabel}`}>
          {languageShort[locale]}
        </span>
        <span className={styles.chevronWrap}>
          <span
            className={styles.chevron}
            style={{
              maskImage: "url(/icons/chevron-down.svg)",
              WebkitMaskImage: "url(/icons/chevron-down.svg)",
            }}
            aria-hidden
          />
        </span>
      </button>

      <div
        id={menuId}
        className={styles.dropdown}
        role="listbox"
        data-open={expanded || undefined}
        style={{
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
        }}
      >
        <span className={styles.dropdownGlow} aria-hidden />
        {LOCALE_ORDER.map((item, index) => {
          const isActive = item === locale;
          return (
            <div key={item} className={styles.optionGroup}>
              {index > 0 && <div className={styles.divider} />}
              <button
                type="button"
                role="option"
                aria-selected={isActive}
                className={`font-instrument-base ${styles.option} ${
                  isActive ? styles.optionActive : ""
                }`}
                onClick={() => handleSelect(item)}
              >
                {languageShort[item]}
              </button>
            </div>
          );
        })}
      </div>

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
