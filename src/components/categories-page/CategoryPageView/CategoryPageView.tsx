"use client";

import { useState } from "react";
import Link from "@/components/reading/ReadingLink";
import type { Dictionary, Locale } from "@/lang";
import { localizedHref } from "@/lib/routing";
import { cardCount, categoryHref, defaultSpreadSlug, resolveCatalogPath, type CatalogState } from "@/lib/categories/catalog";
import { useAllSpreads, useCategories, useSpreads } from "@/components/categories/CatalogProvider";
import CatalogStatus from "@/components/categories/CatalogStatus";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import geometryStyles from "@/components/categories/ConstellationGeometry.module.css";
import ReadingNavigationProvider from "@/components/reading/ReadingNavigationProvider";
import CategoryHeroSection from "@/components/categories-page/CategoryHeroSection";
import CategoryTopBlock from "@/components/categories-page/CategoryTopBlock";
import CategoryAskBlock from "@/components/categories-page/CategoryAskBlock";
import CategorySpreadsSection from "@/components/categories-page/CategorySpreadsSection";
import CategoryLearningSection from "@/components/categories-page/CategoryLearningSection";
import ConstellationPattern from "@/components/categories-page/ConstellationPattern";
import StarField from "@/components/categories-list-page/StarField";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import FaqSection from "@/components/faq/FaqSection";
import type { FaqItem } from "@/lib/faq/content";
import styles from "./CategoryPageView.module.css";

export interface CategoryPageViewProps {
  dictionary: Dictionary;
  locale: Locale;
  path: string[];
  faq?: FaqItem[];
  faqHeading?: string;
}

// Keep the mounted reading while its translated catalog is loading (or retrying).
// Never reuse a snapshot when navigating to a different category/spread.
function useLastCatalog<T>(state: CatalogState<T>, scope: string) {
  const [last, setLast] = useState({ scope, state });
  if (last.scope !== scope || (state.status === "success" && last.state !== state)) {
    setLast({ scope, state });
  }
  return state.status !== "success" && last.scope === scope && last.state.status === "success" ? last.state : state;
}

export default function CategoryPageView(props: CategoryPageViewProps) {
  // A new route starts a new reading, including a category's default spread route.
  return <ReadingNavigationProvider key={props.path.join("/")} dictionary={props.dictionary.readingConfirmation}>
    <CategoryPageContent {...props} />
  </ReadingNavigationProvider>;
}

function CategoryPageContent({
  dictionary,
  locale,
  path,
  faq = [],
  faqHeading = "",
}: CategoryPageViewProps) {
  const pathKey = path.join("/");
  const categoryRequest = useCategories();
  
  const categories = { ...categoryRequest, state: useLastCatalog(categoryRequest.state, pathKey) };
  const category = categories.state.status === "success" ? categories.state.data.find((item) => item.slug === path[0]) : undefined;
  const spreadRequest = useSpreads(category?.id);
  const spreads = { ...spreadRequest, state: useLastCatalog(spreadRequest.state, `${pathKey}:${category?.id}`) };
  const defaultSlug = path.length === 1 && category && spreads.state.status === "success"
    ? defaultSpreadSlug(category.slug, spreads.state.data) : undefined;
  const needsDefaultSpread = defaultSlug !== undefined && spreads.state.status === "success"
    && !spreads.state.data.some((item) => item.slug === defaultSlug);
  const allSpreadsRequest = useAllSpreads(needsDefaultSpread);
  const allSpreads = { ...allSpreadsRequest, state: useLastCatalog(allSpreadsRequest.state, `${pathKey}:${category?.id}`) };
  const defaultSpread = allSpreads.state.status === "success" ? allSpreads.state.data.find((item) => item.slug === defaultSlug) : undefined;
  const resolved = categories.state.status === "success" && spreads.state.status === "success"
    ? resolveCatalogPath(categories.state.data, spreads.state.data, path, defaultSpread) : null;
  const current = path.length === 2 ? resolved?.spread : category;
  const count = resolved?.spread ? cardCount(resolved.spread) : null;
  const returnHref = path.length === 2 ? categoryHref(path[0], locale) : localizedHref(locale, "/tarot");
  const returnLabel = path.length === 2 && category
    ? `${dictionary.categoryPage.returnToPrefix} ${category.name}` : dictionary.categoryPage.returnToMain;
  const status = categories.state.status !== "success" ? categories.state.status
    : !category ? "notFound"
    : spreads.state.status !== "success" ? spreads.state.status
    : !resolved ? "notFound" : null;
  const retry = categories.state.status === "error" ? categories.retry : spreads.retry;
  const [readingActive, setReadingActive] = useState(false);
  const [presetQuestions, setPresetQuestions] = useState<string[]>([]);
  return (
    <div className={`${geometryStyles.geometry} ${styles.page}`}>
      <div className={styles.background} aria-hidden="true" />
      <div className={styles.content}>
        {status && <Header dictionary={dictionary.header} locale={locale} />}
        {!status && (categoryRequest.state.status === "error" || spreadRequest.state.status === "error") && (
          <CatalogStatus locale={locale} status="error" retry={categoryRequest.state.status === "error" ? categoryRequest.retry : spreadRequest.retry} />
        )}
        {status && (
          <>
            <div className={styles.pending}>
              <CatalogStatus locale={locale} status={status} retry={retry} />
              {status !== "loading" && <Link href="/categories">{dictionary.header.allTarotSpreads}</Link>}
            </div>
          </>
        )}
        {!status && current && (
          <>
            <section className={styles.hero}>
              <div className={styles.stars}><StarField /></div>
              <div className={styles.constellation}><ConstellationPattern /></div>
              <Header dictionary={dictionary.header} locale={locale} />
              <div className={styles.heroGrid}>
                <div className={styles.heroCopy}>
                  <Breadcrumbs
                    className={styles.breadcrumbs}
                    locale={locale}
                    items={[
                      { label: dictionary.header.logo, href: "/" },
                      { label: dictionary.header.allTarotSpreads, href: "/tarot" },
                      ...(path.length === 2 && resolved ? [{ label: resolved.category.name, href: `/tarot/${resolved.category.slug}` }] : []),
                      { label: current.name },
                    ]}
                  />
                  <CategoryHeroSection
                    dictionary={dictionary.categoryPage}
                    locale={locale}
                    current={current}
                    spreads={!resolved?.spread && path.length === 1 && spreads.state.status === "success" ? spreads.state.data : []}
                    path={path}
                    returnHref={returnHref}
                    returnLabel={returnLabel}
                    description={resolved?.category.site_description || resolved?.spread?.description || current.site_description}
                    exploreLabel={resolved ? locale === "en" ? `Explore ${resolved.category.name} Tarot Spreads` : locale === "ru" ? `Изучить расклады Таро: ${resolved.category.name}` : `Переглянути розклади Таро: ${resolved.category.name}` : undefined}
                  />
                </div>
                {resolved?.spread && <CategoryAskBlock dictionary={dictionary} locale={locale} categoryId={resolved.category.id} spreadId={resolved.spread.id} categoryLabel={resolved.category.name} onReadingStarted={setReadingActive} onPresetQuestions={setPresetQuestions} />}
              </div>
              {readingActive && resolved?.spread && count !== null && <div className={styles.readingWrap}>
                <CategoryTopBlock key={`${resolved.category.id}:${resolved.spread.id}`} dictionary={dictionary.categoryPage.topBlock} locale={locale} categoryLabel={resolved.category.name} categoryId={resolved.category.id} spreadId={resolved.spread.id} maxSelectableCards={count} resumeReading />
              </div>}
            </section>
          </>
        )}
        {!status && needsDefaultSpread && (allSpreadsRequest.state.status === "error" || !resolved?.spread) && (
          <CatalogStatus locale={locale} status={allSpreads.state.status === "loading" ? "loading" : "error"} retry={allSpreads.retry} />
        )}
        {!status && !needsDefaultSpread && resolved && !resolved.spread && <CatalogStatus locale={locale} status="empty" />}
        {!status && resolved?.spread && spreads.state.status === "success" && <>
          <CategorySpreadsSection locale={locale} categorySlug={resolved.category.slug} categoryName={resolved.category.name} spreads={spreads.state.data} currentSlug={resolved.spread.slug} />
          <CategoryLearningSection locale={locale} category={resolved.category} spreads={spreads.state.data} exampleQuestion={presetQuestions[0]} />
        </>}
        {!status && current && faq.length > 0 && (
          <div className={styles.faqWrap}>
            <FaqSection heading={faqHeading} items={faq} />
          </div>
        )}
        <Footer dictionary={dictionary.footer} locale={locale} />
      </div>
    </div>
  );
}
