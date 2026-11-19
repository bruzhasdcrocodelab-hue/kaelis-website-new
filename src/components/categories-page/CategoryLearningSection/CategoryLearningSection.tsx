"use client";

import Image from "next/image";
import Link from "@/components/reading/ReadingLink";
import MainButton from "@/components/global/MainButton";
import type { Locale } from "@/lang";
import { categoryPageContent } from "@/lib/categories/pageContent";
import { spreadHref, type TarotCategory, type TarotSpread } from "@/lib/categories/catalog";
import styles from "./CategoryLearningSection.module.css";

export default function CategoryLearningSection({ locale, category, spreads, exampleQuestion }: { locale: Locale; category: TarotCategory; spreads: TarotSpread[]; exampleQuestion?: string }) {
  const content = categoryPageContent(locale, category, spreads);
  return <section className={styles.section}>
    <article className={styles.article}>
      <h2 className="font-bona-3xl">{content.learningTitle}</h2>
      <p className="font-instrument-sm">{content.intro}</p><p className="font-instrument-sm">{content.first}</p>
      <p className="font-instrument-sm">{content.second}</p><p className="font-instrument-sm">{content.third}</p>
      <div className={styles.links}>{content.links.map((spread) => <Link key={spread.id} className="font-instrument-sm-emphasized" href={spreadHref(category.slug, spread.slug, locale)}>{spread.name}</Link>)}</div>
    </article>
    <div className={styles.example}>
      <h3 className="font-bona-2xl">{content.exampleTitle}</h3>
      <p className="font-instrument-xs">“{exampleQuestion ?? category.site_description}”</p>
      <div className={styles.card}><p className="font-instrument-xxs">Knight of Wands</p><Image src="/images/cards/deck/knight-of-wands.png" alt="Knight of Wands" width={260} height={360} /><p className="font-instrument-xxs">Quick read</p></div>
      <MainButton variant="gradient" size="small" icon="/icons/right-arrow.svg" onClick={() => document.getElementById("category-top-block")?.scrollIntoView({ behavior: "smooth" })}>{content.ask}</MainButton>
    </div>
  </section>;
}
