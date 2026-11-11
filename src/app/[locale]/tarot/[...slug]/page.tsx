import { notFound } from "next/navigation";
import { isUrlLocale, toLocale } from "@/lib/routing";
import RouteAnalytics from "@/components/RouteAnalytics";
import { pageMetadata, pageTitle, resolveTarotSeo } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string[] }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isUrlLocale(locale)) notFound();
  const seo = resolveTarotSeo(toLocale(locale), slug);
  if (!seo) notFound();
  return pageMetadata(toLocale(locale), seo.path);
}

export default async function Category({ params }: Props) {
  const { locale, slug } = await params;
  if (!isUrlLocale(locale)) notFound();
  const seo = resolveTarotSeo(toLocale(locale), slug);
  if (!seo) notFound();
  return <RouteAnalytics pathname={`/${locale}${seo.path}`} pageTitle={pageTitle(toLocale(locale), seo.path)} />;
}
