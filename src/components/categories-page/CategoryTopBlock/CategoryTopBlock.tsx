"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import MainButton from "@/components/global/MainButton";
import TriggerButton, {
  GUIDE_ICON,
} from "@/components/categories-page/TriggerButton";
import BottomSheetSelect from "@/components/global/BottomSheetSelect";
import CatalogStatus from "@/components/categories/CatalogStatus";
import { type Dictionary, type Locale } from "@/lang";
import AnimatedWaves from "./AnimatedWaves/AnimatedWaves";
import WavesLineFrame from "./WavesLineFrame/WavesLineFrame";
import GradientWavesLineFrame from "./GradientWavesLineFrame/GradientWavesLineFrame";
import AnswerStep from "./AnswerStep/AnswerStep";
import AskQuestionStep from "./AskQuestionStep/AskQuestionStep";
import ChooseCardsStep from "./ChooseCardsStep/ChooseCardsStep";
import DecorativeCardFan from "./ChooseCardsStep/DecorativeCardFan";
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
  sessionActive?: boolean;
  embedded?: boolean;
  onProgressChange?: (hasProgress: boolean) => void;
  catalogStatus?: {
    status: "loading" | "error" | "notFound";
    retry: () => void;
  };
}

type Step = "ask" | "choose" | "reveal" | "answer";

export default function CategoryTopBlock({
  dictionary,
  locale,
  categoryLabel,
  maxSelectableCards, categoryId, spreadId, sessionActive = true, embedded = false, catalogStatus, onProgressChange,
}: CategoryTopBlockProps) {
  const flow = useReading(locale, categoryId, spreadId, sessionActive);
  const text = readingMessages[locale];
  const [showAnswer, setShowAnswer] = useState(false);
  const [firstCycleComplete, setFirstCycleComplete] = useState(false);
  const completeFirstCycle = useCallback(() => {
    if (sessionActive) setFirstCycleComplete(true);
  }, [sessionActive]);
  // Receiving cards alone does not mean the AI interpretation is ready.
  const step: Step = flow.reading?.reading && firstCycleComplete
    ? (showAnswer ? "answer" : "reveal")
    : flow.busy || flow.reading ? "choose" : "ask";
  const sectionRef = useRef<HTMLElement>(null);
  const previousStep = useRef(step);
  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    // Scroll after the new step is laid out; initial mount and data updates stay put.
    const frame = requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [step]);
  const hasProgress = step !== "ask" || flow.busy || flow.question.trim().length > 0;
  useLayoutEffect(() => {
    onProgressChange?.(hasProgress);
  }, [hasProgress, onProgressChange]);
  const [guideSheetOpen, setGuideSheetOpen] = useState(false);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const selectedSpeaker = flow.speakers.find(s => s.id === flow.speakerId);
  const speakerIcon = (icon: string | null | undefined) => GUIDE_ICON[icon as keyof typeof GUIDE_ICON] ?? "/icons/analyst.svg";
  const changeQuestion = () => { flow.reset(); setShowAnswer(false); setFirstCycleComplete(false); };
  const isConfirmed = step === "reveal";
  const loadingStatus = catalogStatus ?? (embedded && !flow.speakers.length
    ? { status: flow.speakerError ? "error" as const : "loading" as const, retry: flow.retrySpeakers }
    : undefined);
  const hasFan = !loadingStatus && (step === "ask" || step === "answer");

  const stepTitle: Record<Step, string> = {
    ask: dictionary.askTitle,
    choose: "",
    reveal: dictionary.findTitle,
    answer: dictionary.truthTitle,
  };
  const stepDescription: Record<Step, string> = {
    ask: dictionary.askDescription,
    choose: "",
    reveal: flow.reading?.question ? `“${flow.reading.question}”` : "",
    answer: flow.reading?.question ? `“${flow.reading.question}”` : "",
  };

  return (
    <section ref={step === "answer" ? sectionRef : null} id="category-top-block" className={`${styles.section} ${embedded ? styles.embedded : ""}`}>
      <div
        className={`${styles.panel} ${step === "choose" ? styles.panelLoading : ""} ${isConfirmed ? `${styles.panelConfirmed} ${styles.panelReading}` : ""}`}
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
        {/* Preserve the existing decoration on the ask and answer steps. */}
        {hasFan && (
          <>
            <DecorativeCardFan
              selectedIds={[]}
              maxSelectableCards={maxSelectableCards}
              onToggleCard={() => {}}
              isInteractive={false}
            />
            <div className={styles.fadeOverlay} aria-hidden />
          </>
        )}
        <AnimatedWaves className={styles.waves} style={{ zIndex: 3 }} />
        {hasFan || step === "choose" ? (
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

        {loadingStatus ? (
          <div className={styles.loading}>
            <CatalogStatus locale={locale} status={loadingStatus.status} retry={loadingStatus.retry} tone="dark" />
          </div>
        ) : <>
        {step === "choose" ? (
          <ChooseCardsStep dictionary={dictionary} locale={locale} categoryLabel={categoryLabel}
            error={flow.error} onRetry={flow.retry} onFirstCycleComplete={completeFirstCycle} />
        ) : <div className={styles.row}>
          <div className={styles.side}>
            {/* {step === "reveal" && (
              <MainButton
                variant="default"
                size="medium"
                muted
                icon="/icons/edit.svg"
                onClick={changeQuestion}
              >
                {dictionary.changeQuestion}
              </MainButton>
            )} */}
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
        </div>}

        {step === "ask" && (
          <AskQuestionStep dictionary={dictionary} question={flow.question} onChange={flow.setQuestion}
            disabled={flow.busy || !flow.speakerId} loading={flow.busy} loadingLabel={text.loading}
            error={flow.error} onContinue={() => { setFirstCycleComplete(false); void flow.submit(); }} />
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
        </>}
      </div>

      {!loadingStatus && (step === "reveal" || step === "ask") && (
        <div className={styles.triggerMobile}>
          {/* {step === "reveal" && (
            <MainButton
              variant="default"
              size="large"
              icon="/icons/edit.svg"
              aria-label={dictionary.changeQuestion}
              onClick={changeQuestion}
              muted
            />
          )} */}
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
