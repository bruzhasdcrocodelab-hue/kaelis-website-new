"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./CategoryHeroSection.module.css";
import { htmlLang, type Locale } from "@/lang";

export interface CategoryTitleProps {
  title: string;
  locale: Locale;
}

export default function CategoryTitle({ title, locale }: CategoryTitleProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = title.replace(/\u00ad/g, "").trim().split(/\s+/);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let disposed = false;
    const fit = () => {
      if (disposed) return;
      el.style.removeProperty("font-size");
      const base = parseFloat(getComputedStyle(el).fontSize);
      const maxHeight = base * .95 * (words.length > 1 ? 2 : 1) + 1;
      const fits = () => el.scrollWidth <= el.clientWidth && el.getBoundingClientRect().height <= maxHeight;
      if (fits()) return;
      let low = 1, high = base;
      for (let i = 0; i < 14; i++) {
        const size = (low + high) / 2;
        el.style.fontSize = `${size}px`;
        if (fits()) low = size; else high = size;
      }
      el.style.fontSize = `${low}px`;
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
    <p ref={ref} className={`font-bona-category-title ${styles.title}`} lang={htmlLang[locale]}>
      {words.map((word, index) => <span key={index}>{index > 0 && " "}<span className={styles.titleWord}>{word}</span></span>)}
    </p>
  );
}
