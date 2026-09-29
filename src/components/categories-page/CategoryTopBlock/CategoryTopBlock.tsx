"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import MainButton from "@/components/global/MainButton";
import TriggerButton, {
  GUIDE_ICON,
} from "@/components/categories-page/TriggerButton";
import BottomSheetSelect from "@/components/global/BottomSheetSelect";
import { type Dictionary, type Locale } from "@/lang";
import AnimatedWaves from "./AnimatedWaves/AnimatedWaves";
import WavesLineFrame from "./WavesLineFrame/WavesLineFrame";
import GradientWavesLineFrame from "./GradientWavesLineFrame/GradientWavesLineFrame";
import AnswerStep from "./AnswerStep/AnswerStep";
import AskQuestionStep from "./AskQuestionStep/AskQuestionStep";
import ChooseCardsStep from "./ChooseCardsStep/ChooseCardsStep";
import RevealCardsStep from "./RevealCardsStep/RevealCardsStep";
import { useReading } from "@/lib/tarot/useReading";
import { readingMessages } from "@/lib/tarot/messages";
import styles from "./CategoryTopBlock.module.css";

export interface CategoryTopBlockProps {
  dictionary: Dictionary["categoryPage"]["topBlock"];
  locale: Locale;
  /** Always the top-level category name, even when viewing a nested subcategory. */
  categoryLabel: string;
  /** Spread size used by the decorative fan. The API selects the actual cards. */
  maxSelectableCards: number;
  categoryId: string;
  spreadId: string;
}

type Step = "ask" | "reveal" | "answer";

export default function CategoryTopBlock({
  dictionary,
  locale,
  categoryLabel,
  maxSelectableCards, categoryId, spreadId,
}: CategoryTopBlockProps) {
  const flow = useReading(locale, categoryId, spreadId);
  const text = readingMessages[locale];
  const [showAnswer, setShowAnswer] = useState(false);
  const step: Step = flow.reading ? (showAnswer ? "answer" : "reveal") : "ask";
  const [guideSheetOpen, setGuideSheetOpen] = useState(false);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const selectedSpeaker = flow.speakers.find(s => s.id === flow.speakerId);
  const speakerIcon = (icon: string | null | undefined) => GUIDE_ICON[icon as keyof typeof GUIDE_ICON] ?? "/icons/analyst.svg";
  const changeQuestion = () => { flow.reset(); setShowAnswer(false); };
  const isConfirmed = step === "reveal";
  const hasFan = step === "ask" || step === "answer";

  const stepTitle: Record<Step, string> = {
    ask: dictionary.askTitle,
    reveal: dictionary.findTitle,
    answer: dictionary.truthTitle,
  };
  const stepDescription: Record<Step, string> = {
    ask: dictionary.askDescription,
    reveal: flow.reading?.question ? `“${flow.reading.question}”` : "",
    answer: flow.reading?.question ? `“${flow.reading.question}”` : "",
  };

  return (
    <section id="category-top-block" className={styles.section}>
      <div
        className={`${styles.panel} ${isConfirmed ? `${styles.panelConfirmed} ${styles.panelReading}` : ""}`}
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
        {/* Manual selection is bypassed; keep the decorative fan below. */}
        {hasFan && (
          <>
            <ChooseCardsStep
              selectedIds={[]}
              maxSelectableCards={maxSelectableCards}
              onToggleCard={() => {}}
              isInteractive={false}
            />
            <div className={styles.fadeOverlay} aria-hidden />
          </>
        )}
        <AnimatedWaves className={styles.waves} style={{ zIndex: 3 }} />
        {hasFan ? (
          <>
            <WavesLineFrame className={styles.wavesLine} style={{ zIndex: 2 }} />
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
          <GradientWavesLineFrame className={styles.wavesLine} style={{ zIndex: -2 }} />
        )}

        <div className={styles.row}>
          <div className={styles.side}>
            {step === "reveal" && (
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
              {step === "ask" && (
                <div className={styles.triggerDesktop}>
                  <TriggerButton dictionary={dictionary.guides} options={flow.speakers.map(s => ({ value: s.id, label: s.name, icon: speakerIcon(s.icon) }))} value={flow.speakerId} onChange={flow.setSpeakerId} disabled={flow.busy || !flow.speakers.length} />
                </div>
              )}
            </div>
          </div>
        </div>

        {step === "ask" && (
          <AskQuestionStep dictionary={dictionary} question={flow.question} onChange={flow.setQuestion}
            disabled={flow.busy || !flow.speakerId} loading={flow.busy} loadingLabel={text.loading}
            error={flow.error} onContinue={() => { void flow.submit(); }} />
        )}
        {step === "reveal" && flow.reading && (
          <RevealCardsStep
            dictionary={dictionary}
            locale={locale}
            reading={flow.reading}
            error={flow.error} onRetry={flow.retry}
            onAnswerQuestion={() => { if (flow.reading?.reading) setShowAnswer(true); }}
            mobileSheetTopRef={subtitleRef}
          />
        )}
        {step === "answer" && (
          <AnswerStep
            dictionary={dictionary}
            answer={flow.reading?.reading?.sections.map(s => [s.title, s.text].filter(Boolean).join("\n")).join("\n\n") ?? ""}
            onStartOver={() => { changeQuestion(); flow.setQuestion(""); }}
          />
        )}
        {flow.speakerError && <div className={styles.flowError} role="alert">{text.error} <button type="button" onClick={flow.retrySpeakers}>{text.retry}</button></div>}
      </div>

      {(step === "reveal" || step === "ask") && (
        <div className={styles.triggerMobile}>
          {step === "reveal" && (
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
            icon={speakerIcon(selectedSpeaker?.icon)}
            aria-label={selectedSpeaker?.name ?? text.loading}
            disabled={step !== "ask" || flow.busy || !flow.speakers.length}
            onClick={() => setGuideSheetOpen(true)}
            muted
          />
        </div>
      )}

      <BottomSheetSelect<string>
        open={guideSheetOpen}
        onClose={() => setGuideSheetOpen(false)}
        options={flow.speakers.map(s => ({
          value: s.id,
          label: s.name,
          icon: speakerIcon(s.icon),
          description: dictionary.guideDescriptions[s.icon as keyof typeof dictionary.guideDescriptions],
        }))}
        selectedValue={flow.speakerId}
        onSelect={flow.setSpeakerId}
      />
    </section>
  );
}
