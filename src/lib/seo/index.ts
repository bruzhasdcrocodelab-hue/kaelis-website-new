import type { Metadata } from "next";
import type { Locale } from "@/lang";
import { localizedHref } from "@/lib/routing";
import content from "./content.json";

export interface SeoContent {
  title: string;
  description: string;
  h1?: string;
  intro?: string;
  keywords?: string;
  ogType?: "website";
  twitterCard?: "summary" | "summary_large_image";
  noIndex?: boolean;
  image?: {
    alt: string;
    url: string;
    width?: number;
    height?: number;
  };
}

const entries: Record<Locale, Record<string, SeoContent>> = content;
export const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || "https://kaelisai.com";
export const ogImagePath = "/images/seo/og-placeholder-1200x630.png";

const fallbackDescriptions: Record<Locale, (title: string) => string> = {
  en: (title) => `${title} — free online Tarot reading with Kaelis AI.`,
  ru: (title) => `${title} — бесплатный онлайн-расклад Таро с Kaelis AI.`,
  uk: (title) => `${title} — безкоштовний онлайн-розклад Таро з Kaelis AI.`,
};

const openGraphLocales: Record<Locale, string> = {
  en: "en_US",
  ru: "ru_RU",
  uk: "uk_UA",
};

function withinLimit(value: string | undefined, limit: number): value is string {
  return Boolean(value && value.length <= limit && !/\p{Extended_Pictographic}/u.test(value));
}

function trimTo(value: string, limit: number): string {
  return value.length <= limit ? value : value.slice(0, limit - 1).trimEnd() + "…";
}

function metadataTitle(entry: SeoContent | undefined): string {
  if (withinLimit(entry?.title, 60)) return entry.title.trim();
  return trimTo(`${entry?.h1?.trim() || "Kaelis"} | Kaelis`, 60);
}

function metadataDescription(locale: Locale, entry: SeoContent | undefined): string {
  if (withinLimit(entry?.description, 160)) return entry.description.trim();
  return trimTo(fallbackDescriptions[locale](entry?.h1?.trim() || "Kaelis"), 160);
}

export function getSeo(locale: Locale, path: string): SeoContent | undefined {
  return entries[locale][path];
}

export function resolveTarotSeo(locale: Locale, slug: string[]): { path: string; entry: SeoContent } | undefined {
  if (!slug.length) return undefined;
  const path = `/tarot/${slug.join("/")}`;
  if (path !== path.toLowerCase()) return undefined;
  const entry = getSeo(locale, path);
  return entry ? { path, entry } : undefined;
}

export function pageTitle(locale: Locale, path: string): string {
  return metadataTitle(getSeo(locale, path));
}

export function pageMetadata(locale: Locale, path: string): Metadata {
  const entry = getSeo(locale, path);
  return pageMetadataFromEntry(locale, path, entry);
}

export function pageMetadataFromEntry(locale: Locale, path: string, entry: SeoContent | undefined): Metadata {
  const canonical = localizedHref(locale, path);
  const title = metadataTitle(entry);
  const description = metadataDescription(locale, entry);
  const image = entry?.image ?? { alt: "Kaelis", url: ogImagePath, width: 1200, height: 630 };
  return {
    metadataBase: new URL(siteOrigin),
    title: { absolute: title },
    description,
    keywords: entry?.keywords,
    robots: entry?.noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical,
      languages: {
        en: localizedHref("en", path),
        ru: localizedHref("ru", path),
        uk: localizedHref("uk", path),
        "x-default": localizedHref("en", path),
      },
    },
    openGraph: {
      type: entry?.ogType ?? "website",
      title,
      description,
      url: canonical,
      locale: openGraphLocales[locale],
      images: [{ url: image.url, width: image.width ?? 1200, height: image.height ?? 630, alt: image.alt }],
    },
    twitter: {
      card: entry?.twitterCard ?? "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
