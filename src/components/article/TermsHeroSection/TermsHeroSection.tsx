"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lang";
import { htmlLang } from "@/lang";
import { withSoftHyphens } from "@/lib/hyphenate";
import styles from "./TermsHeroSection.module.css";

export interface TermsHeroSectionProps {
  dictionary: Dictionary["termsOfUse"];
  locale: Locale;
}

export default function TermsHeroSection({ dictionary, locale }: TermsHeroSectionProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [wrapped, setWrapped] = useState(false);

  const title = dictionary.title
    .split(/(\s+)/)
    .map((part) => (part.trim() ? withSoftHyphens(part) : part))
    .join("");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkWrap = () => {
      const range = document.createRange();
      range.selectNodeContents(el);
      setWrapped(range.getClientRects().length > 1);
    };

    checkWrap();

    const observer = new ResizeObserver(checkWrap);
    observer.observe(el);
    return () => observer.disconnect();
  }, [title]);

  return (
    <section className={styles.section}>
      <div className={styles.titleBlock}>
        <p className={`font-instrument-base-emphasized ${styles.eyebrow}`}>{dictionary.eyebrow}</p>
        <p
          ref={ref}
          className={`font-bona-terms-title ${styles.title} ${wrapped ? styles.titleWrapped : ""}`}
          lang={htmlLang[locale]}
        >
          {title}
        </p>
      </div>
      <p className={`font-instrument-base ${styles.lastUpdated}`}>{dictionary.lastUpdated}</p>
    </section>
  );
}
