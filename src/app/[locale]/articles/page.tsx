import { notFound } from "next/navigation";
import RouteAnalytics from "@/components/RouteAnalytics";
import BlogPageView from "@/components/article/BlogPageView";
import { dictionaries } from "@/lang";
import { getArticles } from "@/lib/articles/content";
import { isUrlLocale, localizedHref, toLocale } from "@/lib/routing";
import { ogImagePath, siteOrigin } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

const blogSeo = {
  en: {
    title: "Articles on Tarot, Astrology, Numerology — Kaelis",
    description: "Read expert materials on Tarot, astrology, numerology, and mystical practices — articles, spreads, and tutorials on Kaelis.",
  },
  ru: {
    title: "Статьи о Таро, астрологии, нумерологии — Kaelis",
    description: "Читай экспертные материалы про Таро, астрологию, нумерологию и мистические практики — статьи, расклады, обучение на Kaelis.",
  },
  uk: {
    title: "Статті про Таро, астрологію, нумерологію — Kaelis",
    description: "Читай експертні матеріали про Таро, астрологію, нумерологію та містичні практики — статті, розклади, навчання на Kaelis.",
  },
} as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isUrlLocale(locale)) return {};
  const language = toLocale(locale);
  const entry = blogSeo[language];
  const canonical = localizedHref(language, "/articles");
  return {
    metadataBase: new URL(siteOrigin),
    title: { absolute: entry.title },
    description: entry.description,
    alternates: {
      canonical,
      languages: {
        en: localizedHref("en", "/articles"),
        ru: localizedHref("ru", "/articles"),
        uk: localizedHref("uk", "/articles"),
        "x-default": localizedHref("en", "/articles"),
      },
    },
    openGraph: {
      type: "website",
      title: entry.title,
      description: entry.description,
      url: canonical,
      images: [{ url: ogImagePath, width: 1200, height: 630, alt: "Kaelis" }],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
      images: [ogImagePath],
    },
  };
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;
  if (!isUrlLocale(locale)) notFound();
  const language = toLocale(locale);
  const { articles, categories } = await getArticles(language);
  return <>
    <RouteAnalytics pathname={`/${locale}/articles`} pageTitle={blogSeo[language].title} />
    <BlogPageView dictionary={dictionaries[language]} locale={language} articles={articles} categories={categories} />
  </>;
}
