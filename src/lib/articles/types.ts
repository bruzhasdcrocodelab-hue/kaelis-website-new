import type { PortableTextBlock } from "@portabletext/types";
import type { Locale } from "@/lang";

export interface ArticleImage {
  alt: string;
  url: string;
  width: number;
  height: number;
  lqip?: string;
  crop?: { top?: number; bottom?: number; left?: number; right?: number };
  hotspot?: { x?: number; y?: number; height?: number; width?: number };
}

export interface ArticleCategory {
  id: string;
  title: string;
}

export interface ArticlePreview {
  id: string;
  title: string;
  description: string;
  slug: string;
  date: string;
  categories: ArticleCategory[];
  cover: ArticleImage | null;
}

export interface ArticleDocument extends ArticlePreview {
  locale: Locale;
  content: PortableTextBlock[];
  updatedAt: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogType: string;
    twitterCard: "app" | "summary" | "summary_large_image" | "player" | "";
    image: ArticleImage | null;
  };
}

export interface ArticleSlug {
  locale: Locale;
  slug: string;
  updatedAt: string;
}
