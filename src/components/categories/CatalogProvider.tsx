"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/lang";
import { localizedHref } from "@/lib/routing";
import { useLocale } from "@/components/LocaleContext";
import { createCatalogStore, type CatalogState, type TarotCategory, type TarotSpread } from "@/lib/categories/catalog";

export interface InitialCatalog {
  categories?: TarotCategory[];
  spreadsByCategory?: Record<string, TarotSpread[]>;
  allSpreads?: TarotSpread[];
}

const CatalogContext = createContext<ReturnType<typeof createCatalogStore> | null>(null);
const CatalogStoresContext = createContext<((locale: Locale) => ReturnType<typeof createCatalogStore>) | null>(null);

export function useCatalogStores() {
  const getStore = useContext(CatalogStoresContext);
  if (!getStore) throw new Error("CatalogProvider is required");
  return getStore;
}

export default function CatalogProvider({ locale, children, initialCatalog }: { locale: Locale; children: React.ReactNode; initialCatalog?: InitialCatalog }) {
  const [getStore] = useState(() => {
    const stores = new Map<Locale, ReturnType<typeof createCatalogStore>>();
    return (language: Locale) => {
      let store = stores.get(language);
      if (!store) { store = createCatalogStore(language, language === locale ? initialCatalog : undefined); stores.set(language, store); }
      return store;
    };
  });
  return <CatalogStoresContext.Provider value={getStore}>
    <CatalogContext.Provider value={getStore(locale)}>{children}</CatalogContext.Provider>
  </CatalogStoresContext.Provider>;
}

export function useCatalog(categoryId?: string | null, enabled = true) {
  const store = useContext(CatalogContext);
  if (!store) throw new Error("CatalogProvider is required");
  const state = useSyncExternalStore(store.subscribe, () => store.getSnapshot(categoryId), () => store.getSnapshot(categoryId));
  useEffect(() => {
    if (enabled) void store.load(categoryId);
  }, [store, categoryId, enabled]);
  return { state, retry: () => { void store.load(categoryId, true); } };
}

export function useCategories() {
  const result = useCatalog();
  return { ...result, state: result.state as CatalogState<TarotCategory> };
}

export function useSpreads(categoryId?: string) {
  const result = useCatalog(categoryId, categoryId !== undefined);
  return { ...result, state: result.state as CatalogState<TarotSpread> };
}

export function useAllSpreads(enabled: boolean) {
  const result = useCatalog(null, enabled);
  return { ...result, state: result.state as CatalogState<TarotSpread> };
}

export function useCategoryLink(slug?: string) {
  const locale = useLocale();
  const { state } = useCategories();
  const category = state.status === "success" ? state.data.find((item) => item.slug === slug) : undefined;
  return localizedHref(locale, category ? `/tarot/${encodeURIComponent(category.slug)}` : "/tarot");
}
