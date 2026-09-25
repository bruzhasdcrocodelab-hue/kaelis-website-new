"use client";

import { useLayoutEffect, useRef } from "react";
import type { Locale } from "@/lang";
import { spreadHref, type TarotSpread } from "@/lib/categories/catalog";
import {
  computeSubcategoryMobileRows,
  computeSubcategoryPositions,
  isFilledStarCell,
  isFilledStarSlot,
} from "@/lib/categories/subcategoryLayout";
import SubcategoryNode from "@/components/categories-page/SubcategoryNode";
import styles from "./SubcategoryRing.module.css";

export interface SubcategoryRingProps {
  subcategories: TarotSpread[];
  /** Slug path of the currently viewed category/subcategory, used to build child links. */
  basePath: string[];
  locale: Locale;
}

export default function SubcategoryRing({ subcategories, basePath, locale }: SubcategoryRingProps) {
  const ringRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const ring = ringRef.current;
    const section = ring?.closest("section");
    if (!ring || !section) return;
    const measure = () => {
      const bottom = Math.max(0, ...Array.from(ring.children, node => {
        const el = node as HTMLElement;
        return ring.offsetTop + el.offsetTop + el.offsetHeight;
      }));
      // Reserve the whole arc, including float/hover motion and breathing room.
      section.style.setProperty("--arc-min-height", `${bottom + 32}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(ring);
    Array.from(ring.children).forEach(node => observer.observe(node));
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      section.style.removeProperty("--arc-min-height");
    };
  }, [subcategories, locale]);
  if (subcategories.length === 0) return null;

  const positions = computeSubcategoryPositions(subcategories.length);
  const hrefFor = (subcategory: TarotSpread) => spreadHref(basePath[0], subcategory.slug);

  const rowSizes = computeSubcategoryMobileRows(subcategories.length);
  const rows: TarotSpread[][] = [];
  let cursor = 0;
  for (const size of rowSizes) {
    rows.push(subcategories.slice(cursor, cursor + size));
    cursor += size;
  }

  return (
    <>
      <div ref={ringRef} className={styles.ring}>
        {subcategories.map((subcategory, index) => (
          <SubcategoryNode
            key={subcategory.slug}
            href={hrefFor(subcategory)}
            label={subcategory.name}
            filled={isFilledStarSlot(positions[index])}
            position={positions[index]}
            locale={locale}
          />
        ))}
      </div>

      <div className={styles.rows}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((subcategory, colIndex) => (
              <SubcategoryNode
                key={subcategory.slug}
                href={hrefFor(subcategory)}
                label={subcategory.name}
                filled={isFilledStarCell(rowIndex, colIndex)}
                locale={locale}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
