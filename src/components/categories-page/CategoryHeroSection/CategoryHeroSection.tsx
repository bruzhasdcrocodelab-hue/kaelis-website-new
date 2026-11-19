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
  description?: string;
  exploreLabel?: string;
}

export default function CategoryHeroSection({
  dictionary,
  locale,
  current,
  spreads,
  path,
  returnHref,
  returnLabel,
  description,
  exploreLabel,
}: CategoryHeroSectionProps) {
  const hasSubcategories = spreads.length > 1;
  const isSpreadPage = spreads.length === 0;
  const fallbackDescription = locale === "en"
    ? "Ask your own question about dating or relationships, or choose a spread for the situation you’re in."
    : locale === "ru"
      ? "Задайте свой вопрос об отношениях или выберите расклад для вашей ситуации."
      : "Поставте своє питання про стосунки або виберіть розклад для своєї ситуації.";
  const router = useRouter();
  const seo = getSeo(locale, `/tarot/${path.join("/")}`);

  return (
    <section className={styles.section}>
      <div className={`${styles.container} ${isSpreadPage ? styles.spreadPage : ""} ${hasSubcategories ? styles.containerWithRows : ""}`}>
        {!isSpreadPage && <MainButton variant="stroke" size="medium" href={returnHref} className={styles.returnButton}>
          {returnLabel}
        </MainButton>}

        <div className={styles.content}>
          <div className={styles.titleBlock}>
            {!isSpreadPage && <p className={`font-instrument-base-emphasized ${styles.eyebrow}`}>
              {dictionary.categoryLabel}
            </p>}
            <div className={styles.titleWrap}>
              <CategoryTitle title={seo?.h1 ?? current.name} locale={locale} />
              <p className={`font-instrument-sm ${styles.description}`}>
                {isSpreadPage ? fallbackDescription : description?.trim() || seo?.intro || (current.site_description || ("description" in current ? current.description : "")) || fallbackDescription}
              </p>
            </div>
          </div>

          <MainButton
            variant={isSpreadPage ? "stroke" : "gradient-black"}
            size="large"
            icon={isSpreadPage ? "/icons/chevron-down.svg" : "/icons/right-arrow.svg"}
            onClick={() => {
              document.getElementById("category-spreads")?.scrollIntoView({ behavior: "smooth" });
              router.replace(`${window.location.pathname}${window.location.search}#category-spreads`, { scroll: false });
            }}
            className={`shadow-default ${styles.readingsButton}`}
            muted={!isSpreadPage}
          >
            {exploreLabel ?? dictionary.getYourReadings}
          </MainButton>
        </div>

        {hasSubcategories && <SubcategoryRing subcategories={spreads} basePath={path} locale={locale} />}
      </div>
    </section>
  );
}
