import { notFound } from "next/navigation";
import { isUrlLocale, localizedHref, toLocale } from "@/lib/routing";
import GuestAuth from "@/components/GuestAuth";
import SiteProviders from "@/components/SiteProviders";
import JsonLd from "@/components/seo/JsonLd";
import { siteOrigin } from "@/lib/seo";

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isUrlLocale(locale)) notFound();
  const language = toLocale(locale);
  const url = new URL(localizedHref(language), siteOrigin).toString();
  return <>
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
  </>;
}
