import type { Locale } from "@/lang";
import type { CategoryNode } from "@/lib/categories/data";
import {
  computeSubcategoryMobileRows,
  computeSubcategoryPositions,
  isFilledStarCell,
  isFilledStarSlot,
} from "@/lib/categories/subcategoryLayout";
import SubcategoryNode from "@/components/categories-page/SubcategoryNode";
import styles from "./SubcategoryRing.module.css";

export interface SubcategoryRingProps {
  subcategories: CategoryNode[];
  /** Slug path of the currently viewed category/subcategory, used to build child links. */
  basePath: string[];
  locale: Locale;
}

export default function SubcategoryRing({ subcategories, basePath, locale }: SubcategoryRingProps) {
  if (subcategories.length === 0) return null;

  const positions = computeSubcategoryPositions(subcategories.length);
  const hrefFor = (subcategory: CategoryNode) =>
    `/categories/${[...basePath, subcategory.slug].join("/")}`;

  const rowSizes = computeSubcategoryMobileRows(subcategories.length);
  const rows: CategoryNode[][] = [];
  let cursor = 0;
  for (const size of rowSizes) {
    rows.push(subcategories.slice(cursor, cursor + size));
    cursor += size;
  }

  return (
    <>
      <div className={styles.ring}>
        {subcategories.map((subcategory, index) => (
          <SubcategoryNode
            key={subcategory.slug}
            href={hrefFor(subcategory)}
            label={subcategory.title[locale]}
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
                label={subcategory.title[locale]}
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
