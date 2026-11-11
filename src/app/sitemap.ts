import type { MetadataRoute } from "next";
import content from "@/lib/seo/content.json";
import { type UrlLocale, urlLocales } from "@/lib/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kaelisai.com";

const paths = Object.keys(content.en).filter(
  path => path === "/" || path === "/tarot" || path.startsWith("/tarot/"),
);

function localizedUrl(locale: UrlLocale, path: string): string {
  return new URL(`/${locale}${path === "/" ? "" : path}`, siteUrl).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  return urlLocales.flatMap(locale =>
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
}
