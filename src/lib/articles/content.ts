import type { Locale } from "@/lang";
import { sanityClient } from "./client";
import type { ArticleCategory, ArticleDocument, ArticleImage, ArticlePreview, ArticleSlug } from "./types";

const imageProjection = `{
  "alt": altText,
  image {
    asset->{
      url,
      metadata { lqip, dimensions { width, height } }
    },
    crop,
    hotspot
  }
}`;

const articleProjection = `
  _id,
  title,
  "description": desc,
  "slug": slug.current,
  date,
  _updatedAt,
  "categoryIds": category[]._ref,
  "cover": coverImage ${imageProjection}`;

type RawImage = {
  alt?: string;
  image?: {
    asset?: { url?: string; metadata?: { lqip?: string; dimensions?: { width?: number; height?: number } } };
    crop?: ArticleImage["crop"];
    hotspot?: ArticleImage["hotspot"];
  };
};

type RawArticle = {
  _id: string;
  title: string;
  description?: string;
  slug?: string;
  date?: string;
  _updatedAt: string;
  categoryIds?: string[];
  cover?: RawImage;
  content?: ArticleDocument["content"];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogType?: string;
    twitterCard?: ArticleDocument["seo"]["twitterCard"];
    image?: RawImage;
  };
};

type RawCategory = { _id: string; title?: string };

function categoryRoot(id: string) {
  return id.replace(/__i18n_[a-z]+$/i, "");
}

function mapImage(value?: RawImage): ArticleImage | null {
  const asset = value?.image?.asset;
  const dimensions = asset?.metadata?.dimensions;
  if (!asset?.url || !dimensions?.width || !dimensions.height) return null;
  return {
    alt: value?.alt ?? "",
    url: asset.url,
    width: dimensions.width,
    height: dimensions.height,
    lqip: asset.metadata?.lqip,
    crop: value?.image?.crop,
    hotspot: value?.image?.hotspot,
  };
}

function mapCategories(ids: string[] | undefined, categories: RawCategory[]): ArticleCategory[] {
  const byRoot = new Map(categories.map(category => [categoryRoot(category._id), category]));
  return (ids ?? []).flatMap(id => {
    const category = byRoot.get(categoryRoot(id));
    return category?.title ? [{ id: categoryRoot(id), title: category.title }] : [];
  });
}

function mapPreview(article: RawArticle, categories: RawCategory[]): ArticlePreview | null {
  if (!article.slug || !article.title || !article.date) return null;
  return {
    id: article._id,
    title: article.title,
    description: article.description ?? "",
    slug: article.slug.replace(/^\//, ""),
    date: article.date,
    categories: mapCategories(article.categoryIds, categories),
    cover: mapImage(article.cover),
  };
}

async function fetchCategories(locale: Locale) {
  return sanityClient.fetch<RawCategory[]>(
    `*[_type == "blogCategory" && language == $locale] | order(title asc){ _id, title }`,
    { locale: locale === "uk" ? "ua" : locale },
  );
}

async function fetchArticles(locale: Locale) {
  const sanityLocale = locale === "uk" ? "ua" : locale;
  const [articles, categories] = await Promise.all([
    sanityClient.fetch<RawArticle[]>(`*[_type == "articlesItem" && language == $locale] | order(date desc){ ${articleProjection} }`, { locale: sanityLocale }),
    fetchCategories(locale),
  ]);
  return {
    articles: articles.map(article => mapPreview(article, categories)).filter((article): article is ArticlePreview => article !== null),
    categories: categories.flatMap(category => category.title ? [{ id: categoryRoot(category._id), title: category.title }] : []),
  };
}

export const getArticles = fetchArticles;

async function fetchArticle(locale: Locale, slug: string): Promise<ArticleDocument | null> {
  const sanityLocale = locale === "uk" ? "ua" : locale;
  const [article, categories] = await Promise.all([
    sanityClient.fetch<RawArticle | null>(
      `*[_type == "articlesItem" && language == $locale && slug.current == $slug][0]{
        ${articleProjection},
        content[]{
          ...,
          _type == "image" => {
            asset->{
              url,
              metadata { lqip, dimensions { width, height } }
            }
          }
        },
        seo {
          title,
          description,
          keywords,
          ogType,
          twitterCard,
          "image": image ${imageProjection}
        }
      }`,
      { locale: sanityLocale, slug: `/${slug}` },
    ),
    fetchCategories(locale),
  ]);
  if (!article) return null;
  const preview = mapPreview(article, categories);
  if (!preview) return null;
  return {
    ...preview,
    locale,
    content: article.content ?? [],
    updatedAt: article._updatedAt,
    seo: {
      title: article.seo?.title ?? article.title,
      description: article.seo?.description ?? article.description ?? "",
      keywords: article.seo?.keywords ?? "",
      ogType: article.seo?.ogType ?? "article",
      twitterCard: article.seo?.twitterCard ?? "summary_large_image",
      image: mapImage(article.seo?.image),
    },
  };
}

export const getArticle = fetchArticle;

async function fetchArticleSlugs(): Promise<ArticleSlug[]> {
  const rows = await sanityClient.fetch<Array<{ language: "en" | "ru" | "ua"; slug?: string; _updatedAt: string }>>(
    `*[_type == "articlesItem" && defined(slug.current)]{ language, "slug": slug.current, _updatedAt }`,
  );
  return rows.flatMap(row => row.slug ? [{
    locale: row.language === "ua" ? "uk" : row.language,
    slug: row.slug.replace(/^\//, ""),
    updatedAt: row._updatedAt,
  }] : []);
}

export const getArticleSlugs = fetchArticleSlugs;
