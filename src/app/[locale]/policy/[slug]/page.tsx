import { notFound } from "next/navigation";
import { dictionaries } from "@/lang";
import { isUrlLocale, toLocale } from "@/lib/routing";
import { pageMetadata } from "@/lib/seo";
import { policyKeyFromSlug } from "@/lib/policies/catalog";
import { getPolicy } from "@/lib/policies/content";
import TermsPageView from "@/components/article/TermsPageView";

type Props = { params: Promise<{ locale: string; slug: string }> };

function resolvePolicy(locale: string, slug: string) {
  if (!isUrlLocale(locale)) notFound();
  const key = policyKeyFromSlug(slug, locale);
  if (!key) notFound();
  const language = toLocale(locale);
  return { language, policy: getPolicy(language, key) };
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const { language, policy } = resolvePolicy(locale, slug);
  return {
    ...pageMetadata(language, `/policy/${slug}`),
    title: { absolute: policy.title },
  };
}

export default async function PolicyPage({ params }: Props) {
  const { locale, slug } = await params;
  const { language, policy } = resolvePolicy(locale, slug);
  return <TermsPageView dictionary={dictionaries[language]} locale={language} policy={policy} />;
}
