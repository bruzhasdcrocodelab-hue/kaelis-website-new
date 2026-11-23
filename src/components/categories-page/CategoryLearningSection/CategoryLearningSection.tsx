"use client";

import Image from "next/image";
import Link from "@/components/reading/ReadingLink";
import MainButton from "@/components/global/MainButton";
import type { Locale } from "@/lang";
import { categoryPageContent } from "@/lib/categories/pageContent";
import { spreadHref, type TarotCategory, type TarotSpread } from "@/lib/categories/catalog";
import styles from "./CategoryLearningSection.module.css";

const loveLinkCopy: Record<Locale, [string, string, string, string]> = {
  en: [
    "If you want to choose a spread, try ",
    " for a question about your current relationship, ",
    " if you’re single and thinking about finding a partner, or ",
    " if you’re deciding whether to stay or leave. If you’re unsure which one fits, start with your own question in the form above.",
  ],
  ru: [
    "Если хотите выбрать расклад, попробуйте ",
    " для вопроса о текущих отношениях, ",
    " если вы одиноки и думаете о поиске партнёра, или ",
    " если решаете, остаться или уйти. Если не уверены, какой вариант подходит, начните с собственного вопроса в форме выше.",
  ],
  uk: [
    "Якщо хочете обрати розклад, спробуйте ",
    " для питання про ваші поточні стосунки, ",
    " якщо ви самотні й думаєте про пошук партнера, або ",
    " якщо вирішуєте, залишитися чи піти. Якщо не впевнені, який варіант підходить, почніть із власного питання у формі вище.",
  ],
};

const genericLinkCopy: Record<Locale, { between: string; last: string; end: string }> = {
  en: {
    between: ", ",
    last: ", or ",
    end: " to explore it. If you’re unsure which one fits, start with your own question in the form above.",
  },
  ru: {
    between: ", ",
    last: " или ",
    end: ", чтобы рассмотреть ситуацию точнее. Если не уверены, какой вариант подходит, начните с собственного вопроса в форме выше.",
  },
  uk: {
    between: ", ",
    last: " або ",
    end: ", щоб точніше розглянути ситуацію. Якщо не впевнені, який варіант підходить, почніть із власного питання у формі вище.",
  },
};

function scrollToQuestion() {
  document.getElementById("category-ask-question")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CategoryLearningSection({ locale, category, spreads, exampleQuestion }: { locale: Locale; category: TarotCategory; spreads: TarotSpread[]; exampleQuestion?: string }) {
  const content = categoryPageContent(locale, category, spreads);
  const links = content.links.map((spread) => ({
    ...spread,
    href: spreads.length === 1 ? "#category-ask-question" : spreadHref(category.slug, spread.slug, locale),
  }));
  const loveCopy = category.slug === "love" && links.length === 3 ? loveLinkCopy[locale] : undefined;
  const genericCopy = genericLinkCopy[locale];

  return <section id="category-learning" className={`${styles.section} ${spreads.length <= 1 ? styles.withoutSpreads : ""}`}>
    <div className={styles.decorativeCardBack} aria-hidden>
      <Image src="/images/cards/deck/knight-of-wands.png" alt="" fill sizes="228px" />
    </div>
    <div className={styles.decorativeCardFront} aria-hidden>
      <Image src="/images/cards/deck/knight-of-wands.png" alt="" fill sizes="228px" />
    </div>
    <article className={styles.article}>
      <h2 className="font-bona-3xl">{locale === "en" ? <>How a {category.name} Tarot<br />Reading Works</> : content.learningTitle}</h2>
      <div className={`font-instrument-base ${styles.copy}`}>
        <p>{content.intro}</p>
        <p>
          {loveCopy?.[0] ?? content.secondLead}
          {links.map((spread, index) => <span key={spread.id}>
            <Link className={styles.textLink} href={spread.href}>{locale === "en" && spread.slug === "between-us" ? "Between Us" : spread.name}</Link>
            {loveCopy
              ? loveCopy[index + 1]
              : index === links.length - 1
                ? genericCopy.end
                : index === links.length - 2
                  ? genericCopy.last
                  : genericCopy.between}
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
