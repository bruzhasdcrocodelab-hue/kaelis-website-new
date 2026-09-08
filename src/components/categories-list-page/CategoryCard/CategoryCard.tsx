import Link from "next/link";
import type { CSSProperties } from "react";
import type { Locale } from "@/lang";
import { htmlLang } from "@/lang";
import styles from "./CategoryCard.module.css";

export interface CategoryCardProps {
  href: string;
  title: string;
  description: string;
  locale: Locale;
  /** Checkerboard choice: filled star vs. outline star, decided by the grid position. */
  filled: boolean;
  /** Negative index used to stagger the twinkle of the card's star. */
  starDelay: number;
}

export default function CategoryCard({
  href,
  title,
  description,
  locale,
  filled,
  starDelay,
}: CategoryCardProps) {
  return (
    <Link href={href} className={styles.card} lang={htmlLang[locale]}>
      {!filled ?
      <svg className={styles.border} preserveAspectRatio="none" aria-hidden focusable="false">
        <defs>
          <linearGradient id="categoryCardBorder" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-gold)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--color-gold)" />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="20"
          ry="20"
          fill="none"
          stroke="url(#categoryCardBorder)"
        />
      </svg> : <></>}
      <span className={`font-instrument-lg-emphasized ${styles.title}`}>{title}</span>
      <span className={`font-instrument-xs ${styles.description}`}>{description}</span>
      <span
        className={`${styles.star} ${filled ? styles.starFilled : styles.starOutline}`}
        style={{ "--star-delay": `${starDelay}s` } as CSSProperties}
        aria-hidden
      />
    </Link>
  );
}
