"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { dictionaries } from "@/lang";
import { routeFromPath } from "@/lib/routing";
import CatalogProvider from "@/components/categories/CatalogProvider";
import HomePageView from "@/components/main-page/HomePageView";
import CategoriesListView from "@/components/categories-list-page/CategoriesListView";
import CategoryPageView from "@/components/categories-page/CategoryPageView";
import TermsPageView from "@/components/article/TermsPageView";

import { LocaleContext } from "@/components/LocaleContext";

export default function LocalizedPages({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const route = routeFromPath(pathname);
  const locale = route?.locale ?? "en";
  const dictionary = dictionaries[locale];
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  return <LocaleContext.Provider value={locale}>
    <CatalogProvider locale={locale}>
      {children}
      {route?.kind === "home" && <HomePageView dictionary={dictionary} locale={locale} />}
      {route?.kind === "catalog" && <CategoriesListView dictionary={dictionary} locale={locale} />}
      {route?.kind === "category" && <CategoryPageView dictionary={dictionary} locale={locale} path={route.path} />}
      {route?.kind === "terms" && <TermsPageView dictionary={dictionary} locale={locale} />}
    </CatalogProvider>
  </LocaleContext.Provider>;
}
