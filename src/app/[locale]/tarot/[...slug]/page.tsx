import { notFound } from "next/navigation";
import { isUrlLocale, localizedHref, toLocale } from "@/lib/routing";
import RouteAnalytics from "@/components/RouteAnalytics";
import CatalogProvider from "@/components/categories/CatalogProvider";
import CategoryPageView from "@/components/categories-page/CategoryPageView";
import { dictionaries } from "@/lang";
import { defaultSpreadSlug, resolveCatalogPath } from "@/lib/categories/catalog";
import { loadPublicCategories, loadPublicSpreads } from "@/lib/categories/server";
import { pageMetadataFromEntry, siteOrigin } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { faqPageContent } from "@/lib/faq/content";
import { getTarotPage, getTarotPageCards, getTarotPageRoutes } from "@/lib/categories/tarotPageContent";

type Props = { params: Promise<{ locale: string; slug: string[] }> };

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isUrlLocale(params.locale)) return [];
  const language = toLocale(params.locale);
  const routes = await getTarotPageRoutes();
  return routes.filter((route) => route.locale === language).map((route) => ({ slug: route.path.split("/").filter(Boolean).slice(1) }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isUrlLocale(locale)) return {};
  const content = await getTarotPage(toLocale(locale), slug[0], slug[1]);
  if (!content) return {};
  return pageMetadataFromEntry(toLocale(locale), `/tarot/${slug.join("/")}`, content.seo);
}

export default async function Category({ params }: Props) {
  const { locale, slug } = await params;
  if (!isUrlLocale(locale)) notFound();
  const language = toLocale(locale);
  const [content, categories] = await Promise.all([
    getTarotPage(language, slug[0], slug[1]),
    loadPublicCategories(language),
  ]);
  if (!content) notFound();
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
  const spreadCards = await getTarotPageCards(language, resolved.category.slug);
  const breadcrumbs = [
    { name: dictionaries[language].header.logo, path: "/" },
    { name: dictionaries[language].header.allTarotSpreads, path: "/tarot" },
    ...(slug.length === 2 ? [{ name: resolved.category.name, path: `/tarot/${resolved.category.slug}` }] : []),
    { name: current.name, path: `/tarot/${slug.join("/")}` },
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
    {content.faq.length ? <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    }} /> : null}
    <RouteAnalytics pathname={`/${locale}/tarot/${slug.join("/")}`} pageTitle={content.seo.title} />
    <CategoryPageView
      dictionary={dictionaries[language]}
      locale={language}
      path={slug}
      content={content}
      faqHeading={faqPageContent[language].heading}
      spreadCards={spreadCards}
    />
  </CatalogProvider>;
}
