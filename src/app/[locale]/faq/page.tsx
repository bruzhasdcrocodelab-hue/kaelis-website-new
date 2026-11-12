import { notFound } from "next/navigation";
import RouteAnalytics from "@/components/RouteAnalytics";
import FaqPageView from "@/components/faq/FaqPageView";
import JsonLd from "@/components/seo/JsonLd";
import { dictionaries } from "@/lang";
import { faqPageContent } from "@/lib/faq/content";
import { isUrlLocale, toLocale } from "@/lib/routing";
import { pageMetadata, pageTitle } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isUrlLocale(locale)) notFound();
  return pageMetadata(toLocale(locale), "/faq");
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  if (!isUrlLocale(locale)) notFound();
  const language = toLocale(locale);
  const content = faqPageContent[language];
  return <>
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    }} />
    <RouteAnalytics pathname={`/${locale}/faq`} pageTitle={pageTitle(language, "/faq")} />
    <FaqPageView dictionary={dictionaries[language]} locale={language} content={content} />
  </>;
}
