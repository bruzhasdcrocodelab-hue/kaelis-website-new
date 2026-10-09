import { notFound } from "next/navigation";
import { isUrlLocale } from "@/lib/routing";

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  if (!isUrlLocale((await params).locale)) notFound();
  return children;
}
