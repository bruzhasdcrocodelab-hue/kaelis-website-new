import { notFound } from "next/navigation";
import { isUrlLocale, toLocale } from "@/lib/routing";
import RouteAnalytics from "@/components/RouteAnalytics";
import CatalogProvider from "@/components/categories/CatalogProvider";
import HomePageView from "@/components/main-page/HomePageView";
import { dictionaries } from "@/lang";
import { pageMetadata, pageTitle } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isUrlLocale(locale)) notFound();
  return pageMetadata(toLocale(locale), "/");
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isUrlLocale(locale)) notFound();
  const language = toLocale(locale);
  return <CatalogProvider locale={language}>
    <RouteAnalytics pathname={`/${locale}`} pageTitle={pageTitle(language, "/")} />
    <HomePageView dictionary={dictionaries[language]} locale={language} />
  </CatalogProvider>;
}
