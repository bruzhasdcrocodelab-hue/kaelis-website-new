import type { CSSProperties } from "react";
import Image from "next/image";
import Link, { type LinkProps } from "next/link";
import type { SubcategoryPosition } from "@/lib/categories/subcategoryLayout";
import styles from "./SubcategoryNode.module.css";
import { htmlLang, Locale } from "@/lang";
import { isSingleWord, withSoftHyphens } from "@/lib/hyphenate";

export interface SubcategoryNodeProps {
  href: string;
  label: string;
  /** Whether this tile uses the filled star icon, chosen by its position (checkerboard). */
  filled: boolean;
  /** Absolute position on the desktop arc. Omitted for the in-flow mobile rows. */
  position?: SubcategoryPosition;
  locale: Locale;
  onNavigate?: LinkProps["onNavigate"];
}

const ICON_SRC = {
  plain: "/icons/main-star.svg",
  filled: "/icons/filled-main-star.svg",
} as const;

function seededUnit(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return (hash >>> 0) / 0xffffffff;
}

const NODE_FLOAT_DURATION_S = 6;
const NODE_ICON_PULSE_DURATION_S = 2.2;

export default function SubcategoryNode({ href, label, filled, position, locale, onNavigate }: SubcategoryNodeProps) {
  const floatDelay = -(seededUnit(`${href}:float`) * NODE_FLOAT_DURATION_S).toFixed(2);
  const pulseDelay = -(seededUnit(`${href}:pulse`) * NODE_ICON_PULSE_DURATION_S).toFixed(2);
  const displayLabel = isSingleWord(label) ? withSoftHyphens(label) : label;

  return (
    <Link
      href={href}
      onNavigate={onNavigate}
      className={`${styles.node} ${position ? styles.nodeArc : styles.nodeFlow}`}
      style={
        position
          ? {
              left: `calc(50% + (${position.xOffset} * clamp(900px, 109.722vw, 1580px)))`,
              top: `calc(${position.yOffset} * clamp(900px, 109.722vw, 1580px))`,
            }
          : undefined
      }
    >
      <span
        className={styles.float}
        style={
          {
            "--node-float-delay": `${floatDelay}s`,
            "--node-icon-pulse-delay": `${pulseDelay}s`,
          } as CSSProperties
        }
      >
        <Image
          src={filled ? ICON_SRC.plain : ICON_SRC.filled}
          alt=""
          width={50}
          height={62}
          className={styles.icon}
        />
        <span className={`font-instrument-lg-emphasized ${styles.label}`} lang={htmlLang[locale]}>{displayLabel}</span>
      </span>
    </Link>
  );
}
