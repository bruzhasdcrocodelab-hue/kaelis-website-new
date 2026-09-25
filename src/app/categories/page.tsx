import { dictionaries } from "@/lang";
import { getLocale } from "@/lib/locale";
import CategoriesListView from "@/components/categories-list-page/CategoriesListView";

export default async function CategoriesListPage() {
  const locale = await getLocale();
  const dictionary = dictionaries[locale];

  return <CategoriesListView dictionary={dictionary} locale={locale} />;
}
