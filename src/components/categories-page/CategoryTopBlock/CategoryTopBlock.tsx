"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
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
import AskQuestionStep from "./AskQuestionStep/AskQuestionStep";
import ChooseCardsStep from "./ChooseCardsStep/ChooseCardsStep";
import RevealCardsStep from "./RevealCardsStep/RevealCardsStep";
import { useReadingNavigation } from "@/components/reading/ReadingNavigationProvider";
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
  sessionKey?: number;
  embedded?: boolean;
  catalogStatus?: {
    status: "loading" | "error" | "notFound";
    retry: () => void;
  };
}

type Step = "ask" | "choose" | "reveal";

type Appearance = { step: Step; hasFan: boolean };

export default function CategoryTopBlock(props: CategoryTopBlockProps) {
  const { embedded = false, sessionKey = 0 } = props;
  const [firstSession] = useState(sessionKey);
  const [{ step, hasFan }, setAppearance] = useState<Appearance>({ step: "ask", hasFan: true });
  const panelRef = useRef<HTMLDivElement>(null);
  const isConfirmed = step === "reveal";
  return (
    <section className={`${styles.section} ${embedded ? styles.embedded : ""}`}>
      <div
        ref={panelRef}
        id="category-top-block"
        data-reading-panel={isConfirmed || undefined}
        className={`${styles.panel} ${step === "choose" ? styles.panelLoading : ""} ${isConfirmed ? `${styles.panelConfirmed} ${styles.panelReading}` : ""}`}
        style={{
          // Inline so the build's CSS pipeline doesn't drop the unprefixed property:
          // it blurs whatever the page paints behind this panel, within its bounds.
          backdropFilter: "blur(12.5px)",
          WebkitBackdropFilter: "blur(12.5px)",
        }}
      >
        <Image
          src="/images/backgrounds/pattern-categories-top-block-2.svg"
          alt=""
          width={1627}
          height={731}
          className={`${styles.pattern} ${isConfirmed ? styles.patternBehind : ""}`}
          aria-hidden
        />
        <AnimatedWaves className={styles.waves} style={{ zIndex: 3 }} />
        {hasFan || step === "choose"
          ? <WavesLineFrame className={styles.wavesLine} style={{ zIndex: 2 }} />
          : <GradientWavesLineFrame className={styles.wavesLine} style={{ zIndex: -2 }} />}
        <AnimatePresence mode="wait">
          <SessionContent key={sessionKey} {...props} panelRef={panelRef} onAppearance={setAppearance}
            initialVisible={sessionKey === firstSession} />
        </AnimatePresence>
      </div>
    </section>
  );
}

function SessionContent({
  dictionary,
  locale,
  categoryLabel,
  categoryId, spreadId, sessionActive: active = true, embedded = false, catalogStatus,
  panelRef, onAppearance, initialVisible,
}: CategoryTopBlockProps & {
  panelRef: RefObject<HTMLDivElement | null>;
  onAppearance: (value: Appearance) => void;
  initialVisible: boolean;
}) {
  const present = useIsPresent();
  const sessionActive = active && present;
  const reduced = useReducedMotion();
  const navigation = useReadingNavigation();
  const currentFlow = useReading(locale, categoryId, spreadId, sessionActive);
  const text = readingMessages[locale];
  const [firstCycleComplete, setFirstCycleComplete] = useState(false);
  const [lastPresentation, setLastPresentation] = useState({
    reading: currentFlow.reading, question: currentFlow.question, busy: currentFlow.busy, firstCycleComplete,
  });
  if (sessionActive && (lastPresentation.reading !== currentFlow.reading || lastPresentation.question !== currentFlow.question ||
    lastPresentation.busy !== currentFlow.busy || lastPresentation.firstCycleComplete !== firstCycleComplete)) {
    setLastPresentation({ reading: currentFlow.reading, question: currentFlow.question, busy: currentFlow.busy, firstCycleComplete });
  }
  const flow = sessionActive ? currentFlow : { ...currentFlow, ...lastPresentation };
  const completeFirstCycle = useCallback(() => {
    if (sessionActive) setFirstCycleComplete(true);
  }, [sessionActive]);
  // Receiving cards alone does not mean the AI interpretation is ready.
  const step: Step = flow.reading?.reading && (sessionActive ? firstCycleComplete : lastPresentation.firstCycleComplete)
    ? "reveal"
    : flow.busy || flow.reading ? "choose" : "ask";
  const previousStep = useRef(step);
  useEffect(() => {
    if (!sessionActive) { previousStep.current = step; return; }
    if (previousStep.current === step) return;
    const restarting = previousStep.current === "reveal" && step === "ask";
    previousStep.current = step;
    if (step !== "reveal" && !restarting) return;
    const panel = panelRef.current;
    if (!panel) return;
    const anchor = restarting && embedded ? document.getElementById("cards") ?? panel : panel;
    let frame = 0;
    let previousTop: number | undefined;
    let active = true;
    const cancel = () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) {
        window.removeEventListener(event, cancel);
      }
    };
    // Scroll after the new step is laid out; initial mount and data updates stay put.
    const scroll = () => {
      frame = 0;
      if (!active) return;
      const margin = parseFloat(getComputedStyle(anchor).scrollMarginTop) || 0;
      const target = Math.max(0, window.scrollY + anchor.getBoundingClientRect().top - margin);
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const top = Math.min(target, maxScroll);
      if (top !== previousTop) {
        window.scrollTo({
          top,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        });
        previousTop = top;
      }
      if (maxScroll >= target) cancel();
    };
    const schedule = () => {
      if (active && !frame) frame = requestAnimationFrame(scroll);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(panel.closest("[data-home-panels]") ?? panel);
    for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) {
      window.addEventListener(event, cancel, { passive: true });
    }
    schedule();
    return cancel;
  }, [step, embedded, sessionActive, panelRef]);
  const hasProgress = step !== "ask" || flow.busy || flow.question.trim().length > 0;
  const [guideSheetOpen, setGuideSheetOpen] = useState(false);
  const selectedSpeaker = flow.speakers.find(s => s.id === flow.speakerId);
  const speakerIcon = (icon: string | null | undefined) => GUIDE_ICON[icon as keyof typeof GUIDE_ICON] ?? "/icons/analyst.svg";
  const changeQuestion = () => {
    flow.reset();
    flow.setQuestion("");
    setFirstCycleComplete(false);
    setGuideSheetOpen(false);
  };
  useLayoutEffect(() => {
    if (sessionActive) return navigation?.register({ started: hasProgress, reset: changeQuestion });
  });
  const isConfirmed = step === "reveal";
  const loadingStatus = catalogStatus ?? (embedded && !flow.speakers.length
    ? { status: flow.speakerError ? "error" as const : "loading" as const, retry: flow.retrySpeakers }
    : undefined);
  const hasFan = step === "ask" && (embedded || !loadingStatus);
  useLayoutEffect(() => {
    if (present) onAppearance({ step, hasFan });
  }, [step, hasFan, present, onAppearance]);

  const stepTitle: Record<Step, string> = {
    ask: dictionary.askTitle,
    choose: "",
    reveal: dictionary.revealTitle,
  };
  const stepDescription: Record<Step, string> = {
    ask: dictionary.askDescription,
    choose: "",
    reveal: flow.reading?.question ? `“${flow.reading.question}”` : dictionary.askDescription,
  };

  return (
    <motion.div className={styles.content} data-reading-content inert={!present} aria-hidden={!present}
      initial={{ opacity: initialVisible ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.16, ease: [0.4, 0, 0.2, 1] }}>
        {!loadingStatus && step === "ask" && (
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
              size="medium"
              icon={speakerIcon(selectedSpeaker?.icon)}
              aria-label={selectedSpeaker?.name ?? text.loading}
              disabled={step !== "ask" || flow.busy || !flow.speakers.length}
              onClick={() => setGuideSheetOpen(true)}
              muted
            >
              {selectedSpeaker?.name ?? text.loading}
            </MainButton>
          </div>
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

          <div className={styles.center} data-reading-heading>
            <div className={styles.categoryTag}>
              {!isConfirmed && <Image
                src="/icons/eye-gradient.svg"
                alt=""
                width={24}
                height={24}
                className={styles.eyeIcon}
                aria-hidden
              />}
              <p className={`font-instrument-xs ${styles.categoryTagLabel}`}>
                {isConfirmed ? [categoryLabel, selectedSpeaker?.name].filter(Boolean).join(", ") : `${dictionary.categoryPrefix} ${categoryLabel}`}
              </p>
            </div>
            <div className={styles.askBlock}>
              <p className={`font-bona-topblock-title ${styles.askTitle}`}>
                {isConfirmed ? <><span className={styles.revealDesktopCopy}>{stepTitle[step]}</span><span className={styles.revealMobileCopy}>{dictionary.findTitle}</span></> : stepTitle[step]}
              </p>
              <p className={`font-instrument-xs ${styles.askDescription}`}>
                {isConfirmed ? <><span className={styles.revealDesktopCopy}>{dictionary.askDescription}</span><span className={styles.revealMobileCopy}>{stepDescription[step]}</span></> : stepDescription[step]}
              </p>
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
            embedded={embedded} error={flow.error} onContinue={() => { setFirstCycleComplete(false); void flow.submit(); }} />
        )}
        {step === "reveal" && flow.reading && (
          <RevealCardsStep
            sessionActive={sessionActive}
            dictionary={dictionary}
            locale={locale}
            reading={flow.reading}
            error={flow.error} onRetry={flow.retry}
            onStartOver={changeQuestion}
          />
        )}
        {flow.speakerError && <div className={styles.flowError} role="alert">{text.error} <button type="button" onClick={flow.retrySpeakers}>{text.retry}</button></div>}
        </>}
      <BottomSheetSelect<string>
        open={guideSheetOpen && sessionActive}
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
    </motion.div>
  );
}
