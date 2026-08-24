"use client";

import { useLayoutEffect, useRef, useState } from "react";
import styles from "./CategoryHeroSection.module.css";

export interface CategoryTitleProps {
  title: string;
}

/** Detects whether `title` wraps onto a second line so we can apply the tighter two-line styling. */
export default function CategoryTitle({ title }: CategoryTitleProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [wrapped, setWrapped] = useState(false);

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
    <p
      ref={ref}
      className={`font-bona-category-title ${styles.title} ${wrapped ? styles.titleWrapped : ""}`}
    >
      {title}
    </p>
  );
}
