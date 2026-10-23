"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { dictionaries } from "@/lang";
import { routeFromPath } from "@/lib/routing";
import CookieConsent from "@/components/global/CookieConsent/CookieConsent";
import CatalogProvider from "@/components/categories/CatalogProvider";
import HomePageView from "@/components/main-page/HomePageView";
import CategoriesListView from "@/components/categories-list-page/CategoriesListView";
import CategoryPageView from "@/components/categories-page/CategoryPageView";

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
      <CookieConsent dictionary={dictionary.cookieConsent} locale={locale} />
      {route?.kind === "home" && <HomePageView dictionary={dictionary} locale={locale} />}
      {route?.kind === "catalog" && <CategoriesListView dictionary={dictionary} locale={locale} />}
      {route?.kind === "category" && <CategoryPageView dictionary={dictionary} locale={locale} path={route.path} />}
    </CatalogProvider>
  </LocaleContext.Provider>;
}
