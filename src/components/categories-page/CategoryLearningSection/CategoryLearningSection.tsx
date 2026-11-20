"use client";

import Image from "next/image";
import Link from "@/components/reading/ReadingLink";
import MainButton from "@/components/global/MainButton";
import type { Locale } from "@/lang";
import { categoryPageContent } from "@/lib/categories/pageContent";
import { spreadHref, type TarotCategory, type TarotSpread } from "@/lib/categories/catalog";
import styles from "./CategoryLearningSection.module.css";

function scrollToQuestion() {
  document.getElementById("category-ask-question")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CategoryLearningSection({ locale, category, spreads, exampleQuestion }: { locale: Locale; category: TarotCategory; spreads: TarotSpread[]; exampleQuestion?: string }) {
  const content = categoryPageContent(locale, category, spreads);
  const links = content.links.map((spread) => ({
    ...spread,
    href: spreads.length === 1 ? "#category-ask-question" : spreadHref(category.slug, spread.slug, locale),
  }));

  return <section id="category-learning" className={styles.section}>
    <div className={styles.decorativeCard} aria-hidden>
      <Image src="/images/cards/deck/knight-of-wands.png" alt="" fill sizes="228px" />
    </div>
    <article className={styles.article}>
      <h2 className="font-bona-3xl">{locale === "en" ? <>How a {category.name} Tarot<br />Reading Works</> : content.learningTitle}</h2>
      <div className={`font-instrument-base ${styles.copy}`}>
        <p>{content.intro}</p>
        <p>
          {content.secondLead}
          {links.map((spread, index) => <span key={spread.id}>
            <Link className={styles.textLink} href={spread.href}>{spread.name}</Link>
            {index < links.length - 1 ? content.secondBetween : content.secondEnd}
          </span>)}
          {!links.length && content.secondEnd}
        </p>
        <p>{content.third}</p>
      </div>
    </article>
    <aside className={styles.example} aria-label={content.exampleTitle}>
      <div className={styles.exampleHeading}>
        <h3 className="font-bona-2xl">{content.exampleTitle}</h3>
        <p className="font-instrument-sm">{exampleQuestion ? `“ ${exampleQuestion} ”` : ""}</p>
      </div>
      <div className={styles.exampleContent}>
        <section className={styles.card} aria-label={content.cardDescription}>
          <header className={`font-instrument-xxs-emphasized ${styles.cardHeader}`}>{content.cardDescription}</header>
          <div className={styles.cardBody}>
            <div className={styles.cardImage}>
              <Image src="/images/cards/deck/knight-of-wands.png" alt={content.knightOfWands} fill sizes="(max-width: 768px) 310px, 208px" />
              <span className={`font-instrument-xxs-emphasized ${styles.cardLabel}`}>{content.knightOfWands}</span>
            </div>
            <div className={styles.readingPart}>
              <p className="font-instrument-xxs-emphasized">{content.quickRead}</p>
              <p className="font-instrument-xxs">{content.quickReadText}</p>
            </div>
            <div className={`${styles.fullDescription} ${styles.readingPart}`}>
              <p className="font-instrument-xxs-emphasized">{content.fullDescription}</p>
              <div className={styles.descriptionSections}>
                <div className={styles.detail}>
                  <p className="font-instrument-xxs-emphasized">{content.impact}</p>
                  <p className="font-instrument-xxs">{content.impactText}</p>
                </div>
                <div className={styles.detail}>
                  <p className="font-instrument-xxs-emphasized">{content.recognition}</p>
                  <p className="font-instrument-xxs">{content.recognitionText}</p>
                </div>
                <div className={styles.detail}>
                  <p className="font-instrument-xxs-emphasized">{content.focus}</p>
                  <p className="font-instrument-xxs">{content.focusText}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className={styles.buttonOutline}>
          <MainButton variant="gradient" size="small" icon="/icons/right-arrow.svg" iconRotation={-90} onClick={scrollToQuestion}>{content.ask}</MainButton>
        </div>
      </div>
    </aside>
  </section>;
}
