"use client";

import { useRouter } from "next/navigation";
import type { Dictionary, Locale } from "@/lang";
import type { TarotCategory, TarotSpread } from "@/lib/categories/catalog";
import SubcategoryRing from "@/components/categories-page/SubcategoryRing";
import CategoryTitle from "./CategoryTitle";
import type { TarotPageHero } from "@/lib/categories/tarotPage";
import styles from "./CategoryHeroSection.module.css";

export interface CategoryHeroSectionProps {
  dictionary: Dictionary["categoryPage"];
  locale: Locale;
  current: TarotCategory | TarotSpread;
  spreads: TarotSpread[];
  path: string[];
  returnHref: string;
  returnLabel: string;
  hero?: TarotPageHero;
  exploreLabel?: string;
  scrollTargetId: string;
}

export default function CategoryHeroSection({
  dictionary,
  locale,
  current,
  spreads,
  path,
  returnHref,
  returnLabel,
  hero,
  exploreLabel,
  scrollTargetId,
}: CategoryHeroSectionProps) {
  const hasSubcategories = spreads.length > 1;
  const fallbackDescription = locale === "en"
    ? "Ask your own question about dating or relationships, or choose a spread for the situation you’re in."
    : locale === "ru"
      ? "Задайте свой вопрос об отношениях или выберите расклад для вашей ситуации."
      : "Поставте своє питання про стосунки або виберіть розклад для своєї ситуації.";
  const router = useRouter();

  return (
    <section className={styles.section}>
      <div className={`${styles.container} ${hasSubcategories ? styles.containerWithRows : ""}`}>

        <div className={styles.content}>
          <div className={styles.titleBlock}>
            <div className={styles.titleWrap}>
              <CategoryTitle title={hero?.h1 || current.name} locale={locale} />
              <p className={`font-instrument-sm ${styles.description}`}>
                {hero?.description || fallbackDescription}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth" });
              router.replace(`${window.location.pathname}${window.location.search}#${scrollTargetId}`, { scroll: false });
            }}
            className={styles.readingsButton}
          >
            <span className={styles.readingsButtonLabel}>{exploreLabel ?? dictionary.getYourReadings}</span>
            <span className={styles.readingsButtonIcon} aria-hidden>↓</span>
          </button>
        </div>

        {hasSubcategories && <SubcategoryRing subcategories={spreads} basePath={path} locale={locale} />}
      </div>
    </section>
  );
}
