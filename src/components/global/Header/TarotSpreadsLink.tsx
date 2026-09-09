"use client";

import { useEffect, useId, useRef, useState } from "react";
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

export default function TarotSpreadsLink({ className, locale, children }: TarotSpreadsLinkProps) {
  const [open, setOpen] = useState(false);
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
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/categories"
        className={`${styles.link} ${className ?? ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onFocus={() => setOpen(true)}
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

      <div id={menuId} className={styles.dropdown} role="menu" data-open={open || undefined}>
        <div className={styles.dropdownInner}>
          {columns.map((column, columnIndex) => (
            <div key={column[0]?.slug ?? columnIndex} className={styles.column}>
              {column.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  role="menuitem"
                  className={`font-instrument-sm-emphasized ${styles.item}`}
                  onClick={() => setOpen(false)}
                >
                  {category.title[locale]}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
