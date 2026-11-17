import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticlePageView from "@/components/article/ArticlePageView";
import RouteAnalytics from "@/components/RouteAnalytics";
import JsonLd from "@/components/seo/JsonLd";
import { dictionaries } from "@/lang";
import { getArticle, getArticleSlugs } from "@/lib/articles/content";
import { isUrlLocale, localizedHref, toLocale } from "@/lib/routing";
import { ogImagePath, siteOrigin } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const revalidate = 3600;

function validSlug(value: string) {
  return /^[a-z0-9][a-z0-9-]*-(en|ru|ua)$/.test(value);
}

function localizedSlugs(slug: string) {
  const base = slug.replace(/-(en|ru|ua)$/, "");
  return { en: `${base}-en`, ru: `${base}-ru`, uk: `${base}-ua` };
}

async function resolve(params: Props["params"]) {
  const { locale, slug } = await params;
  if (!isUrlLocale(locale) || !validSlug(slug)) return null;
  const language = toLocale(locale);
  const expectedSuffix = language === "uk" ? "ua" : language;
  if (!slug.endsWith(`-${expectedSuffix}`)) return null;
  const article = await getArticle(language, slug);
  return article ? { locale, language, slug, article } : null;
}

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map(item => ({ locale: item.locale === "uk" ? "ua" : item.locale, slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await resolve(params);
  if (!data) return {};
  const { language, slug, article } = data;
  const canonical = localizedHref(language, `/articles/${slug}`);
  const alternateSlugs = localizedSlugs(slug);
  const image = article.seo.image ?? article.cover;
  const imageUrl = image?.url ?? ogImagePath;
  const title = article.seo.title || article.title;
  const description = article.seo.description || article.description;
  return {
    metadataBase: new URL(siteOrigin),
    title: { absolute: title },
    description,
    keywords: article.seo.keywords.split(",").map(keyword => keyword.trim()).filter(Boolean),
    alternates: {
      canonical,
      languages: {
        en: localizedHref("en", `/articles/${alternateSlugs.en}`),
        ru: localizedHref("ru", `/articles/${alternateSlugs.ru}`),
        uk: localizedHref("uk", `/articles/${alternateSlugs.uk}`),
        "x-default": localizedHref("en", `/articles/${alternateSlugs.en}`),
      },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      locale: language === "uk" ? "uk_UA" : language === "ru" ? "ru_RU" : "en_US",
      publishedTime: article.date,
      modifiedTime: article.updatedAt,
      images: [{ url: imageUrl, width: image?.width ?? 1200, height: image?.height ?? 630, alt: image?.alt || article.title }],
    },
    twitter: {
      card: article.seo.twitterCard === "summary" ? "summary" : "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const data = await resolve(params);
  if (!data) notFound();
  const { locale, language, slug, article } = data;
  const canonical = new URL(localizedHref(language, `/articles/${slug}`), siteOrigin).toString();
  const breadcrumbs = [
    { name: dictionaries[language].header.logo, path: "/" },
    { name: dictionaries[language].articles.title, path: "/articles" },
    { name: article.title, path: `/articles/${slug}` },
  ];
  const image = article.seo.image ?? article.cover;
  return <>
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
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.seo.description || article.description,
      datePublished: article.date,
      dateModified: article.updatedAt,
      mainEntityOfPage: canonical,
      inLanguage: language === "uk" ? "uk" : language,
      ...(image ? { image: image.url } : {}),
      publisher: { "@type": "Organization", name: "Kaelis", url: siteOrigin },
    }} />
    <RouteAnalytics pathname={`/${locale}/articles/${slug}`} pageTitle={article.seo.title || article.title} />
    <ArticlePageView dictionary={dictionaries[language]} locale={language} article={article} />
  </>;
}
