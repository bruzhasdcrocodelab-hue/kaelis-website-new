import en from "./en";
import ru from "./ru";
import uk from "./uk";
import type { Dictionary } from "./en";

export type Locale = "en" | "ru" | "uk";

export const defaultLocale: Locale = "en";

export const dictionaries: Record<Locale, Dictionary> = { en, ru, uk };

export type { Dictionary };
