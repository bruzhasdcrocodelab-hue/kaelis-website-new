"use client";

import type { ReactNode } from "react";
import { dictionaries, type Locale } from "@/lang";
import { LocaleContext } from "@/components/LocaleContext";
import CookieConsent from "@/components/global/CookieConsent/CookieConsent";
import TarotStyleProvider from "@/components/TarotStyleProvider";

export default function SiteProviders({ children, locale }: { children: ReactNode; locale: Locale }) {
  return <LocaleContext.Provider value={locale}>
    <TarotStyleProvider>
      {children}
      <CookieConsent dictionary={dictionaries[locale].cookieConsent} locale={locale} />
    </TarotStyleProvider>
  </LocaleContext.Provider>;
}
