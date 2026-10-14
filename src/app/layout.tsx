import { Bona_Nova_SC, Instrument_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import GuestAuth from "@/components/GuestAuth";
import LocalizedPages from "@/components/LocalizedPages";
import TarotStyleProvider from "@/components/TarotStyleProvider";
import { GOOGLE_ANALYTICS_ID } from "@/lib/config/constants";
import { getLocale } from "@/lib/locale";

const bonaNovaSC = Bona_Nova_SC({
  variable: "--font-bona-nova-sc",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${bonaNovaSC.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GuestAuth />
        <TarotStyleProvider><LocalizedPages>{children}</LocalizedPages></TarotStyleProvider>
      </body>
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
          window.gtag('set', 'ads_data_redaction', true);
          window.gtag('js', new Date());
          window.gtag('config', ${JSON.stringify(GOOGLE_ANALYTICS_ID)}, {
            send_page_view: false,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />
    </html>
  );
}
