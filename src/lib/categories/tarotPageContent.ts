import "server-only";
import type {Locale} from "@/lang";
import {sanityClient} from "@/lib/articles/client";
import type {TarotPageContent} from "./tarotPage";

type RawImage = {
  alt?: string;
  image?: {
    asset?: {
      url?: string;
      metadata?: {
        dimensions?: {
          width?: number;
          height?: number;
        };
      };
    };
  };
};

type RawTarotPage = Omit<TarotPageContent, "seo"> & {
  seo?: Omit<TarotPageContent["seo"], "image"> & { image?: RawImage };
};

const imageProjection = `{
  "alt": altText,
  image {
    asset->{
      url,
      metadata { dimensions { width, height } }
    }
  }
}`;

const tarotPageProjection = `{
  hero,
  spreadsSection,
  learning,
  example,
  faq[] { _key, question, answer },
  seo {
    title,
    description,
    keywords,
    ogType,
    twitterCard,
    noIndex,
    "image": image ${imageProjection}
  }
}`;

function sanityLocale(locale: Locale) {
  return locale === "uk" ? "ua" : locale;
}

function mapImage(image?: RawImage): TarotPageContent["seo"]["image"] {
  const asset = image?.image?.asset;
  if (!asset?.url) return undefined;
  return {
    alt: image?.alt ?? "",
    url: asset.url,
    width: asset.metadata?.dimensions?.width,
    height: asset.metadata?.dimensions?.height,
  };
}

function mapTarotPage(page: RawTarotPage | null): TarotPageContent | null {
  if (!page?.hero?.h1 || !page.hero.shortDescription || !page.hero.description || !page.learning?.content?.length || !page.seo?.title || !page.seo.description) return null;
  return {
    hero: page.hero,
    spreadsSection: page.spreadsSection,
    learning: page.learning,
    example: page.example,
    faq: page.faq ?? [],
    seo: {
      title: page.seo.title,
      description: page.seo.description,
      keywords: page.seo.keywords,
      ogType: page.seo.ogType,
      twitterCard: page.seo.twitterCard,
      noIndex: page.seo.noIndex,
      image: mapImage(page.seo.image),
    },
  };
}

export async function getTarotPage(locale: Locale, categorySlug: string, spreadSlug?: string): Promise<TarotPageContent | null> {
  const page = await sanityClient.fetch<RawTarotPage | null>(
    `*[_type == "tarotPage" && language == $locale && categorySlug == $categorySlug && coalesce(spreadSlug, "") == $spreadSlug][0]${tarotPageProjection}`,
    { locale: sanityLocale(locale), categorySlug, spreadSlug: spreadSlug ?? "" },
  );
  return mapTarotPage(page);
}

export async function getTarotPageCards(locale: Locale, categorySlug: string): Promise<Record<string, Pick<TarotPageContent["hero"], "shortDescription" | "iconPath">>> {
  const pages = await sanityClient.fetch<Array<{ spreadSlug?: string; hero?: Pick<TarotPageContent["hero"], "shortDescription" | "iconPath"> }>>(
    `*[_type == "tarotPage" && language == $locale && categorySlug == $categorySlug && defined(spreadSlug)]{ spreadSlug, hero { shortDescription, iconPath } }`,
    { locale: sanityLocale(locale), categorySlug },
  );
  return Object.fromEntries(pages.flatMap((page) => page.spreadSlug && page.hero?.shortDescription ? [[page.spreadSlug, page.hero]] : []));
}

export async function getTarotCategoryCards(locale: Locale): Promise<Record<string, Pick<TarotPageContent["hero"], "shortDescription">>> {
  const pages = await sanityClient.fetch<Array<{ categorySlug?: string; hero?: Pick<TarotPageContent["hero"], "shortDescription"> }>>(
    `*[_type == "tarotPage" && language == $locale && !defined(spreadSlug)]{ categorySlug, hero { shortDescription } }`,
    { locale: sanityLocale(locale) },
  );
  return Object.fromEntries(pages.flatMap((page) => page.categorySlug && page.hero?.shortDescription ? [[page.categorySlug, page.hero]] : []));
}

export async function getTarotPageRoutes(): Promise<Array<{ locale: Locale; path: string; updatedAt: string }>> {
  const pages = await sanityClient.fetch<Array<{ language?: "en" | "ru" | "ua"; categorySlug?: string; spreadSlug?: string; _updatedAt: string }>>(
    `*[_type == "tarotPage" && defined(language) && defined(categorySlug)]{ language, categorySlug, spreadSlug, _updatedAt }`,
  );
  return pages.flatMap((page) => page.language && page.categorySlug ? [{
    locale: page.language === "ua" ? "uk" : page.language,
    path: `/tarot/${page.categorySlug}${page.spreadSlug ? `/${page.spreadSlug}` : ""}`,
    updatedAt: page._updatedAt,
  }] : []);
}
