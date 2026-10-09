import type { Dictionary, Locale } from "@/lang";
import { categoryHref, type TarotCategory } from "@/lib/categories/catalog";
import CategoryCard from "@/components/categories-list-page/CategoryCard";
import { getSeo } from "@/lib/seo";
import styles from "./CategoriesListSection.module.css";

export interface CategoriesListSectionProps {
  dictionary: Dictionary["categoriesList"];
  locale: Locale;
  categories: TarotCategory[];
}

export default function CategoriesListSection({
  dictionary,
  locale,
  categories,
}: CategoriesListSectionProps) {
  const title = getSeo(locale, "/tarot")?.h1 ?? dictionary.title;
  const formattedTitle = locale === "en"
    ? title.replace(" Reading", "\nReading")
    : title.replace(" ", "\n").replace(" на ", "\nна ");

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <p className={`font-instrument-base-emphasized ${styles.eyebrow}`}>{dictionary.eyebrow}</p>
        <h1 className={`font-bona-category-title ${styles.title}`}>{formattedTitle}</h1>
        <p className={`font-instrument-sm ${styles.description}`}>{dictionary.description}</p>
      </div>

      <div className={styles.grid}>
        {categories.map((category, index) => {
          const isTrailingPair =
            categories.length % 3 === 2 && index === categories.length - 1;
          const column = isTrailingPair ? 2 : index % 3;
          const row = Math.floor(index / 3);

          const mobileColumn = index % 2;
          const mobileRow = Math.floor(index / 2);

          return (
            <div
              key={category.slug}
              className={`${styles.cell} ${column === 1 ? styles.cellLowered : ""} ${
                isTrailingPair ? styles.cellLastColumn : ""
              }`}
            >
              <CategoryCard
                href={categoryHref(category.slug, locale)}
                title={category.name}
                description={category.site_description}
                locale={locale}
                filled={(row + column) % 2 !== 0}
                mobileFilled={(mobileRow + mobileColumn) % 2 !== 0}
                starDelay={-((index * 0.53) % 2.6)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
