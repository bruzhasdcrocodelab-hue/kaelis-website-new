"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import MainButton from "@/components/global/MainButton";
import TriggerButton, { GUIDE_ICON } from "@/components/categories-page/TriggerButton";
import BottomSheetSelect from "@/components/global/BottomSheetSelect";
import { useReadingNavigation } from "@/components/reading/ReadingNavigationProvider";
import type { Dictionary, Locale } from "@/lang";
import { loadPresetQuestions, type PresetQuestion } from "@/lib/tarot/questions";
import { useReading } from "@/lib/tarot/useReading";
import { readingMessages } from "@/lib/tarot/messages";
import { speakerGuide } from "@/lib/tarot/styleStore";
import styles from "./CategoryAskBlock.module.css";

export interface CategoryAskBlockProps {
  dictionary: Dictionary;
  locale: Locale;
  categoryId: string;
  spreadId: string;
  categoryLabel: string;
  onReadingStarted: (active: boolean) => void;
  onPresetQuestions?: (questions: string[]) => void;
}

export default function CategoryAskBlock({ dictionary, locale, categoryId, spreadId, categoryLabel, onReadingStarted, onPresetQuestions }: CategoryAskBlockProps) {
  const flow = useReading(locale, categoryId, spreadId);
  const question = flow.draftQuestion;
  const setQuestion = flow.setDraftQuestion;
  const navigation = useReadingNavigation();
  const [presets, setPresets] = useState<PresetQuestion[]>([]);
  const [presetsLoading, setPresetsLoading] = useState(true);
  const [presetError, setPresetError] = useState(false);
  const [guideSheetOpen, setGuideSheetOpen] = useState(false);
  const text = readingMessages[locale];
  const selected = flow.speakers.find((speaker) => speaker.id === flow.speakerId);
  const speakerLabel = selected?.name ?? text.loading;
  const speakerIcon = GUIDE_ICON[selected ? speakerGuide(selected) ?? "analyst" : "analyst"];
  const readingStarted = !!flow.reading || flow.busy;
  const started = readingStarted || !!flow.question.trim();
  const hasProgress = started || !!flow.draftQuestion.trim();

  useEffect(() => { onReadingStarted(readingStarted); }, [onReadingStarted, readingStarted]);
  useLayoutEffect(() => navigation?.register({ started: hasProgress, reset: flow.reset }), [navigation, hasProgress, flow.reset]);
  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) setPresetsLoading(true);
    });
    loadPresetQuestions(locale, controller.signal).then((items) => {
      if (!controller.signal.aborted) {
        const nextPresets = items.slice(0, 3);
        setPresets(nextPresets);
        onPresetQuestions?.(nextPresets.map((item) => item.text));
        setPresetError(false);
        setPresetsLoading(false);
      }
    }).catch(() => {
      if (!controller.signal.aborted) {
        setPresetError(true);
        setPresetsLoading(false);
      }
    });
    return () => controller.abort();
  }, [locale, onPresetQuestions, spreadId]);

  const start = (value: string, clearField: boolean) => {
    const draft = flow.draftQuestion;
    const submit = () => {
      flow.setDraftQuestion(clearField ? "" : draft);
      void flow.submit(value);
    };
    if (started) navigation?.request(submit, "switch");
    else submit();
  };

  return <section id="category-top-block" className={styles.section} aria-label={dictionary.categoryPage.topBlock.askTitle}>
    <Image src="/images/backgrounds/pattern-categories-top-block-2.svg" alt="" width={1627} height={731} className={styles.pattern} aria-hidden />
    <div className={styles.content}>
      <div className={styles.headingRow}>
        <div>
          <h2 className={`font-bona-topblock-title ${styles.title}`}>{dictionary.categoryPage.topBlock.askTitle}</h2>
          <p className={`font-instrument-xs ${styles.description}`}>{dictionary.categoryPage.topBlock.askDescription}</p>
        </div>
        <div className={styles.triggerDesktop}>
          <TriggerButton dictionary={dictionary.categoryPage.topBlock.guides} options={flow.speakers.map((speaker) => ({ value: speaker.id, label: speaker.name, icon: GUIDE_ICON[speakerGuide(speaker) ?? "analyst"] }))} value={flow.speakerId} onChange={flow.setSpeakerId} disabled={flow.busy || !flow.speakers.length} />
        </div>
        <MainButton variant="default" size="small" className={styles.triggerMobile} icon={speakerIcon} aria-label={speakerLabel} onClick={() => setGuideSheetOpen(true)} disabled={flow.busy || !flow.speakers.length} muted>{speakerLabel}</MainButton>
      </div>
      <label className={`font-instrument-sm ${styles.label}`} htmlFor="category-question">{locale === "en" ? "Your question:" : locale === "ru" ? "Ваш вопрос:" : "Ваше питання:"}</label>
      <textarea id="category-question" className={`font-instrument-sm ${styles.input}`} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={dictionary.categoryPage.topBlock.placeholder} disabled={flow.busy} aria-invalid={!!flow.error} />
      <div className={styles.submitWrap}>
        <MainButton variant="gradient" size="small" icon="/icons/right-arrow.svg" onClick={() => start(question, true)} disabled={!question.trim() || flow.busy || !flow.speakerId} aria-busy={flow.busy}>{flow.busy ? text.loading : locale === "en" ? "Get My Reading" : locale === "ru" ? "Получить расклад" : "Отримати розклад"}</MainButton>
      </div>
      <p className={`font-instrument-xs ${styles.tryTitle}`}>{locale === "en" ? "Try a question" : locale === "ru" ? "Попробуйте вопрос" : "Спробуйте питання"}</p>
      <div className={styles.presets} aria-busy={presetsLoading} aria-label={presetsLoading ? text.loading : undefined}>
        {presetsLoading
          ? [0, 1, 2].map((index) => <div className={styles.presetPlaceholder} key={index} aria-hidden />)
          : presets.map((preset) => <button className={`font-instrument-xs ${styles.preset}`} key={preset.id} type="button" onClick={() => start(preset.text, false)} disabled={flow.busy || !flow.speakerId}><span className={styles.presetIcon} aria-hidden />{preset.text}</button>)}
      </div>
      {(flow.error || presetError) && <p className={`font-instrument-xs ${styles.error}`} role="alert">{flow.error || text.error}</p>}
      <span className={styles.category} aria-hidden>{categoryLabel}</span>
      <BottomSheetSelect
        open={guideSheetOpen}
        onClose={() => setGuideSheetOpen(false)}
        options={flow.speakers.map((speaker) => ({ value: speaker.id, label: speaker.name, icon: GUIDE_ICON[speakerGuide(speaker) ?? "analyst"], description: dictionary.categoryPage.topBlock.guideDescriptions[speakerGuide(speaker) ?? "analyst"] }))}
        selectedValue={flow.speakerId}
        onSelect={flow.setSpeakerId}
      />
    </div>
  </section>;
}
