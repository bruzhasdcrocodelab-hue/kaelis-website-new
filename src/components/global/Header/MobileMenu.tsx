"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lang";
import { getCategoryList } from "@/lib/categories/list";
import OurAppLink from "./OurAppLink";
import styles from "./MobileMenu.module.css";

export interface MobileMenuProps {
  dictionary: Dictionary["header"];
  locale: Locale;
}

export default function MobileMenu({ dictionary, locale }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [spreadsOpen, setSpreadsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const categories = getCategoryList();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSpreadsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setSpreadsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
    setSpreadsOpen(false);
  }

  function toggleMenu() {
    setOpen((value) => {
      if (value) setSpreadsOpen(false);
      return !value;
    });
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={dictionary.nav.tarotSpreads}
        className={`${styles.toggle} ${open ? styles.toggleActive : ""}`}
        onClick={toggleMenu}
        style={{
          backdropFilter: "var(--menu-toggle-blur)",
          WebkitBackdropFilter: "var(--menu-toggle-blur)",
        }}
      >
        <span className={styles.toggleIcon} />
      </button>
      {open && (
        <div
          className={styles.menu}
          role="menu"
          style={{
            backdropFilter: "blur(var(--blur-panel))",
            WebkitBackdropFilter: "blur(var(--blur-panel))",
          }}
        >
          <div className={styles.section}>
            <button
              type="button"
              aria-expanded={spreadsOpen}
              className={`font-instrument-sm-emphasized ${styles.item} ${styles.trigger}`}
              onClick={() => setSpreadsOpen((value) => !value)}
            >
              <span>{dictionary.nav.tarotSpreads}</span>
              <span
                className={`${styles.chevron} ${spreadsOpen ? styles.chevronOpen : ""}`}
                style={{
                  maskImage: "url(/icons/chevron-down.svg)",
                  WebkitMaskImage: "url(/icons/chevron-down.svg)",
                }}
                aria-hidden
              />
            </button>
            <div
              className={`${styles.collapsible} ${spreadsOpen ? styles.collapsibleOpen : ""}`}
            >
              <div className={styles.collapsibleInner}>
                <div className={styles.divider} />
                <div className={styles.grid}>
                  <Link
                    href="/categories"
                    role="menuitem"
                    className={`font-instrument-sm-emphasized ${styles.gridItem}`}
                    onClick={closeMenu}
                  >
                    {dictionary.allTarotSpreads}
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      role="menuitem"
                      className={`font-instrument-sm-emphasized ${styles.gridItem}`}
                      onClick={closeMenu}
                    >
                      {category.title[locale]}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.divider} />
          <OurAppLink
            role="menuitem"
            className={`font-instrument-sm-emphasized ${styles.item}`}
            onClick={closeMenu}
          >
            {dictionary.nav.ourApp}
          </OurAppLink>
          <div className={styles.divider} />
          <Link
            href="/terms-of-use"
            role="menuitem"
            className={`font-instrument-sm-emphasized ${styles.item}`}
            onClick={closeMenu}
          >
            {dictionary.nav.termsOfUse}
          </Link>
        </div>
      )}
    </div>
  );
}
