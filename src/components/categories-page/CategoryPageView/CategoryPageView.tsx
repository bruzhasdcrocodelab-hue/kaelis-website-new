"use client";

import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lang";
import { cardCount, categoryHref, resolveCatalogPath } from "@/lib/categories/catalog";
import { useCategories, useSpreads } from "@/components/categories/CatalogProvider";
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

export default function CategoryPageView({
  dictionary,
  locale,
  path,
}: CategoryPageViewProps) {
  const categories = useCategories();
  const category = categories.state.status === "success" ? categories.state.data.find((item) => item.slug === path[0]) : undefined;
  const spreads = useSpreads(category?.id);
  const resolved = categories.state.status === "success" && spreads.state.status === "success"
    ? resolveCatalogPath(categories.state.data, spreads.state.data, path) : null;
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
        {!status && resolved && !resolved.spread && <CatalogStatus locale={locale} status="empty" />}
        {!status && resolved?.spread && (
          <>
            {count !== null ? (
              <CategoryTopBlock
                key={`${locale}:${category?.id}:${resolved.spread.id}:${count}`}
                dictionary={dictionary.categoryPage.topBlock}
                locale={locale}
                categoryLabel={resolved.category.name}
                maxSelectableCards={count}
              />
            ) : <CatalogStatus locale={locale} status="error" retry={spreads.retry} />}
          </>
        )}
        <Footer dictionary={dictionary.footer} />
      </div>
    </div>
  );
}
