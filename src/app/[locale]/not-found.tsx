import { locale as rootLocale } from "next/root-params";
import { isUrlLocale, toLocale } from "@/lib/routing";
import NotFoundPageView from "@/components/not-found/NotFoundPageView";
import { dictionaries } from "@/lang";

export default async function LocaleNotFound() {
  const urlLocale = (await rootLocale()) ?? "";
  const locale = isUrlLocale(urlLocale) ? toLocale(urlLocale) : "en";
  return <NotFoundPageView locale={locale} dictionary={dictionaries[locale]} />;
}
