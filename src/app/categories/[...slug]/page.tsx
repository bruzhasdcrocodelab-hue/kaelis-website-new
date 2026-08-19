import { notFound } from "next/navigation";
import { dictionaries, defaultLocale } from "@/lang";
import { findCategoryPath } from "@/lib/categories/data";
import CategoryPageView from "@/components/categories-page/CategoryPageView";

interface CategoryPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const path = findCategoryPath(slug);

  if (!path) notFound();

  const dictionary = dictionaries[defaultLocale];
  const current = path[path.length - 1];
  const parent = path.length > 1 ? path[path.length - 2] : undefined;

  const returnHref = parent ? `/categories/${slug.slice(0, -1).join("/")}` : "/";
  const returnLabel = parent
    ? `${dictionary.categoryPage.returnToPrefix} ${parent.title[defaultLocale]}`
    : dictionary.categoryPage.returnToMain;

  return (
    <CategoryPageView
      dictionary={dictionary}
      locale={defaultLocale}
      current={current}
      topLevelCategory={path[0]}
      path={slug}
      returnHref={returnHref}
      returnLabel={returnLabel}
    />
  );
}
