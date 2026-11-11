import { notFound } from "next/navigation";
import { isUrlLocale, toLocale } from "@/lib/routing";
import RouteAnalytics from "@/components/RouteAnalytics";
import CatalogProvider from "@/components/categories/CatalogProvider";
import CategoriesListView from "@/components/categories-list-page/CategoriesListView";
import TarotCatalogLinks from "@/components/seo/TarotCatalogLinks";
import { dictionaries } from "@/lang";
import { loadPublicTarotCatalog } from "@/lib/categories/server";
import { pageMetadata, pageTitle } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isUrlLocale(locale)) notFound();
  return pageMetadata(toLocale(locale), "/tarot");
}

export default async function Categories({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isUrlLocale(locale)) notFound();
  const language = toLocale(locale);
  const catalog = await loadPublicTarotCatalog(language);
  return <CatalogProvider locale={language} initialCatalog={catalog}>
    <RouteAnalytics pathname={`/${locale}/tarot`} pageTitle={pageTitle(language, "/tarot")} />
    <CategoriesListView dictionary={dictionaries[language]} locale={language}>
      <TarotCatalogLinks locale={language} {...catalog} />
    </CategoriesListView>
  </CatalogProvider>;
}
