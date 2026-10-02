"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import Image from "next/image";
import { easingDefinitionToFunction, interpolate, motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import type { Dictionary, Locale } from "@/lang";
import { readingMessages } from "@/lib/tarot/messages";
import { CYCLE_MS, fanTracks, loadingCards, progressTracks, textTracks, type Tracks } from "./loadingMotion";
import { mobileLoadingCards } from "./mobileLoadingMotion";
import { MOBILE_FAN_CONTAINER_WIDTH, MOBILE_FAN_CONTAINER_HEIGHT, MOBILE_CARD_TRUE_WIDTH, MOBILE_CARD_TRUE_HEIGHT } from "../cardFanMobile";
import styles from "./ChooseCardsStep.module.css";

const ASSETS = ["/images/cards/default-card.png", "/images/backgrounds/pattern-categories-top-block-2.svg"];

export interface ChooseCardsStepProps {
  dictionary: Dictionary["categoryPage"]["topBlock"];
  locale: Locale;
  categoryLabel: string;
  error: string;
  onRetry: () => void;
  onFirstCycleComplete: () => void;
}

// One shared clock drives every exported track, including text and progress.
// Sampling the original easing preserves the Figma spring and per-card offsets.
function useTracks(progress: MotionValue<number>, tracks: Tracks) {
  const sample = useMemo(() => {
    const readers = Object.fromEntries(Object.entries(tracks).map(([key, track]) => [key,
      interpolate(track.timing.times, track.values, { ease: track.timing.ease.map(easingDefinitionToFunction) }),
    ]));
    return (key: string, time: number, fallback: number) => readers[key]?.(time) ?? fallback;
  }, [tracks]);
  const transform = useTransform(progress, time => `translate(${sample("x", time, 0)}px, ${sample("y", time, 0)}px) rotate(${sample("rotate", time, 0)}deg) scale(${sample("scaleX", time, 1)}, ${sample("scaleY", time, 1)})`);
  const opacity = useTransform(progress, time => sample("opacity", time, 1));
  const width = useTransform(progress, time => sample("width", time, 4));
  return { transform, opacity, width };
}

function AnimatedLayer({ progress, tracks, className, children, left, top }: {
  progress: MotionValue<number>; tracks: Tracks; className: string; children: ReactNode; left?: number; top?: number;
}) {
  const { transform, opacity } = useTracks(progress, tracks);
  return <motion.div className={className} style={{ transform, opacity, left, top }}>{children}</motion.div>;
}

function Progress({ progress }: { progress: MotionValue<number> }) {
  const { width, opacity } = useTracks(progress, progressTracks);
  return <div className={styles.progress} aria-hidden><div className={styles.track} /><motion.div className={styles.fill} style={{ width, opacity }} /></div>;
}

export default function ChooseCardsStep({ dictionary, locale, categoryLabel, error, onRetry, onFirstCycleComplete }: ChooseCardsStepProps) {
  const progress = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const visibleProgress = useTransform(progress, time => reducedMotion ? 0.2656 : time);
  const startedAt = useRef<number | null>(null);
  const assetsReady = useRef(false);
  const firstCycleComplete = useRef(false);
  const text = readingMessages[locale];

  useEffect(() => {
    let cancelled = false;
    // Count a visible cycle, not time spent downloading its artwork.
    const images = ASSETS.map(src => new Promise<void>(resolve => {
      const image = new window.Image();
      image.onload = image.onerror = () => resolve();
      image.src = src;
      if (image.complete) resolve();
    }));
    void Promise.all(images).then(() => { if (!cancelled) assetsReady.current = true; });
    return () => { cancelled = true; };
  }, []);

  useAnimationFrame(time => {
    if (!assetsReady.current) return;
    startedAt.current ??= time;
    const elapsed = time - startedAt.current;
    progress.set((elapsed % CYCLE_MS) / CYCLE_MS);
    if (elapsed >= CYCLE_MS && !firstCycleComplete.current) {
      firstCycleComplete.current = true;
      onFirstCycleComplete();
    }
  });

  return (
    <div className={styles.loading} data-reading-loading lang={locale} aria-busy={!error}>
      <div className={styles.scene} data-loading-scene="desktop" aria-hidden>
        <div className={styles.fanPosition}>
          <AnimatedLayer progress={visibleProgress} tracks={fanTracks} className={styles.fan}>
            {loadingCards.map(card => (
              <AnimatedLayer key={card.id} progress={visibleProgress} tracks={card.tracks} className={styles.card} left={card.left} top={card.top}>
                <Image src={ASSETS[0]} alt="" width={98} height={175} unoptimized className={styles.cardImage} />
              </AnimatedLayer>
            ))}
          </AnimatedLayer>
        </div>
      </div>
      <div className={styles.mobileScene} data-loading-scene="mobile" aria-hidden
        style={{ width: MOBILE_FAN_CONTAINER_WIDTH, height: MOBILE_FAN_CONTAINER_HEIGHT }}>
        <AnimatedLayer progress={visibleProgress} tracks={fanTracks} className={styles.fan}>
          {mobileLoadingCards.map(card => (
            <AnimatedLayer key={card.id} progress={visibleProgress} tracks={card.tracks} className={styles.mobileCard} left={card.left} top={card.top}>
              <Image src={ASSETS[0]} alt="" width={MOBILE_CARD_TRUE_WIDTH} height={MOBILE_CARD_TRUE_HEIGHT}
                unoptimized className={styles.mobileCardImage} style={{ transform: card.flipY ? "scaleY(-1)" : undefined }} />
            </AnimatedLayer>
          ))}
        </AnimatedLayer>
      </div>
      <div className={styles.content}>
        <div className={styles.category}>
          <Image src="/icons/eye-gradient.svg" alt="" width={24} height={24} />
          <p className="font-instrument-xs">{dictionary.categoryPrefix} {categoryLabel}</p>
        </div>
        <div className={styles.messages} aria-hidden>
          {dictionary.loadingMessages.map((message, index) => (
            <AnimatedLayer key={index} progress={visibleProgress} tracks={textTracks[index]} className={styles.message}>
              <p className={`font-bona-topblock-title ${styles.title}`}>{message.title}</p>
              <p className={`font-instrument-xs ${styles.description}`}>{message.description}</p>
            </AnimatedLayer>
          ))}
        </div>
        <span className={styles.srOnly} role="status">{text.generating}</span>
        <Progress progress={visibleProgress} />
        {error && <div className={styles.error} role="alert">{error} <button type="button" onClick={onRetry}>{text.retry}</button></div>}
      </div>
    </div>
  );
}
