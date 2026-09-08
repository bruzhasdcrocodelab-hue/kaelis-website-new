"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lang";
import OurAppLink from "./OurAppLink";
import styles from "./MobileMenu.module.css";

export interface MobileMenuProps {
  dictionary: Dictionary["header"];
}

export default function MobileMenu({ dictionary }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
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

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={dictionary.nav.termsOfUse}
        className={`${styles.toggle} ${open ? styles.toggleActive : ""}`}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.toggleIcon} />
      </button>
      {open && (
        <div className={`shadow-medium ${styles.menu}`} role="menu">
          <Link
            href="/categories"
            role="menuitem"
            className={`font-instrument-sm-emphasized ${styles.item}`}
            onClick={() => setOpen(false)}
          >
            {dictionary.nav.tarotSpreads}
          </Link>
          <div className={styles.divider} />
          <OurAppLink
            role="menuitem"
            className={`font-instrument-sm-emphasized ${styles.item}`}
            onClick={() => setOpen(false)}
          >
            {dictionary.nav.ourApp}
          </OurAppLink>
          <div className={styles.divider} />
          <Link
            href="/terms-of-use"
            role="menuitem"
            className={`font-instrument-sm-emphasized ${styles.item}`}
            onClick={() => setOpen(false)}
          >
            {dictionary.nav.termsOfUse}
          </Link>
        </div>
      )}
    </div>
  );
}
