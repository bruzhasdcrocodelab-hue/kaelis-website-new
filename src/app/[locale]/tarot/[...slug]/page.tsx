import { notFound } from "next/navigation";
import { isUrlLocale, localizedHref, toLocale } from "@/lib/routing";
import RouteAnalytics from "@/components/RouteAnalytics";
import CatalogProvider from "@/components/categories/CatalogProvider";
import CategoryPageView from "@/components/categories-page/CategoryPageView";
import { dictionaries } from "@/lang";
import { defaultSpreadSlug, resolveCatalogPath } from "@/lib/categories/catalog";
import { loadPublicCategories, loadPublicSpreads } from "@/lib/categories/server";
import { pageMetadata, pageTitle, resolveTarotSeo, siteOrigin } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

type Props = { params: Promise<{ locale: string; slug: string[] }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isUrlLocale(locale)) return { robots: { index: false, follow: false } };
  const seo = resolveTarotSeo(toLocale(locale), slug);
  if (!seo) return { robots: { index: false, follow: false } };
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
  const resolved = resolveCatalogPath(categories, spreads, slug, defaultSpread);
  if (!resolved) notFound();
  const current = resolved.spread ?? resolved.category;
  const breadcrumbs = [
    { name: dictionaries[language].header.logo, path: "/" },
    { name: dictionaries[language].header.allTarotSpreads, path: "/tarot" },
    ...(slug.length === 2 ? [{ name: resolved.category.name, path: `/tarot/${resolved.category.slug}` }] : []),
    { name: current.name, path: seo.path },
  ];
  return <CatalogProvider locale={language} initialCatalog={{
    categories,
    spreadsByCategory: { [category.id]: spreads },
    ...(allSpreads ? { allSpreads } : {}),
  }}>
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: new URL(localizedHref(language, item.path), siteOrigin).toString(),
      })),
    }} />
    {seo.entry.faq?.length ? <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: seo.entry.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    }} /> : null}
    <RouteAnalytics pathname={`/${locale}${seo.path}`} pageTitle={pageTitle(language, seo.path)} />
    <CategoryPageView dictionary={dictionaries[language]} locale={language} path={slug} />
  </CatalogProvider>;
}
