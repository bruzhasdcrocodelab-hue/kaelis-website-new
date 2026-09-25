"use client";

import Image from "next/image";
import type { Dictionary, Locale } from "@/lang";
import { useCategories } from "@/components/categories/CatalogProvider";
import CatalogStatus from "@/components/categories/CatalogStatus";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import ConstellationPattern from "@/components/categories-list-page/ConstellationPattern";
import StarField from "@/components/categories-list-page/StarField";
import CategoriesListSection from "@/components/categories-list-page/CategoriesListSection";
import styles from "./CategoriesListView.module.css";

export interface CategoriesListViewProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function CategoriesListView({
  dictionary,
  locale,
}: CategoriesListViewProps) {
  const { state, retry } = useCategories();
  return (
    <div className={styles.page}>
      <div className={styles.backgroundGradient} aria-hidden />
      <ConstellationPattern />
      <Image
        src="/images/backgrounds/patterns-left-gradient.svg"
        alt=""
        width={340}
        height={750}
        className={`${styles.patternLeft} ${styles.patternDesktop}`}
        priority
      />
      <Image
        src="/images/backgrounds/patterns-right-gradient.svg"
        alt=""
        width={340}
        height={750}
        className={`${styles.patternRight} ${styles.patternDesktop}`}
        priority
      />
      <Image
        src="/images/backgrounds/mobile/patterns-left-gradient.svg"
        alt=""
        width={78}
        height={1234}
        className={`${styles.patternLeft} ${styles.patternMobile}`}
        priority
      />
      <Image
        src="/images/backgrounds/mobile/patterns-right-gradient.svg"
        alt=""
        width={78}
        height={1234}
        className={`${styles.patternRight} ${styles.patternMobile}`}
        priority
      />
      <StarField />
      <div className={styles.content}>
        <Header dictionary={dictionary.header} locale={locale} />
        {state.status === "success" && <CategoriesListSection
          dictionary={dictionary.categoriesList}
          locale={locale}
          categories={state.data}
        />}
        {state.status !== "success" && <div className={styles.pending}><CatalogStatus locale={locale} status={state.status} retry={retry} /></div>}
        {state.status === "success" && state.data.length === 0 && <CatalogStatus locale={locale} status="empty" />}
        <Footer dictionary={dictionary.footer} variant="on-dark" />
      </div>
    </div>
  );
}
