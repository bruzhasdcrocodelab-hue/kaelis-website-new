import { notFound } from "next/navigation";
import { isUrlLocale, toLocale } from "@/lib/routing";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string[] }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isUrlLocale(locale) || slug.length > 2) notFound();
  return pageMetadata(toLocale(locale), `/tarot/${slug.join("/")}`);
}

export default async function Category({ params }: Props) {
  if ((await params).slug.length > 2) notFound();
  return null;
}
