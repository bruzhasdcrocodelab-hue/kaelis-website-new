"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lang";
import { useCategories } from "@/components/categories/CatalogProvider";
import CatalogStatus from "@/components/categories/CatalogStatus";
import { categoryHref } from "@/lib/categories/catalog";
import OurAppLink from "./OurAppLink";
import styles from "./MobileMenu.module.css";

export interface MobileMenuProps {
  dictionary: Dictionary["header"];
  locale: Locale;
}

const noop = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  );
}

export default function MobileMenu({ dictionary, locale }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [spreadsOpen, setSpreadsOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const isClient = useIsClient();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { state, retry } = useCategories();
  const categories = state.status === "success" ? state.data : [];

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const button = wrapperRef.current?.getBoundingClientRect();
      if (button) setMenuTop(button.bottom + 8);
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        !wrapperRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
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
      if (value) {
        setSpreadsOpen(false);
      } else {
        const button = wrapperRef.current?.getBoundingClientRect();
        if (button) setMenuTop(button.bottom + 8);
      }
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
        {/* <span className={styles.toggleIcon} /> */}
        <span className={`${styles.toggleIcon} ${open ? styles.toggleIconActive : ""}`} />
      </button>
      {open &&
        isClient &&
        createPortal(
          <div
            ref={menuRef}
            className={styles.menu}
            role="menu"
            style={{
              top: menuTop,
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
                    {state.status !== "success" && <CatalogStatus locale={locale} status={state.status} retry={retry} />}
                    {state.status === "success" && categories.length === 0 && <CatalogStatus locale={locale} status="empty" />}
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={categoryHref(category.slug)}
                        role="menuitem"
                        className={`font-instrument-sm-emphasized ${styles.gridItem}`}
                        onClick={closeMenu}
                      >
                        {category.name}
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
          </div>,
          document.body
        )}
    </div>
  );
}
