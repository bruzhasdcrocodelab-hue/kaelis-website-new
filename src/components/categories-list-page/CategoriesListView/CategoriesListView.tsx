"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { DesktopGradientPatterns } from "@/components/main-page/HomePatterns/HomePatterns";
import type { Dictionary, Locale } from "@/lang";
import { useCategories } from "@/components/categories/CatalogProvider";
import CatalogStatus from "@/components/categories/CatalogStatus";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import geometryStyles from "@/components/categories/ConstellationGeometry.module.css";
import ConstellationPattern from "@/components/categories-list-page/ConstellationPattern";
import StarField from "@/components/categories-list-page/StarField";
import CategoriesListSection from "@/components/categories-list-page/CategoriesListSection";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import styles from "./CategoriesListView.module.css";

export interface CategoriesListViewProps {
  dictionary: Dictionary;
  locale: Locale;
  children?: ReactNode;
}

export default function CategoriesListView({
  dictionary,
  locale,
  children,
}: CategoriesListViewProps) {
  const { state, retry } = useCategories();
  return (
    <div className={`${geometryStyles.geometry} ${styles.page}`}>
      <div className={styles.backgroundGradient} aria-hidden />
      <ConstellationPattern />
      <DesktopGradientPatterns
        left={`${styles.patternLeft} ${styles.patternDesktop}`}
        right={`${styles.patternRight} ${styles.patternDesktop}`}
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
        <Breadcrumbs locale={locale} items={[
          { label: dictionary.header.logo, href: "/" },
          { label: dictionary.header.allTarotSpreads },
        ]} />
        {state.status === "success" && <CategoriesListSection
          dictionary={dictionary.categoriesList}
          locale={locale}
          categories={state.data}
        />}
        {state.status !== "success" && <div className={styles.pending}><CatalogStatus locale={locale} status={state.status} retry={retry} /></div>}
        {state.status === "success" && state.data.length === 0 && <CatalogStatus locale={locale} status="empty" />}
        {state.status === "success" && children}
        <Footer dictionary={dictionary.footer} locale={locale} variant="on-dark" />
      </div>
    </div>
  );
}
