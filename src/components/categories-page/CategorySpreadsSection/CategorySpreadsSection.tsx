import Link from "@/components/reading/ReadingLink";
import type { Locale } from "@/lang";
import type { CSSProperties } from "react";
import type { TarotSpread } from "@/lib/categories/catalog";
import { spreadHref } from "@/lib/categories/catalog";
import type { TarotPageContent } from "@/lib/categories/tarotPage";
import styles from "./CategorySpreadsSection.module.css";

export default function CategorySpreadsSection({ locale, categorySlug, categoryName, spreads, currentSlug, section, cards }: { locale: Locale; categorySlug: string; categoryName: string; spreads: TarotSpread[]; currentSlug?: string; section?: TarotPageContent["spreadsSection"]; cards: Record<string, Pick<TarotPageContent["hero"], "shortDescription" | "iconPath">> }) {
  const heading = section?.heading || (locale === "en" ? `Choose a ${categoryName} Tarot Spread` : locale === "ru" ? `Выберите расклад Таро: ${categoryName}` : `Оберіть розклад Таро: ${categoryName}`);
  const description = section?.description || (locale === "en" ? "Find a spread for the question you want to explore." : locale === "ru" ? "Найдите расклад для вопроса, который хотите исследовать." : "Знайдіть розклад для питання, яке хочете дослідити.");
  return (
    <section id="category-spreads" className={styles.section}>
      <div className={styles.head}>
        <h2>{locale === "en" && !section?.heading ? <>Choose a {categoryName}<br className={styles.mobileBreak} /> Tarot Spread</> : heading}</h2>
        <p>{description}</p>
      </div>
      <div className={styles.grid}>
        {spreads.map((spread) => {
          const selected = spread.slug === currentSlug;
          const page = cards[spread.slug];
          return (
            <Link
              href={spreadHref(categorySlug, spread.slug, locale)}
              className={`${styles.card} ${selected ? styles.selected : ""}`}
              key={spread.id}
              aria-current={selected ? "page" : undefined}
            >
              <span className={styles.cardHeading}>
                <span className={styles.icon} aria-hidden>
                  <span className={styles.iconGlyph} style={page?.iconPath ? { "--spread-icon": `url("${page.iconPath}")` } as CSSProperties : undefined} />
                </span>
                <span className={styles.name}>
                  <span>{spread.name}</span>
                  <span className={styles.arrow} aria-hidden>
                    <span className={styles.arrowGlyph} />
                  </span>
                </span>
              </span>
              <span className={styles.description}>{page?.shortDescription || spread.description}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
