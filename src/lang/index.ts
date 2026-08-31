import en from "./en";
import ru from "./ru";
import uk from "./uk";
import type { Dictionary } from "./en";

export type Locale = "en" | "ru" | "uk";

export const defaultLocale: Locale = "en";

export const dictionaries: Record<Locale, Dictionary> = { en, ru, uk };

export const htmlLang: Record<Locale, string> = {
  en: "en-US",
  ru: "ru-RU",
  uk: "uk-UA",
};

export type { Dictionary };

export function pluralizeCardCount(
  locale: Locale,
  count: number,
  words: { cardWordOne: string; cardWordFew: string; cardWordMany: string }
): string {
  if (locale === "en") {
    return count === 1 ? words.cardWordOne : words.cardWordMany;
  }
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return words.cardWordOne;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return words.cardWordFew;
  return words.cardWordMany;
}
