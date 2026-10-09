"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { createPortal } from "react-dom";
import dropdownStyles from "../Header/HeaderDropdown.module.css";
import type { Dictionary, Locale } from "@/lang";
import { usePathname, useRouter } from "next/navigation";
import { useCatalogStores } from "@/components/categories/CatalogProvider";
import { localizedHref, routeFromPath } from "@/lib/routing";
import { catalogMessages } from "@/lib/categories/messages";
import BottomSheetSelect from "@/components/global/BottomSheetSelect";
import styles from "./LanguageSelector.module.css";

export interface LanguageSelectorProps {
  locale: Locale;
  languageNames: Dictionary["header"]["languageNames"];
  languageShort: Dictionary["header"]["languageShort"];
}

const LOCALE_ORDER: Locale[] = ["en", "ru", "uk"];

const MOBILE_QUERY = "(max-width: 768px)";
const DROPDOWN_WIDTH = 110;

const noop = () => () => {};

/** SSR-safe: false on the server, true once mounted in the browser. */
function useIsClient() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  );
}

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
  const [pending, startTransition] = useTransition();
  const [switchError, setSwitchError] = useState(false);
  const getStore = useCatalogStores();
  const pathname = usePathname();
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const isClient = useIsClient();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [left, setLeft] = useState(0);

  const expanded = open && !isMobile;

  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setLeft(rect.left + rect.width / 2 - DROPDOWN_WIDTH / 2);
  }, []);

  useLayoutEffect(() => {
    if (!expanded) return;
    reposition();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [expanded, reposition]);

  useEffect(() => {
    if (!open || isMobile) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        !wrapperRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
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
    if (next === locale || pending) return;
    setSwitchError(false);
    startTransition(async () => {
      try {
        const route = routeFromPath(pathname);
        let target = localizedHref(next, pathname);
        if (route?.kind === "category") {
          const currentStore = getStore(locale);
          const targetStore = getStore(next);
          await Promise.all([currentStore.load(undefined, true), targetStore.load(undefined, true)]);
          const current = currentStore.getSnapshot();
          const translated = targetStore.getSnapshot();
          if (current.status !== "success" || translated.status !== "success") throw new Error("Catalog unavailable");
          const category = current.data.find(item => item.slug === route.path[0]);
          const nextCategory = translated.data.find(item => item.id === category?.id);
          if (!category || !nextCategory) throw new Error("Category unavailable");
          const parts = [nextCategory.slug];
          await Promise.all([currentStore.load(category.id, true), targetStore.load(nextCategory.id, true)]);
          const spreads = currentStore.getSnapshot(category.id);
          const nextSpreads = targetStore.getSnapshot(nextCategory.id);
          if (spreads.status !== "success" || nextSpreads.status !== "success") throw new Error("Spreads unavailable");
          if (route.path.length === 2) {
            const spread = spreads.data.find(item => item.slug === route.path[1]);
            const nextSpread = nextSpreads.data.find(item => item.id === spread?.id);
            if (!nextSpread) throw new Error("Spread unavailable");
            parts.push(nextSpread.slug);
          }
          target = localizedHref(next, "/tarot/" + parts.map(encodeURIComponent).join("/"));
        }
        if (window.location.pathname !== pathname) return;
        router.push(target + window.location.search + window.location.hash, { scroll: false });
      } catch {
        setSwitchError(true);
      }
    });
  }

  return (
    <div
      className={styles.wrapper}
      ref={wrapperRef}
      data-header-dropdown-open={expanded || undefined}
    >
      <button
        ref={triggerRef}
        type="button"
        disabled={pending}
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

      {switchError && <span role="alert">{catalogMessages[locale].error}</span>}

      {isClient &&
        createPortal(
          <div
            id={menuId}
            ref={dropdownRef}
            className={`${dropdownStyles.dropdown} ${styles.dropdown}`}
            role="listbox"
            data-open={expanded || undefined}
            style={{
              left: `${left}px`,
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
            }}
          >
            <span className={styles.dropdownGlow} aria-hidden />
            {LOCALE_ORDER.map((item, index) => {
              const isActive = item === locale;
              return (
                <div key={item} className={styles.optionGroup}>
                  {index > 0 && <div className={styles.divider} aria-hidden />}
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
          </div>,
          document.body
        )}

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
