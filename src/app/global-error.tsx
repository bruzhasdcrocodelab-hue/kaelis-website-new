"use client";

import { usePathname } from "next/navigation";
import SiteProviders from "@/components/SiteProviders";
import ErrorPageView from "@/components/error/ErrorPageView";
import { dictionaries, htmlLang, type Locale } from "@/lang";
import { isUrlLocale, toLocale } from "@/lib/routing";
import "./globals.css";

function localeFromPath(pathname: string): Locale {
  const urlLocale = pathname.split("/")[1] ?? "";
  return isUrlLocale(urlLocale) ? toLocale(urlLocale) : "en";
}

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const locale = localeFromPath(usePathname());
  return <html lang={htmlLang[locale]}>
    <body>
      <SiteProviders locale={locale}>
        <ErrorPageView locale={locale} dictionary={dictionaries[locale]} retry={retry} />
      </SiteProviders>
    </body>
  </html>;
}
