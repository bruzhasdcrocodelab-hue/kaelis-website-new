"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { dictionaries } from "@/lang";
import { routeFromPath } from "@/lib/routing";
import CookieConsent from "@/components/global/CookieConsent/CookieConsent";

import { LocaleContext } from "@/components/LocaleContext";

export default function LocalizedPages({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const route = routeFromPath(pathname);
  const locale = route?.locale ?? "en";
  const dictionary = dictionaries[locale];
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  return <LocaleContext.Provider value={locale}>
    {children}
    <CookieConsent dictionary={dictionary.cookieConsent} locale={locale} />
  </LocaleContext.Provider>;
}
