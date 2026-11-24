import type { MetadataRoute } from "next";
import content from "@/lib/seo/content.json";
import { type UrlLocale, urlLocales } from "@/lib/routing";
import { getArticleSlugs } from "@/lib/articles/content";
import { getTarotPageRoutes } from "@/lib/categories/tarotPageContent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kaelisai.com";

const paths = Object.keys(content.en).filter(
  path => path === "/" || path === "/faq" || path === "/tarot",
);

function localizedUrl(locale: UrlLocale, path: string): string {
  return new URL(`/${locale}${path === "/" ? "" : path}`, siteUrl).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, tarotPages] = await Promise.all([getArticleSlugs(), getTarotPageRoutes()]);
  const staticEntries = urlLocales.flatMap(locale =>
    paths.map(path => ({
      url: localizedUrl(locale, path),
      alternates: {
        languages: {
          en: localizedUrl("en", path),
          ru: localizedUrl("ru", path),
          uk: localizedUrl("ua", path),
          "x-default": localizedUrl("en", path),
        },
      },
    })),
  );
  const articleEntries = articles.map(article => {
    const locale = article.locale === "uk" ? "ua" : article.locale;
    const base = article.slug.replace(/-(en|ru|ua)$/, "");
    const localizedArticle = (target: "en" | "ru" | "ua") => `/articles/${base}-${target}`;
    return {
      url: localizedUrl(locale, `/articles/${article.slug}`),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: localizedUrl("en", localizedArticle("en")),
          ru: localizedUrl("ru", localizedArticle("ru")),
          uk: localizedUrl("ua", localizedArticle("ua")),
          "x-default": localizedUrl("en", localizedArticle("en")),
        },
      },
    };
  });
  const hubs = urlLocales.map(locale => ({
    url: localizedUrl(locale, "/articles"),
    alternates: {
      languages: {
        en: localizedUrl("en", "/articles"),
        ru: localizedUrl("ru", "/articles"),
        uk: localizedUrl("ua", "/articles"),
        "x-default": localizedUrl("en", "/articles"),
      },
    },
  }));
  const tarotEntries = tarotPages.map(page => {
    const locale = page.locale === "uk" ? "ua" : page.locale;
    return {
      url: localizedUrl(locale, page.path),
      lastModified: new Date(page.updatedAt),
      alternates: {
        languages: {
          en: localizedUrl("en", page.path),
          ru: localizedUrl("ru", page.path),
          uk: localizedUrl("ua", page.path),
          "x-default": localizedUrl("en", page.path),
        },
      },
    };
  });
  return [...staticEntries, ...hubs, ...articleEntries, ...tarotEntries];
}
