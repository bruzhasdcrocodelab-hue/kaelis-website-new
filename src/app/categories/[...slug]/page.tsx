import { notFound } from "next/navigation";
import { dictionaries } from "@/lang";
import { getLocale } from "@/lib/locale";
import CategoryPageView from "@/components/categories-page/CategoryPageView";

interface CategoryPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  if (slug.length > 2) notFound();

  const locale = await getLocale();
  const dictionary = dictionaries[locale];

  return (
    <CategoryPageView
      dictionary={dictionary}
      locale={locale}
      path={slug}
    />
  );
}
