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
  /** Same checkerboard choice for the 2-column mobile grid, which resolves the card positions differently. */
  mobileFilled: boolean;
  /** Negative index used to stagger the twinkle of the card's star. */
  starDelay: number;
}

export default function CategoryCard({
  href,
  title,
  description,
  locale,
  filled,
  mobileFilled,
  starDelay,
}: CategoryCardProps) {
  // Unique per card so the always-rendered <defs> gradients never collide when
  // one card's border svg is display:none for the current breakpoint.
  const gradientId = `categoryCardBorder-${href.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  const borderClassName = [
    styles.border,
    filled ? "" : styles.borderHiddenDesktop,
    mobileFilled ? "" : styles.borderHiddenMobile,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={href}
      className={styles.card}
      lang={htmlLang[locale]}
      style={{
        // Inline so the build's CSS pipeline doesn't drop the unprefixed property.
        // --category-card-blur is 0 on desktop and --blur-default on mobile.
        backdropFilter: "blur(var(--category-card-blur))",
        WebkitBackdropFilter: "blur(var(--category-card-blur))",
      }}
    >
      <svg className={borderClassName} preserveAspectRatio="none" aria-hidden focusable="false">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
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
          stroke={`url(#${gradientId})`}
        />
      </svg>
      <span className={`font-instrument-lg-emphasized ${styles.title}`}>{title}</span>
      <span className={`font-instrument-xs ${styles.description}`}>{description}</span>
      <span
        className={`${styles.star} ${filled ? styles.starFilled : styles.starOutline} ${
          mobileFilled ? styles.starFilledMobile : styles.starOutlineMobile
        }`}
        style={{ "--star-delay": `${starDelay}s` } as CSSProperties}
        aria-hidden
      />
    </Link>
  );
}
