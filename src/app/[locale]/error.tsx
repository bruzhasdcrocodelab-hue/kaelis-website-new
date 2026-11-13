"use client";

import { useParams } from "next/navigation";
import ErrorPageView from "@/components/error/ErrorPageView";
import { dictionaries, type Locale } from "@/lang";
import { isUrlLocale, toLocale } from "@/lib/routing";

export default function LocaleError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { locale: urlLocale } = useParams<{ locale?: string }>();
  const locale: Locale = typeof urlLocale === "string" && isUrlLocale(urlLocale) ? toLocale(urlLocale) : "en";
  return <ErrorPageView locale={locale} dictionary={dictionaries[locale]} retry={retry} />;
}
