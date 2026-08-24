import TermsPageView from "@/components/article/TermsPageView";
import { dictionaries } from "@/lang";
import { getLocale } from "@/lib/locale";

export default async function TermsOfUsePage() {
  const locale = await getLocale();
  const dictionary = dictionaries[locale];

  return <TermsPageView dictionary={dictionary} locale={locale} />;
}
