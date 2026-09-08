import type { Dictionary, Locale } from "@/lang";
import type { CategoryListItem } from "@/lib/categories/list";
import CategoryCard from "@/components/categories-list-page/CategoryCard";
import styles from "./CategoriesListSection.module.css";

export interface CategoriesListSectionProps {
  dictionary: Dictionary["categoriesList"];
  locale: Locale;
  categories: CategoryListItem[];
}

export default function CategoriesListSection({
  dictionary,
  locale,
  categories,
}: CategoriesListSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <p className={`font-instrument-base-emphasized ${styles.eyebrow}`}>{dictionary.eyebrow}</p>
        <h1 className={`font-bona-category-title ${styles.title}`}>{dictionary.title}</h1>
        <p className={`font-instrument-sm ${styles.description}`}>{dictionary.description}</p>
      </div>

      <div className={styles.grid}>
        {categories.map((category, index) => {
          const isTrailingPair =
            categories.length % 3 === 2 && index === categories.length - 1;
          const column = isTrailingPair ? 2 : index % 3;
          const row = Math.floor(index / 3);

          return (
            <div
              key={category.slug}
              className={`${styles.cell} ${column === 1 ? styles.cellLowered : ""} ${
                isTrailingPair ? styles.cellLastColumn : ""
              }`}
            >
              <CategoryCard
                href={`/categories/${category.slug}`}
                title={category.title[locale]}
                description={category.description[locale]}
                locale={locale}
                filled={(row + column) % 2 === 0}
                starDelay={-((index * 0.53) % 2.6)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
