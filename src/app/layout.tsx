import { Cormorant_Garamond, Manrope } from "next/font/google";
import Script from "next/script";
import { consentBootstrap } from "@/lib/consent";
import "./globals.css";
import GuestAuth from "@/components/GuestAuth";
import LocalizedPages from "@/components/LocalizedPages";
import TarotStyleProvider from "@/components/TarotStyleProvider";
import { GOOGLE_ANALYTICS_ID } from "@/lib/config/constants";
import { getLocale } from "@/lib/locale";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: "normal",
});

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${cormorantGaramond.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <Script id="google-analytics-consent" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
          window.gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
          ${consentBootstrap()}
          window.gtag('set', 'ads_data_redaction', true);
          window.gtag('js', new Date());
          window.gtag('config', ${JSON.stringify(GOOGLE_ANALYTICS_ID)}, {
            send_page_view: false,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <GuestAuth />
        <TarotStyleProvider><LocalizedPages>{children}</LocalizedPages></TarotStyleProvider>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
