import { notFound } from "next/navigation";
import { isUrlLocale, toLocale } from "@/lib/routing";
import RouteAnalytics from "@/components/RouteAnalytics";
import { pageMetadata, pageTitle } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isUrlLocale(locale)) notFound();
  return pageMetadata(toLocale(locale), "/");
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isUrlLocale(locale)) notFound();
  return <RouteAnalytics pathname={`/${locale}`} pageTitle={pageTitle(toLocale(locale), "/")} />;
}
