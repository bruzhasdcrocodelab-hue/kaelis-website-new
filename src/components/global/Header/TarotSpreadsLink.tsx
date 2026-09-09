"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Locale } from "@/lang";
import { getCategoryList } from "@/lib/categories/list";
import styles from "./TarotSpreadsLink.module.css";

export interface TarotSpreadsLinkProps {
  className?: string;
  locale: Locale;
  children: React.ReactNode;
}

const DROPDOWN_COLUMN_SIZE = 3;

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
  const menuId = useId();
  const categories = getCategoryList();
  const columns = chunk(categories, DROPDOWN_COLUMN_SIZE);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        !wrapperRef.current?.contains(target) &&
        !document.getElementById(menuId)?.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open, menuId]);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      data-header-dropdown-open={open || undefined}
    >
      <button
        type="button"
        className={`${styles.link} ${className ?? ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        data-open={open || undefined}
        onClick={() => setOpen((value) => !value)}
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
      </button>

      {isClient &&
        createPortal(
          <div
            id={menuId}
            className={styles.dropdown}
            role="menu"
            data-open={open || undefined}
            style={{
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
            }}
          >
            <span className={styles.dropdownGlow} aria-hidden />
            {columns.map((column, columnIndex) => (
              <div key={column[0]?.slug ?? columnIndex} className={styles.columnGroup}>
                {columnIndex > 0 && <div className={styles.separator} aria-hidden />}
                <div className={styles.column}>
                  {column.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      role="menuitem"
                      className={`font-instrument-base ${styles.item}`}
                      onClick={() => setOpen(false)}
                    >
                      {category.title[locale]}
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
