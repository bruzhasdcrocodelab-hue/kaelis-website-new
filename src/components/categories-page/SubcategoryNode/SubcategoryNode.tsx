import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CategoryIcon } from "@/lib/categories/data";
import type { SubcategoryPosition } from "@/lib/categories/subcategoryLayout";
import styles from "./SubcategoryNode.module.css";
import { Locale } from "@/lang";

export interface SubcategoryNodeProps {
  href: string;
  label: string;
  icon: CategoryIcon;
  position: SubcategoryPosition;
  locale: Locale;
}

const ICON_SRC: Record<CategoryIcon, string> = {
  star: "/icons/main-star.svg",
  "filled-star": "/icons/filled-main-star.svg",
};

/** Deterministic 0..1 hash so each node gets a stable but distinct animation offset (no SSR/CSR mismatch). */
function seededUnit(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return (hash >>> 0) / 0xffffffff;
}

// Keep in sync with --node-float-duration / --node-icon-pulse-duration in tokens.css.
const NODE_FLOAT_DURATION_S = 6;
const NODE_ICON_PULSE_DURATION_S = 2.2;

export default function SubcategoryNode({ href, label, icon, position, locale }: SubcategoryNodeProps) {
  const floatDelay = -(seededUnit(`${href}:float`) * NODE_FLOAT_DURATION_S).toFixed(2);
  const pulseDelay = -(seededUnit(`${href}:pulse`) * NODE_ICON_PULSE_DURATION_S).toFixed(2);

  return (
    <Link
      href={href}
      className={styles.node}
      style={{ left: `${position.xPct}%`, top: position.yPx }}
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
        <span className={`font-instrument-lg-emphasized ${styles.label}`} lang={locale}>{label}</span>
      </span>
    </Link>
  );
}