import { notFound } from "next/navigation";
import { isUrlLocale, toLocale } from "@/lib/routing";
import GuestAuth from "@/components/GuestAuth";
import SiteProviders from "@/components/SiteProviders";

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isUrlLocale(locale)) notFound();
  return <>
    <GuestAuth />
    <SiteProviders locale={toLocale(locale)}>{children}</SiteProviders>
  </>;
}
