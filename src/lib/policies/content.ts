import type { Locale } from "@/lang";
import en from "@/content/policies/en.json";
import ru from "@/content/policies/ru.json";
import uk from "@/content/policies/uk.json";
import type { PolicyKey } from "./catalog";

export interface PolicyBlock {
  _key: string;
  _type: string;
  style?: string;
  listItem?: string;
  level?: number;
  children: { _key: string; _type: string; text: string; marks: string[] }[];
  markDefs: { _key: string; _type: string; href?: string }[];
}

export interface PolicyDocument {
  _id: string;
  _rev: string;
  title: string;
  published: string;
  language: string;
  slug: { current: string };
  content: PolicyBlock[];
}

const documents: Record<Locale, PolicyDocument[]> = { en, ru, uk };

export function getPolicy(locale: Locale, key: PolicyKey): PolicyDocument {
  return documents[locale].find(document => document.slug.current === `${key}-${locale}`)!;
}
