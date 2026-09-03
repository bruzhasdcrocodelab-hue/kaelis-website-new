import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CategoryIcon } from "@/lib/categories/data";
import type { SubcategoryPosition } from "@/lib/categories/subcategoryLayout";
import styles from "./SubcategoryNode.module.css";
import { htmlLang, Locale } from "@/lang";
import { isSingleWord, withSoftHyphens } from "@/lib/hyphenate";

export interface SubcategoryNodeProps {
  href: string;
  label: string;
  icon: CategoryIcon;
  /** Absolute position on the desktop arc. Omitted for the in-flow mobile rows. */
  position?: SubcategoryPosition;
  locale: Locale;
}

const ICON_SRC: Record<CategoryIcon, string> = {
  star: "/icons/main-star.svg",
  "filled-star": "/icons/filled-main-star.svg",
};

function seededUnit(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return (hash >>> 0) / 0xffffffff;
}

const NODE_FLOAT_DURATION_S = 6;
const NODE_ICON_PULSE_DURATION_S = 2.2;

export default function SubcategoryNode({ href, label, icon, position, locale }: SubcategoryNodeProps) {
  const floatDelay = -(seededUnit(`${href}:float`) * NODE_FLOAT_DURATION_S).toFixed(2);
  const pulseDelay = -(seededUnit(`${href}:pulse`) * NODE_ICON_PULSE_DURATION_S).toFixed(2);
  const displayLabel = isSingleWord(label) ? withSoftHyphens(label) : label;

  return (
    <Link
      href={href}
      className={`${styles.node} ${position ? styles.nodeArc : styles.nodeFlow}`}
      style={position ? { left: `${position.xPct}%`, top: position.yPx } : undefined}
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
        <Image src={ICON_SRC[icon]} alt="" width={50} height={62} className={styles.icon} />
        <span className={`font-instrument-lg-emphasized ${styles.label}`} lang={htmlLang[locale]}>{displayLabel}</span>
      </span>
    </Link>
  );
}