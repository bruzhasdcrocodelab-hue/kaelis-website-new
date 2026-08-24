import TermsPageView from "@/components/article/TermsPageView";
import { dictionaries, defaultLocale } from "@/lang";

export default function TermsOfUsePage() {
  const dictionary = dictionaries[defaultLocale];

  return <TermsPageView dictionary={dictionary} />;
}
