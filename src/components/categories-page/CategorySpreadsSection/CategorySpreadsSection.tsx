import Link from "@/components/reading/ReadingLink";
import type { Locale } from "@/lang";
import type { TarotSpread } from "@/lib/categories/catalog";
import { spreadHref } from "@/lib/categories/catalog";
import { getSeo } from "@/lib/seo";
import styles from "./CategorySpreadsSection.module.css";

export default function CategorySpreadsSection({ locale, categorySlug, categoryName, spreads, currentSlug }: { locale: Locale; categorySlug: string; categoryName: string; spreads: TarotSpread[]; currentSlug?: string }) {
  return (
    <section id="category-spreads" className={styles.section}>
      <div className={styles.head}>
        <h2>{locale === "en" ? <>Choose a {categoryName}<br className={styles.mobileBreak} /> Tarot Spread</> : locale === "ru" ? `Выберите расклад Таро: ${categoryName}` : `Оберіть розклад Таро: ${categoryName}`}</h2>
        <p>{locale === "en" ? "Find a spread for the question you want to explore." : locale === "ru" ? "Найдите расклад для вопроса, который хотите исследовать." : "Знайдіть розклад для питання, яке хочете дослідити."}</p>
      </div>
      <div className={styles.grid}>
        {spreads.map((spread) => {
          const selected = spread.slug === currentSlug;
          const description = getSeo(locale, `/tarot/${categorySlug}/${spread.slug}`)?.intro || spread.description;
          return (
            <Link
              href={spreadHref(categorySlug, spread.slug, locale)}
              className={`${styles.card} ${selected ? styles.selected : ""}`}
              key={spread.id}
              aria-current={selected ? "page" : undefined}
            >
              <span className={styles.cardHeading}>
                <span className={styles.icon} aria-hidden>
                  <span className={styles.iconGlyph} />
                </span>
                <span className={styles.name}>
                  <span>{spread.name}</span>
                  <span className={styles.arrow} aria-hidden>
                    <span className={styles.arrowGlyph} />
                  </span>
                </span>
              </span>
              <span className={styles.description}>{description}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
