import type { Locale } from "@/lang";
import type { CategoryNode } from "@/lib/categories/data";
import { computeSubcategoryPositions } from "@/lib/categories/subcategoryLayout";
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

  return (
    <div className={styles.ring}>
      {subcategories.map((subcategory, index) => (
        <SubcategoryNode
          key={subcategory.slug}
          href={`/categories/${[...basePath, subcategory.slug].join("/")}`}
          label={subcategory.title[locale]}
          icon={subcategory.icon}
          position={positions[index]}
        />
      ))}
    </div>
  );
}
