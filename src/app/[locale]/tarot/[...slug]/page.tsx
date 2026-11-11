import { notFound } from "next/navigation";
import { isUrlLocale, toLocale } from "@/lib/routing";
import RouteAnalytics from "@/components/RouteAnalytics";
import CatalogProvider from "@/components/categories/CatalogProvider";
import CategoryPageView from "@/components/categories-page/CategoryPageView";
import { dictionaries } from "@/lang";
import { defaultSpreadSlug, resolveCatalogPath } from "@/lib/categories/catalog";
import { loadPublicCategories, loadPublicSpreads } from "@/lib/categories/server";
import { pageMetadata, pageTitle, resolveTarotSeo } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string[] }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isUrlLocale(locale)) notFound();
  const seo = resolveTarotSeo(toLocale(locale), slug);
  if (!seo) notFound();
  return pageMetadata(toLocale(locale), seo.path);
}

export default async function Category({ params }: Props) {
  const { locale, slug } = await params;
  if (!isUrlLocale(locale)) notFound();
  const language = toLocale(locale);
  const seo = resolveTarotSeo(language, slug);
  if (!seo) notFound();
  const categories = await loadPublicCategories(language);
  const category = categories.find((item) => item.slug === slug[0]);
  if (!category) notFound();
  const spreads = await loadPublicSpreads(language, category.id);
  const defaultSlug = slug.length === 1 ? defaultSpreadSlug(category.slug, spreads) : undefined;
  const allSpreads = defaultSlug && !spreads.some((spread) => spread.slug === defaultSlug)
    ? await loadPublicSpreads(language, null)
    : undefined;
  const defaultSpread = allSpreads?.find((spread) => spread.slug === defaultSlug);
  if (!resolveCatalogPath(categories, spreads, slug, defaultSpread)) notFound();
  return <CatalogProvider locale={language} initialCatalog={{
    categories,
    spreadsByCategory: { [category.id]: spreads },
    ...(allSpreads ? { allSpreads } : {}),
  }}>
    <RouteAnalytics pathname={`/${locale}${seo.path}`} pageTitle={pageTitle(language, seo.path)} />
    <CategoryPageView dictionary={dictionaries[language]} locale={language} path={slug} />
  </CatalogProvider>;
}
