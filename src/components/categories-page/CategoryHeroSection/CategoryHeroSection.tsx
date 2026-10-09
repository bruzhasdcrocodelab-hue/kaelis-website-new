"use client";

import { useRouter } from "next/navigation";
import type { Dictionary, Locale } from "@/lang";
import type { TarotCategory, TarotSpread } from "@/lib/categories/catalog";
import MainButton from "@/components/global/MainButton";
import SubcategoryRing from "@/components/categories-page/SubcategoryRing";
import CategoryTitle from "./CategoryTitle";
import { getSeo } from "@/lib/seo";
import styles from "./CategoryHeroSection.module.css";

export interface CategoryHeroSectionProps {
  dictionary: Dictionary["categoryPage"];
  locale: Locale;
  current: TarotCategory | TarotSpread;
  spreads: TarotSpread[];
  path: string[];
  returnHref: string;
  returnLabel: string;
}

export default function CategoryHeroSection({
  dictionary,
  locale,
  current,
  spreads,
  path,
  returnHref,
  returnLabel,
}: CategoryHeroSectionProps) {
  const hasSubcategories = spreads.length > 1;
  const router = useRouter();

  return (
    <section className={styles.section}>
      <div className={`${styles.container} ${hasSubcategories ? styles.containerWithRows : ""}`}>
        <MainButton variant="stroke" size="medium" href={returnHref} className={styles.returnButton}>
          {returnLabel}
        </MainButton>

        <div className={styles.content}>
          <div className={styles.titleBlock}>
            <p className={`font-instrument-base-emphasized ${styles.eyebrow}`}>
              {dictionary.categoryLabel}
            </p>
            <div className={styles.titleWrap}>
              <CategoryTitle title={getSeo(locale, `/tarot/${path.join("/")}`)?.h1 ?? current.name} locale={locale} />
              <p className={`font-instrument-sm ${styles.description}`}>
                {current.site_description || ("description" in current ? current.description : "")}
              </p>
            </div>
          </div>

          <MainButton
            variant="gradient-black"
            size="large"
            icon="/icons/right-arrow.svg"
            onClick={() => {
              document.getElementById("category-top-block")?.scrollIntoView({ behavior: "smooth" });
              router.replace(`${window.location.pathname}${window.location.search}#category-top-block`, { scroll: false });
            }}
            className={`shadow-default ${styles.readingsButton}`}
            muted
          >
            {dictionary.getYourReadings}
          </MainButton>
        </div>

        {hasSubcategories && <SubcategoryRing subcategories={spreads} basePath={path} locale={locale} />}
      </div>
    </section>
  );
}
