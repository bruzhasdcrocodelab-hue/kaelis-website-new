import Image from "next/image";
import type { Dictionary, Locale } from "@/lang";
import type { CategoryListItem } from "@/lib/categories/list";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import ConstellationPattern from "@/components/categories-list-page/ConstellationPattern";
import StarField from "@/components/categories-list-page/StarField";
import CategoriesListSection from "@/components/categories-list-page/CategoriesListSection";
import styles from "./CategoriesListView.module.css";

export interface CategoriesListViewProps {
  dictionary: Dictionary;
  locale: Locale;
  categories: CategoryListItem[];
}

export default function CategoriesListView({
  dictionary,
  locale,
  categories,
}: CategoriesListViewProps) {
  return (
    <div className={styles.page}>
      <div className={styles.backgroundGradient} aria-hidden />
      <ConstellationPattern />
      <Image
        src="/images/backgrounds/patterns-left-gradient.svg"
        alt=""
        width={340}
        height={750}
        className={styles.patternLeft}
        priority
      />
      <Image
        src="/images/backgrounds/patterns-right-gradient.svg"
        alt=""
        width={340}
        height={750}
        className={styles.patternRight}
        priority
      />
      <StarField />
      <div className={styles.content}>
        <Header dictionary={dictionary.header} locale={locale} />
        <CategoriesListSection
          dictionary={dictionary.categoriesList}
          locale={locale}
          categories={categories}
        />
        <Footer dictionary={dictionary.footer} />
      </div>
    </div>
  );
}
