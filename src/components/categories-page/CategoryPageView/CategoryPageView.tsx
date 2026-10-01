"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lang";
import { cardCount, categoryHref, defaultSpreadSlug, resolveCatalogPath, type CatalogState } from "@/lib/categories/catalog";
import { useAllSpreads, useCategories, useSpreads } from "@/components/categories/CatalogProvider";
import CatalogStatus from "@/components/categories/CatalogStatus";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import CategoryHeroSection from "@/components/categories-page/CategoryHeroSection";
import CategoryTopBlock from "@/components/categories-page/CategoryTopBlock";
import ConstellationPattern from "@/components/categories-page/ConstellationPattern";
import styles from "./CategoryPageView.module.css";

export interface CategoryPageViewProps {
  dictionary: Dictionary;
  locale: Locale;
  path: string[];
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

export default function CategoryPageView({
  dictionary,
  locale,
  path,
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
  const returnHref = path.length === 2 ? categoryHref(path[0]) : "/";
  const returnLabel = path.length === 2 && category
    ? `${dictionary.categoryPage.returnToPrefix} ${category.name}` : dictionary.categoryPage.returnToMain;
  const status = categories.state.status !== "success" ? categories.state.status
    : !category ? "notFound"
    : spreads.state.status !== "success" ? spreads.state.status
    : !resolved ? "notFound" : null;
  const retry = categories.state.status === "error" ? categories.retry : spreads.retry;
  return (
    <div className={styles.page}>
      <Image
        src="/images/backgrounds/2.png"
        alt=""
        width={1440}
        height={990}
        className={styles.backgroundImage}
        priority
      />
      <Image
        src="/images/backgrounds/mobile/background-celestial.png"
        alt=""
        width={390}
        height={1000}
        className={styles.backgroundImageMobile}
        priority
      />
      <ConstellationPattern />
      <div className={styles.content}>
        <Header dictionary={dictionary.header} locale={locale} />
        {!status && (categoryRequest.state.status === "error" || spreadRequest.state.status === "error") && (
          <CatalogStatus locale={locale} status="error" retry={categoryRequest.state.status === "error" ? categoryRequest.retry : spreadRequest.retry} />
        )}
        {status && (
          <>
            {status === "notFound" && <meta name="robots" content="noindex" />}
            <div className={styles.pending}>
              <CatalogStatus locale={locale} status={status} retry={retry} />
              {status !== "loading" && <Link href="/categories">{dictionary.header.allTarotSpreads}</Link>}
            </div>
          </>
        )}
        {!status && current && (
          <CategoryHeroSection
            dictionary={dictionary.categoryPage}
            locale={locale}
            current={current}
            spreads={path.length === 1 && spreads.state.status === "success" ? spreads.state.data : []}
            path={path}
            returnHref={returnHref}
            returnLabel={returnLabel}
          />
        )}
        {!status && needsDefaultSpread && (allSpreadsRequest.state.status === "error" || !resolved?.spread) && (
          <CatalogStatus locale={locale} status={allSpreads.state.status === "loading" ? "loading" : "error"} retry={allSpreads.retry} />
        )}
        {!status && !needsDefaultSpread && resolved && !resolved.spread && <CatalogStatus locale={locale} status="empty" />}
        {!status && resolved?.spread && (
          <>
            {count !== null ? (
              <CategoryTopBlock
                key={`${category?.id}:${resolved.spread.id}`}
                dictionary={dictionary.categoryPage.topBlock}
                locale={locale}
                categoryLabel={resolved.category.name}
                categoryId={resolved.category.id}
                spreadId={resolved.spread.id}
                maxSelectableCards={count}
              />
            ) : <CatalogStatus locale={locale} status="error" retry={needsDefaultSpread ? allSpreads.retry : spreads.retry} />}
          </>
        )}
        <Footer dictionary={dictionary.footer} />
      </div>
    </div>
  );
}
