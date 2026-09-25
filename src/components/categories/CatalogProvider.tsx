"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import type { Locale } from "@/lang";
import { createCatalogStore, INITIAL_STATE, type CatalogState, type TarotCategory, type TarotSpread } from "@/lib/categories/catalog";

const CatalogContext = createContext<ReturnType<typeof createCatalogStore> | null>(null);

export default function CatalogProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const store = useMemo(() => createCatalogStore(locale), [locale]);
  return <CatalogContext.Provider value={store}>{children}</CatalogContext.Provider>;
}

export function useCatalog(categoryId?: string, enabled = true) {
  const store = useContext(CatalogContext);
  if (!store) throw new Error("CatalogProvider is required");
  const state = useSyncExternalStore(store.subscribe, () => store.getSnapshot(categoryId), () => INITIAL_STATE);
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

export function useCategoryLink(slug?: string) {
  const { state } = useCategories();
  const category = state.status === "success" ? state.data.find((item) => item.slug === slug) : undefined;
  return category ? `/categories/${encodeURIComponent(category.slug)}` : "/categories";
}
