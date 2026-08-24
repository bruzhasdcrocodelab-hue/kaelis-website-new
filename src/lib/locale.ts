import { cookies } from "next/headers";
import { defaultLocale, type Locale } from "@/lang";

export const LOCALE_COOKIE = "locale";

const LOCALES: Locale[] = ["en", "ru", "uk"];

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return LOCALES.includes(value as Locale) ? (value as Locale) : defaultLocale;
}
