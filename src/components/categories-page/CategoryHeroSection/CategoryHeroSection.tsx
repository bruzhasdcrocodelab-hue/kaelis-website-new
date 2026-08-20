import type { Dictionary, Locale } from "@/lang";
import type { CategoryNode } from "@/lib/categories/data";
import MainButton from "@/components/global/MainButton";
import SubcategoryRing from "@/components/categories-page/SubcategoryRing";
import CategoryTitle from "./CategoryTitle";
import styles from "./CategoryHeroSection.module.css";

export interface CategoryHeroSectionProps {
  dictionary: Dictionary["categoryPage"];
  locale: Locale;
  current: CategoryNode;
  /** Slug path to the currently viewed node, used to build subcategory links. */
  path: string[];
  returnHref: string;
  returnLabel: string;
}

export default function CategoryHeroSection({
  dictionary,
  locale,
  current,
  path,
  returnHref,
  returnLabel,
}: CategoryHeroSectionProps) {
  return (
    <section className={styles.section}>
      <SubcategoryRing subcategories={current.subcategories} basePath={path} locale={locale} />

      <div className={styles.container}>
        <MainButton variant="stroke" size="medium" href={returnHref}>
          {returnLabel}
        </MainButton>

        <div className={styles.content}>
          <div className={styles.titleBlock}>
            <p className={`font-instrument-base-emphasized ${styles.eyebrow}`}>
              {dictionary.categoryLabel}
            </p>
            <div className={styles.titleWrap}>
              <CategoryTitle title={current.title[locale]} />
              <p className={`font-instrument-sm ${styles.description}`}>
                {current.description[locale]}
              </p>
            </div>
          </div>

          <MainButton
            variant="gradient-black"
            size="large"
            icon="/icons/right-arrow.svg"
            href="/"
            className="shadow-default"
            muted
          >
            {dictionary.getYourReadings}
          </MainButton>
        </div>
      </div>
    </section>
  );
}
