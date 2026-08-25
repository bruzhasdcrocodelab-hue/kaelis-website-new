import Image from "next/image";
import type { Dictionary, Locale } from "@/lang";
import type { CategoryNode } from "@/lib/categories/data";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import CategoryHeroSection from "@/components/categories-page/CategoryHeroSection";
import CategoryTopBlock from "@/components/categories-page/CategoryTopBlock";
import ConstellationPattern from "@/components/categories-page/ConstellationPattern";
import styles from "./CategoryPageView.module.css";

export interface CategoryPageViewProps {
  dictionary: Dictionary;
  locale: Locale;
  current: CategoryNode;
  /** The top-level category name, shown in TopBlock's "Category: X" label regardless of depth. */
  topLevelCategory: CategoryNode;
  /** Slug path to the currently viewed node. */
  path: string[];
  returnHref: string;
  returnLabel: string;
}

export default function CategoryPageView({
  dictionary,
  locale,
  current,
  topLevelCategory,
  path,
  returnHref,
  returnLabel,
}: CategoryPageViewProps) {
  return (
    <div className={styles.page}>
      <Image
        src="/images/backgrounds/main.png"
        alt=""
        width={1440}
        height={990}
        className={styles.backgroundImage}
        priority
      />
      <ConstellationPattern />
      <div className={styles.content}>
        <Header dictionary={dictionary.header} locale={locale} />
        <CategoryHeroSection
          dictionary={dictionary.categoryPage}
          locale={locale}
          current={current}
          path={path}
          returnHref={returnHref}
          returnLabel={returnLabel}
        />
        <CategoryTopBlock
          dictionary={dictionary.categoryPage.topBlock}
          locale={locale}
          categoryLabel={topLevelCategory.title[locale]}
          maxSelectableCards={current.maxSelectableCards}
        />
        <Footer dictionary={dictionary.footer} />
      </div>
    </div>
  );
}
