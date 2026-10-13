"use client";

import { useLayoutEffect, useRef } from "react";
import type { Locale } from "@/lang";
import { spreadHref, type TarotSpread } from "@/lib/categories/catalog";
import {
  computeSubcategoryMobileRows,
  computeSubcategoryTabletRows,
  computeSubcategoryPositions,
  isFilledStarCell,
  isFilledStarSlot,
  subcategoryBounds,
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
    const content = ring?.parentElement;
    const pattern = section?.parentElement?.parentElement?.querySelector<SVGElement>("[data-subcategory-pattern]");
    if (!ring || !section || !content || !pattern) return;
    const nodes = Array.from(ring.children) as HTMLElement[];
    const obstacles = Array.from(content.querySelectorAll<HTMLElement>(":scope > a, h1, p, button"));
    let frame = 0;
    let disposed = false;
    let sectionWidth = 0;
    const measure = () => {
      if (disposed) return;
      const rect = ring.getBoundingClientRect();
      if (!rect.width) {
        section.style.removeProperty("--arc-min-height");
        ring.dataset.layout = "rows";
        return;
      }
      const obstacleRects = obstacles.map(element => {
        const box = element.getBoundingClientRect();
        return { left: box.left - rect.left, top: box.top - rect.top, right: box.right - rect.left, bottom: box.bottom - rect.top };
      });
      const patternWidth = pattern.getBoundingClientRect().width;
      const measurements = new Map<number, ReturnType<typeof measureNodes>>();
      function measureNodes() {
        return nodes.map(node => {
          const icon = node.querySelector("img")!;
          const float = node.firstElementChild as HTMLElement;
          return {
            width: node.getBoundingClientRect().width,
            height: float.offsetHeight,
            iconWidth: icon.offsetWidth,
            iconHeight: icon.offsetHeight,
            gap: parseFloat(getComputedStyle(float).rowGap),
          };
        });
      }
      for (const degrees of [75, 80, 85, 90]) {
        for (let density = 10; density >= 0; density--) {
          let sizes = measurements.get(density);
          if (!sizes) {
            ring.style.setProperty("--arc-density", `${density / 10}`);
            sizes = measureNodes();
            measurements.set(density, sizes);
          }
          const positions = computeSubcategoryPositions({
            width: rect.width,
            patternWidth,
            nodes: sizes,
            obstacles: obstacleRects,
            sweep: degrees * Math.PI / 180,
          });
          if (!positions) continue;
          ring.style.setProperty("--arc-density", `${density / 10}`);
          positions.forEach((position, index) => {
            nodes[index].style.setProperty("--node-x", `${position.x}px`);
            nodes[index].style.setProperty("--node-y", `${position.y}px`);
          });
          const bottom = Math.max(0, ...positions.flatMap((position, index) => subcategoryBounds(sizes[index], position).map(box => box.bottom)));
          // Reserve the whole arc, including float/hover motion and breathing room.
          section.style.setProperty("--arc-min-height", `${bottom + 32}px`);
          ring.dataset.layout = "arc";
          return;
        }
      }
      ring.dataset.layout = "rows";
      section.style.removeProperty("--arc-min-height");
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(entries => {
      if (entries.some(entry => entry.target !== section || entry.contentRect.width !== sectionWidth)) schedule();
      const sectionEntry = entries.find(entry => entry.target === section);
      if (sectionEntry) sectionWidth = sectionEntry.contentRect.width;
    });
    observer.observe(section);
    observer.observe(pattern);
    [...nodes, ...obstacles].forEach(node => observer.observe(node));
    window.addEventListener("resize", schedule);
    document.fonts.addEventListener("loadingdone", schedule);
    void document.fonts.ready.then(() => { if (!disposed) schedule(); });
    measure();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      document.fonts.removeEventListener("loadingdone", schedule);
      section.style.removeProperty("--arc-min-height");
    };
  }, [subcategories, locale]);
  if (subcategories.length === 0) return null;

  const hrefFor = (subcategory: TarotSpread) => spreadHref(basePath[0], subcategory.slug, locale);

  const renderRows = (rowSizes: number[], className: string) => {
    let cursor = 0;
    return (
      <div className={className}>
        {rowSizes.map((size, rowIndex) => {
          const row = subcategories.slice(cursor, cursor + size);
          cursor += size;
          return (
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
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div ref={ringRef} className={styles.ring}>
        {subcategories.map((subcategory, index) => (
          <SubcategoryNode
            key={subcategory.slug}
            href={hrefFor(subcategory)}
            label={subcategory.name}
            filled={isFilledStarSlot({ side: index % 2 === 0 ? "right" : "left", slotIndex: Math.floor(index / 2) })}
            arc
            locale={locale}
          />
        ))}
      </div>

      {renderRows(computeSubcategoryMobileRows(subcategories.length), styles.rows)}
      {renderRows(computeSubcategoryTabletRows(subcategories.length), `${styles.rows} ${styles.rowsTablet}`)}
    </>
  );
}
