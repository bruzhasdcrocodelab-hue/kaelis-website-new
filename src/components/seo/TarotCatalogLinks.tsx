import Link from "next/link";
import type { Locale } from "@/lang";
import { categoryHref, spreadHref, type TarotCategory, type TarotSpread } from "@/lib/categories/catalog";
import styles from "./TarotLinks.module.css";

export default function TarotCatalogLinks({ locale, categories, spreadsByCategory }: {
  locale: Locale;
  categories: TarotCategory[];
  spreadsByCategory: Record<string, TarotSpread[]>;
}) {
  return <nav className={styles.catalogLinks} aria-label="Tarot readings">
    {categories.map((category) => <section key={category.id} className={styles.group}>
      <h2 className={styles.groupTitle}><Link href={categoryHref(category.slug, locale)}>{category.name}</Link></h2>
      <ul className={styles.list}>
        {(spreadsByCategory[category.id] ?? []).map((spread) => <li key={spread.id}>
          <Link href={spreadHref(category.slug, spread.slug, locale)}>{spread.name}</Link>
        </li>)}
      </ul>
    </section>)}
  </nav>;
}
