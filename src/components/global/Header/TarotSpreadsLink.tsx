"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import dropdownStyles from "./HeaderDropdown.module.css";
import Link from "@/components/reading/ReadingLink";
import type { Locale } from "@/lang";
import { useCategories } from "@/components/categories/CatalogProvider";
import CatalogStatus from "@/components/categories/CatalogStatus";
import { categoryHref } from "@/lib/categories/catalog";
import styles from "./TarotSpreadsLink.module.css";

export interface TarotSpreadsLinkProps {
  className?: string;
  locale: Locale;
  children: React.ReactNode;
}

const DROPDOWN_COLUMN_SIZE = 3;
const CLOSE_DELAY_MS = 150;

function chunk<T>(items: T[], size: number): T[][] {
  const columns: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    columns.push(items.slice(i, i + size));
  }
  return columns;
}

const noop = () => () => {};

/** SSR-safe: false on the server, true once mounted in the browser. */
function useIsClient() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  );
}

export default function TarotSpreadsLink({ className, locale, children }: TarotSpreadsLinkProps) {
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();
  const { state, retry } = useCategories();
  const categories = state.status === "success" ? state.data : [];
  const columns = chunk(categories, DROPDOWN_COLUMN_SIZE);

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openNow() {
    cancelClose();
    setOpen(true);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      data-header-dropdown-open={open || undefined}
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
    >
      <Link
        href="/categories"
        className={`${styles.link} ${className ?? ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        data-open={open || undefined}
        onFocus={openNow}
        onClick={() => setOpen(false)}
      >
        <span>{children}</span>
        <span
          className={styles.chevron}
          style={{
            maskImage: "url(/icons/chevron-down.svg)",
            WebkitMaskImage: "url(/icons/chevron-down.svg)",
          }}
          aria-hidden
        />
      </Link>

      {isClient &&
        createPortal(
          <div
            id={menuId}
            className={`${dropdownStyles.dropdown} ${styles.dropdown}`}
            role="menu"
            data-open={open || undefined}
            style={{
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
            }}
            onMouseEnter={openNow}
            onMouseLeave={scheduleClose}
          >
            <span className={styles.dropdownGlow} aria-hidden />
            {state.status !== "success" && <CatalogStatus locale={locale} status={state.status} retry={retry} />}
            {state.status === "success" && categories.length === 0 && <CatalogStatus locale={locale} status="empty" />}
            {columns.map((column, columnIndex) => (
              <div key={column[0]?.slug ?? columnIndex} className={styles.columnGroup}>
                {columnIndex > 0 && <div className={styles.separator} aria-hidden />}
                <div className={styles.column}>
                  {column.map((category) => (
                    <Link
                      key={category.slug}
                      href={categoryHref(category.slug)}
                      role="menuitem"
                      className={`font-instrument-base ${styles.item}`}
                      onClick={() => setOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
