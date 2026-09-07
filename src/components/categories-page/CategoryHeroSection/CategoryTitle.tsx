"use client";

import { useLayoutEffect, useRef, useState } from "react";
import styles from "./CategoryHeroSection.module.css";
import { htmlLang, Locale } from "@/lang";
import { isSingleWord, withSoftHyphens } from "@/lib/hyphenate";

export interface CategoryTitleProps {
  title: string;
  locale: Locale;
}

export default function CategoryTitle({ title, locale }: CategoryTitleProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [wrapped, setWrapped] = useState(false);
  const singleWord = isSingleWord(title);
  const hyphenatedTitle = title
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
  }, [hyphenatedTitle]);

  return (
    <p
      ref={ref}
      className={`font-bona-category-title ${styles.title} ${singleWord ? styles.titleSingleWord : ""} ${wrapped ? styles.titleWrapped : ""}`}
      lang={htmlLang[locale]}
    >
      {hyphenatedTitle}
    </p>
  );
}