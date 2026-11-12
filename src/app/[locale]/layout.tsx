import { notFound } from "next/navigation";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { isUrlLocale, localizedHref, toLocale } from "@/lib/routing";
import GuestAuth from "@/components/GuestAuth";
import SiteProviders from "@/components/SiteProviders";
import JsonLd from "@/components/seo/JsonLd";
import { siteOrigin } from "@/lib/seo";
import { htmlLang } from "@/lang";
import { GOOGLE_ANALYTICS_ID } from "@/lib/config/constants";
import AnalyticsBootstrap from "@/components/AnalyticsBootstrap";
import "../globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  style: "normal",
});

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ru" }, { locale: "ua" }];
}

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isUrlLocale(locale)) notFound();
  const language = toLocale(locale);
  const url = new URL(localizedHref(language), siteOrigin).toString();
  return <html lang={htmlLang[language]} className={`${cormorantGaramond.variable} ${manrope.variable} h-full antialiased`}>
    <head>
      <meta name="google-site-verification" content="g-jH6mhfzaLWhtC-UJdgtCxQA1kFZ06dp-Vqyn5w5zQ" />
    </head>
    <body className="min-h-full flex flex-col">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Kaelis",
        url: siteOrigin,
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Kaelis",
        url,
        inLanguage: language,
      }} />
      <GuestAuth />
      <SiteProviders locale={language}>{children}</SiteProviders>
      <AnalyticsBootstrap measurementId={GOOGLE_ANALYTICS_ID} />
    </body>
  </html>;
}
