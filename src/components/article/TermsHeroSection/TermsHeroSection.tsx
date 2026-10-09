"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lang";
import { htmlLang } from "@/lang";
import styles from "./TermsHeroSection.module.css";

export interface TermsHeroSectionProps {
  dictionary: Dictionary["termsOfUse"];
  locale: Locale;
}

export default function TermsHeroSection({ dictionary, locale }: TermsHeroSectionProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [wrapped, setWrapped] = useState(false);

  const title = dictionary.title.replace(/\u00ad/g, "");
  const words = title.trim().split(/\s+/);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const wordElements = el.querySelectorAll<HTMLElement>(`.${styles.titleWord}`);
    let disposed = false;
    const fit = () => {
      if (disposed) return;
      el.style.removeProperty("font-size");
      const base = parseFloat(getComputedStyle(el).fontSize);
      const maxHeight = base * .95 * (words.length > 1 ? 2 : 1) + 1;
      const fits = () => {
        const box = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        const left = box.left + parseFloat(style.paddingLeft) + 1;
        const right = box.right - parseFloat(style.paddingRight) - 1;
        // Preserve the gutter for glyph overhangs; scrollWidth is rounded and
        // includes padding, so it cannot reliably detect edge clipping.
        return box.height <= maxHeight && Array.from(wordElements).every(word => {
          const bounds = word.getBoundingClientRect();
          return bounds.left >= left && bounds.right <= right;
        });
      };
      if (!fits()) {
        let low = 1, high = base;
        for (let i = 0; i < 14; i++) {
          const size = (low + high) / 2;
          el.style.fontSize = `${size}px`;
          if (fits()) low = size; else high = size;
        }
        el.style.fontSize = `${low}px`;
      }
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      setWrapped(el.getBoundingClientRect().height > lineHeight + 1);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el.parentElement!);
    window.addEventListener("resize", fit);
    document.fonts.addEventListener("loadingdone", fit);
    void document.fonts.ready.then(fit);
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("resize", fit);
      document.fonts.removeEventListener("loadingdone", fit);
    };
  }, [title, locale, words.length]);

  return (
    <section className={styles.section}>
      <div className={styles.titleBlock}>
        <p className={`font-instrument-base-emphasized ${styles.eyebrow}`}>{dictionary.eyebrow}</p>
        <h1
          ref={ref}
          className={`font-bona-terms-title ${styles.title} ${wrapped ? styles.titleWrapped : ""}`}
          lang={htmlLang[locale]}
        >
          {words.map((word, index) => <span key={index}>{index > 0 && " "}<span className={styles.titleWord}>{word}</span></span>)}
        </h1>
      </div>
      <p className={`font-instrument-base ${styles.lastUpdated}`}>{dictionary.lastUpdated}</p>
    </section>
  );
}
