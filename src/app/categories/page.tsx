import { dictionaries } from "@/lang";
import { getLocale } from "@/lib/locale";
import { getCategoryList } from "@/lib/categories/list";
import CategoriesListView from "@/components/categories-list-page/CategoriesListView";

export default async function CategoriesListPage() {
  const locale = await getLocale();
  const dictionary = dictionaries[locale];
  const categories = getCategoryList();

  return <CategoriesListView dictionary={dictionary} locale={locale} categories={categories} />;
}
