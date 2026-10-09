import type { Metadata } from "next";
import type { Locale } from "@/lang";
import { localizedHref } from "@/lib/routing";
import content from "./content.json";

export interface SeoContent {
  title: string;
  description: string;
  h1?: string;
}

const entries: Record<Locale, Record<string, SeoContent>> = content;

export function getSeo(locale: Locale, path: string): SeoContent | undefined {
  return entries[locale][path];
}

export function pageMetadata(locale: Locale, path: string): Metadata {
  const entry = getSeo(locale, path);
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://kaelisai.com";
  return {
    metadataBase: new URL(origin),
    title: { absolute: entry?.title ?? "Kaelis" },
    description: entry?.description ?? "Kaelis",
    alternates: {
      canonical: localizedHref(locale, path),
      languages: {
        en: localizedHref("en", path),
        ru: localizedHref("ru", path),
        uk: localizedHref("uk", path),
        "x-default": localizedHref("en", path),
      },
    },
  };
}
