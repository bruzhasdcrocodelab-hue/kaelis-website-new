import { notFound } from "next/navigation";
import { isUrlLocale, toLocale } from "@/lib/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isUrlLocale(locale)) notFound();
  return pageMetadata(toLocale(locale), "/tarot");
}

export default function Categories() { return null; }
