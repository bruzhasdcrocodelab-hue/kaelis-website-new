"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import MainButton from "@/components/global/MainButton";
import TriggerButton from "@/components/categories-page/TriggerButton";
import { pluralizeCardCount, type Dictionary, type Locale } from "@/lang";
import AnimatedWaves from "./AnimatedWaves/AnimatedWaves";
import AnswerStep from "./AnswerStep/AnswerStep";
import AskQuestionStep from "./AskQuestionStep/AskQuestionStep";
import ChooseCardsStep from "./ChooseCardsStep/ChooseCardsStep";
import RevealCardsStep from "./RevealCardsStep/RevealCardsStep";
import styles from "./CategoryTopBlock.module.css";

export interface CategoryTopBlockProps {
  dictionary: Dictionary["categoryPage"]["topBlock"];
  locale: Locale;
  /** Always the top-level category name, even when viewing a nested subcategory. */
  categoryLabel: string;
  /** How many fan cards the user may select for the current category/subcategory. */
  maxSelectableCards: number;
}

type Step = "ask" | "choose" | "reveal" | "answer";

export default function CategoryTopBlock({
  dictionary,
  locale,
  categoryLabel,
  maxSelectableCards,
}: CategoryTopBlockProps) {
  const [step, setStep] = useState<Step>("ask");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const changeQuestion = () => {
    setSelectedIds([]);
    setStep("ask");
  };

  const toggleCard = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length >= maxSelectableCards) {
        setStep("reveal");
        return;
      }
      setSelectedIds((prev) => prev.filter((cardId) => cardId !== id));
      return;
    }
    setSelectedIds((prev) => (prev.length >= maxSelectableCards ? prev : [...prev, id]));
  };

  const isConfirmed = step === "choose" || step === "reveal";
  const hasFan = step === "ask" || step === "answer";

  const stepTitle: Record<Step, string> = {
    ask: dictionary.askTitle,
    choose: dictionary.chooseTitle
      .replace("{count}", String(maxSelectableCards))
      .replace("{cards}", pluralizeCardCount(locale, maxSelectableCards, dictionary)),
    reveal: dictionary.findTitle,
    answer: dictionary.truthTitle,
  };
  const stepDescription: Record<Step, string> = {
    ask: dictionary.askDescription,
    choose: dictionary.chooseDescription,
    reveal: dictionary.chooseDescription,
    answer: dictionary.truthDescription,
  };

  return (
    <section className={styles.section}>
      <div
        className={`${styles.panel} ${isConfirmed ? styles.panelConfirmed : ""}`}
        style={{
          // Inline so the build's CSS pipeline doesn't drop the unprefixed property:
          // it blurs whatever the page paints behind this panel, within its bounds.
          backdropFilter: "blur(12.5px)",
          WebkitBackdropFilter: "blur(12.5px)",
        }}
      >
        {isConfirmed && (
          <Image
            src="/images/backgrounds/pattern-categories-top-block-2.svg"
            alt=""
            width={1627}
            height={731}
            className={`${styles.pattern} ${styles.patternBehind}`}
            aria-hidden
          />
        )}
        {step === "choose" && (
          <ChooseCardsStep
            selectedIds={selectedIds}
            maxSelectableCards={maxSelectableCards}
            onToggleCard={toggleCard}
          />
        )}
        {hasFan && (
          <>
            <ChooseCardsStep
              selectedIds={[]}
              maxSelectableCards={maxSelectableCards}
              onToggleCard={toggleCard}
              isInteractive={false}
            />
            <div className={styles.fadeOverlay} aria-hidden />
          </>
        )}
        <AnimatedWaves className={styles.waves} style={{ zIndex: 3 }} />
        {hasFan ? (
          <>
            <Image
              src="/images/backgrounds/line-waves.svg"
              alt=""
              width={1285}
              height={400}
              className={styles.wavesLine}
              aria-hidden
              style={{zIndex: 2}}
            />
            <Image
              src="/images/backgrounds/pattern-categories-top-block-2.svg"
              alt=""
              width={1627}
              height={731}
              className={styles.pattern}
              aria-hidden
            />
          </>
        ):(
          <Image
            src="/images/backgrounds/gradient-line-waves.svg"
            alt=""
            width={1285}
            height={400}
            className={styles.wavesLine}
            aria-hidden
            style={{zIndex: -2}}
          />
        )}

        <div className={styles.row}>
          <div className={styles.side}>
            {step === "choose" && (
              <MainButton
                variant="default"
                size="medium"
                muted
                icon="/icons/edit.svg"
                onClick={changeQuestion}
              >
                {dictionary.changeQuestion}
              </MainButton>
            )}
          </div>

          <div className={styles.center}>
            <div className={styles.categoryTag}>
              <Image
                src="/icons/eye-gradient.svg"
                alt=""
                width={24}
                height={24}
                className={styles.eyeIcon}
                aria-hidden
              />
              <p className={`font-instrument-xs ${styles.categoryTagLabel}`}>
                {dictionary.categoryPrefix} {categoryLabel}
              </p>
            </div>
            <div className={styles.askBlock}>
              <p className={`font-bona-topblock-title ${styles.askTitle}`}>{stepTitle[step]}</p>
              <p ref={subtitleRef} className={`font-instrument-xs ${styles.askDescription}`}>{stepDescription[step]}</p>
            </div>
          </div>

          <div className={styles.side}>
            <div className={styles.sideEnd}>
              {(step === "choose" || step === "ask") && (
                <div className={styles.triggerDesktop}>
                  <TriggerButton dictionary={dictionary.guides} />
                </div>
              )}
            </div>
          </div>
        </div>

        {step === "ask" && (
          <AskQuestionStep dictionary={dictionary} onContinue={() => setStep("choose")} />
        )}
        {step === "reveal" && (
          <RevealCardsStep
            dictionary={dictionary}
            locale={locale}
            cardCount={maxSelectableCards}
            onAnswerQuestion={() => setStep("answer")}
            mobileSheetTopRef={subtitleRef}
          />
        )}
        {step === "answer" && (
          <AnswerStep
            dictionary={dictionary}
            answer={dictionary.cardDescription}
            onStartOver={() => {
              setSelectedIds([]);
              setStep("ask");
            }}
          />
        )}
      </div>

      {(step === "choose" || step === "reveal" || step === "ask") && (
        <div className={styles.triggerMobile}>
          {(step === "choose" || step === "reveal") && (
            <MainButton
              variant="default"
              size="large"
              icon="/icons/edit.svg"
              aria-label={dictionary.changeQuestion}
              onClick={changeQuestion}
              muted
            />
          )}
          <MainButton
            variant="default"
            size="large"
            icon="/icons/analyst.svg"
            aria-label={dictionary.guides.analyst}
            muted
          />
        </div>
      )}
    </section>
  );
}
