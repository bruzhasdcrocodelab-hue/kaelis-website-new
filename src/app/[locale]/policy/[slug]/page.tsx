import { notFound } from "next/navigation";
import { isUrlLocale, toLocale } from "@/lib/routing";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isUrlLocale(locale) || slug !== `terms-of-use-${locale}`) notFound();
  return pageMetadata(toLocale(locale), "/terms-of-use");
}

export default async function Terms({ params }: Props) {
  const { locale, slug } = await params;
  if (slug !== `terms-of-use-${locale}`) notFound();
  return null;
}
