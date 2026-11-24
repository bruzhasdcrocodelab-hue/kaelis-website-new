"use client";

import Image from "next/image";
import {PortableText, type PortableTextComponents} from "@portabletext/react";
import Link from "@/components/reading/ReadingLink";
import MainButton from "@/components/global/MainButton";
import type {Locale} from "@/lang";
import {tarotDeck} from "@/lib/tarotDeck";
import {mergeTarotExample, type TarotPageContent} from "@/lib/categories/tarotPage";
import type {TarotSpread} from "@/lib/categories/catalog";
import styles from "./CategoryLearningSection.module.css";

const learningComponents: PortableTextComponents = {
  block: {
    h3: ({children}) => <h3>{children}</h3>,
    h4: ({children}) => <h4>{children}</h4>,
    blockquote: ({children}) => <blockquote>{children}</blockquote>,
    normal: ({children}) => <p>{children}</p>,
  },
  marks: {
    link: ({value, children}) => {
      const href = typeof value?.href === "string" ? value.href : "";
      if (!href) return <>{children}</>;
      const external = /^https?:\/\//i.test(href);
      return external
        ? <a className={styles.textLink} href={href} target={value?.openInNewTab ? "_blank" : undefined} rel={value?.openInNewTab ? "noreferrer" : undefined}>{children}</a>
        : <Link className={styles.textLink} href={href}>{children}</Link>;
    },
  },
};

function scrollToQuestion() {
  document.getElementById("category-ask-question")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CategoryLearningSection({ locale, currentName, spreads, exampleQuestion, learning, example }: { locale: Locale; currentName: string; spreads: TarotSpread[]; exampleQuestion?: string; learning: TarotPageContent["learning"]; example?: TarotPageContent["example"] }) {
  const heading = learning.heading || (locale === "en" ? `How a ${currentName} Tarot Reading Works` : locale === "ru" ? `Как работает расклад Таро «${currentName}»` : `Як працює розклад Таро «${currentName}»`);
  const content = mergeTarotExample(locale, example);
  const card = tarotDeck.find((item) => item.slug === content.cardSlug) ?? tarotDeck.find((item) => item.slug === "knight-of-wands")!;

  return <section id="category-learning" className={`${styles.section} ${spreads.length <= 1 ? styles.withoutSpreads : ""}`}>
    <div className={styles.decorativeCardBack} aria-hidden>
      <Image src={card.image} alt="" fill sizes="228px" />
    </div>
    <div className={styles.decorativeCardFront} aria-hidden>
      <Image src={card.image} alt="" fill sizes="228px" />
    </div>
    <article className={styles.article}>
      <h2 className="font-bona-3xl">{heading}</h2>
      <div className={`font-instrument-base ${styles.copy}`}>
        <PortableText value={learning.content} components={learningComponents} onMissingComponent={false} />
      </div>
    </article>
    <aside className={styles.example} aria-label={content.heading}>
      <div className={styles.exampleHeading}>
        <h3 className="font-bona-2xl">{content.heading}</h3>
        <p className="font-instrument-sm">{exampleQuestion ? `“ ${exampleQuestion} ”` : ""}</p>
      </div>
      <div className={styles.exampleContent}>
        <section className={styles.card} aria-label={content.cardDescriptionLabel}>
          <header className={`font-instrument-xxs-emphasized ${styles.cardHeader}`}>{content.cardDescriptionLabel}</header>
          <div className={styles.cardBody}>
            <div className={styles.cardImage}>
              <Image src={card.image} alt={card.name[locale]} fill sizes="(max-width: 768px) 310px, 208px" />
              <span className={`font-instrument-xxs-emphasized ${styles.cardLabel}`}>{card.name[locale]}</span>
            </div>
            <div className={styles.readingPart}>
              <p className="font-instrument-xxs-emphasized">{content.quickReadLabel}</p>
              <p className="font-instrument-xxs">{content.quickReadText}</p>
            </div>
            <div className={`${styles.fullDescription} ${styles.readingPart}`}>
              <p className="font-instrument-xxs-emphasized">{content.fullDescriptionLabel}</p>
              <div className={styles.descriptionSections}>
                {content.details.map((detail) => <div key={detail._key} className={styles.detail}>
                  <p className="font-instrument-xxs-emphasized">{detail.title}</p>
                  <p className="font-instrument-xxs">{detail.text}</p>
                </div>)}
              </div>
            </div>
          </div>
        </section>
        <div className={styles.buttonOutline}>
          <MainButton variant="gradient" size="small" icon="/icons/right-arrow.svg" iconRotation={-90} onClick={scrollToQuestion}>{content.askLabel}</MainButton>
        </div>
      </div>
    </aside>
  </section>;
}
