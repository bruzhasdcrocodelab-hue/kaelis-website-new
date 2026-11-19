import Image from "next/image";
import Link from "@/components/reading/ReadingLink";
import type { Locale } from "@/lang";
import type { TarotSpread } from "@/lib/categories/catalog";
import { spreadHref } from "@/lib/categories/catalog";
import styles from "./CategorySpreadsSection.module.css";

export default function CategorySpreadsSection({ locale, categorySlug, categoryName, spreads, currentSlug }: { locale: Locale; categorySlug: string; categoryName: string; spreads: TarotSpread[]; currentSlug?: string }) {
  return <section id="category-spreads" className={styles.section}>
    <div className={styles.head}>
      <h2 className="font-bona-3xl">{locale === "en" ? `Choose a ${categoryName} Tarot Spread` : locale === "ru" ? `Выберите расклад Таро: ${categoryName}` : `Оберіть розклад Таро: ${categoryName}`}</h2>
      <p className="font-instrument-sm">{locale === "en" ? "Find a spread for the question you want to explore." : locale === "ru" ? "Найдите расклад для вопроса, который хотите исследовать." : "Знайдіть розклад для питання, яке хочете дослідити."}</p>
    </div>
    <div className={styles.grid}>{spreads.map((spread, index) => {
      const selected = spread.slug === currentSlug;
      return <Link href={spreadHref(categorySlug, spread.slug, locale)} className={`${styles.card} ${selected ? styles.selected : ""}`} key={spread.id} aria-current={selected ? "page" : undefined}>
        <span className={`${styles.icon} ${index % 2 ? styles.outline : ""}`}>{spread.image ? <Image src={spread.image} alt="" width={18} height={18} unoptimized /> : <span>✦</span>}</span>
        <span className={styles.copy}><span className="font-bona-base">{spread.name}</span><span className="font-instrument-xxs">{spread.description}</span></span>
        <span className={styles.arrow} aria-hidden>↗</span>
      </Link>;
    })}</div>
  </section>;
}
