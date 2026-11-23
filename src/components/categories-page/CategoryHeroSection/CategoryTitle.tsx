"use client";

import styles from "./CategoryHeroSection.module.css";
import { htmlLang, type Locale } from "@/lang";

export interface CategoryTitleProps {
  title: string;
  locale: Locale;
}

export default function CategoryTitle({ title, locale }: CategoryTitleProps) {
  const words = title.replace(/\u00ad/g, "").trim().split(/\s+/);
  return (
    <h1 className={`font-bona-category-title ${styles.title}`} lang={htmlLang[locale]}>
      {words.map((word, index) => <span key={index}>{index > 0 && " "}<span className={styles.titleWord}>{word}</span></span>)}
    </h1>
  );
}
