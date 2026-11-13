"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { easingDefinitionToFunction, interpolate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import type { Dictionary, Locale } from "@/lang";
import { readingMessages } from "@/lib/tarot/messages";
import { CYCLE_MS, fanTracks, loadingCards, progressTracks, textTracks, type Tracks } from "./loadingMotion";
import { mobileLoadingCards, mobileFanTracks, mobileTextTracks, mobileProgressTracks, MOBILE_CYCLE_MS, MOBILE_REST_PROGRESS, MOBILE_FAN_WIDTH, MOBILE_FAN_HEIGHT, MOBILE_CARD_WIDTH, MOBILE_CARD_HEIGHT } from "./mobileLoadingMotion";
import styles from "./ChooseCardsStep.module.css";

const ASSETS = ["/images/cards/default-card.png", "/images/backgrounds/pattern-categories-top-block-2.svg", "/images/reading-loading/mobile-mask.svg"];

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

function sampleTrack(tracks: Tracks, key: keyof Tracks, time: number, fallback: number): number {
  const track = tracks[key];
  if (!track) return fallback;
  return Number(interpolate(track.timing.times, track.values, { ease: track.timing.ease.map(easingDefinitionToFunction) })(time));
}

function StaticLayer({ time, tracks, className, children, left, top }: {
  time: number; tracks: Tracks; className: string; children: ReactNode; left?: number; top?: number;
}) {
  const transform = `translate(${sampleTrack(tracks, "x", time, 0)}px, ${sampleTrack(tracks, "y", time, 0)}px) rotate(${sampleTrack(tracks, "rotate", time, 0)}deg) scale(${sampleTrack(tracks, "scaleX", time, 1)}, ${sampleTrack(tracks, "scaleY", time, 1)})`;
  const opacity = sampleTrack(tracks, "opacity", time, 1);
  return <div className={className} style={{ transform, opacity, left, top }}>{children}</div>;
}

function Progress({ progress, tracks }: { progress: MotionValue<number>; tracks: Tracks }) {
  const { width, opacity } = useTracks(progress, tracks);
  return <div className={styles.progress} aria-hidden><div className={styles.track} /><motion.div className={styles.fill} style={{ width, opacity }} /></div>;
}

function StaticProgress({ time, tracks }: { time: number; tracks: Tracks }) {
  const width = sampleTrack(tracks, "width", time, 4);
  const opacity = sampleTrack(tracks, "opacity", time, 1);
  return <div className={styles.progress} aria-hidden><div className={styles.track} /><div className={styles.fill} style={{ width, opacity }} /></div>;
}

export default function ChooseCardsStep({ dictionary, locale, categoryLabel, error, onRetry, onFirstCycleComplete }: ChooseCardsStepProps) {
  const progress = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);
  const [inView, setInView] = useState(true);
  const reducedMotion = useReducedMotion();
  const visibleProgress = useTransform(progress, time => reducedMotion ? (isMobile ? MOBILE_REST_PROGRESS : 0.2656) : time);
  const rootRef = useRef<HTMLDivElement>(null);
  const lastFrame = useRef<number | null>(null);
  const completedCycles = useRef(0);
  const cycleDuration = useRef(CYCLE_MS);
  const [assetsReady, setAssetsReady] = useState(false);
  const firstCycleComplete = useRef(false);
  const text = readingMessages[locale];

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)");
    const update = () => {
      setIsMobile(query.matches);
      cycleDuration.current = query.matches ? MOBILE_CYCLE_MS : CYCLE_MS;
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    // Count a visible cycle, not time spent downloading its artwork.
    const images = ASSETS.filter((_, index) => index < 2 || window.matchMedia("(max-width: 768px)").matches).map(src => new Promise<void>(resolve => {
      const image = new window.Image();
      image.onload = image.onerror = () => resolve();
      image.src = src;
      if (image.complete) resolve();
    }));
    void Promise.all(images).then(() => { if (!cancelled) setAssetsReady(true); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting && entry.intersectionRect.width > 0 && entry.intersectionRect.height > 0);
    }, { rootMargin: "120px" });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!assetsReady || reducedMotion || !inView) {
      lastFrame.current = null;
      return;
    }
    let frame = 0;
    const tick = (time: number) => {
      lastFrame.current ??= time;
      completedCycles.current += (time - lastFrame.current) / cycleDuration.current;
      lastFrame.current = time;
      progress.set(completedCycles.current % 1);
      if (completedCycles.current >= 1 - 1e-9 && !firstCycleComplete.current) {
        firstCycleComplete.current = true;
        onFirstCycleComplete();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [assetsReady, inView, onFirstCycleComplete, progress, reducedMotion]);

  return (
    <div ref={rootRef} className={styles.loading} data-reading-loading lang={locale} aria-busy={!error}>
      {!isMobile && <div className={styles.scene} data-loading-scene="desktop" aria-hidden>
        <div className={styles.fanPosition}>
          {reducedMotion
            ? <StaticLayer time={0.2656} tracks={fanTracks} className={styles.fan}>
            {loadingCards.map(card => (
              <StaticLayer key={card.id} time={0.2656} tracks={card.tracks} className={styles.card} left={card.left} top={card.top}>
                <Image src={ASSETS[0]} alt="" width={98} height={175} unoptimized className={styles.cardImage} />
              </StaticLayer>
            ))}
            </StaticLayer>
            : <AnimatedLayer progress={visibleProgress} tracks={fanTracks} className={styles.fan}>
              {loadingCards.map(card => (
                <AnimatedLayer key={card.id} progress={visibleProgress} tracks={card.tracks} className={styles.card} left={card.left} top={card.top}>
                  <Image src={ASSETS[0]} alt="" width={98} height={175} unoptimized className={styles.cardImage} />
                </AnimatedLayer>
              ))}
            </AnimatedLayer>}
        </div>
      </div>}
      {isMobile && <div className={styles.mobileScene} data-loading-scene="mobile" aria-hidden>
        <div className={styles.mobileFanPosition} style={{ width: MOBILE_FAN_WIDTH, height: MOBILE_FAN_HEIGHT }}>
          {reducedMotion
            ? <StaticLayer time={MOBILE_REST_PROGRESS} tracks={mobileFanTracks} className={styles.fan}>
              {mobileLoadingCards.map(card => (
                <StaticLayer key={card.id} time={MOBILE_REST_PROGRESS} tracks={card.tracks} className={styles.mobileCard} left={card.left} top={card.top}>
                  <Image src={ASSETS[0]} alt="" width={MOBILE_CARD_WIDTH} height={MOBILE_CARD_HEIGHT}
                    unoptimized className={styles.mobileCardImage} />
                </StaticLayer>
              ))}
            </StaticLayer>
            : <AnimatedLayer progress={visibleProgress} tracks={mobileFanTracks} className={styles.fan}>
              {mobileLoadingCards.map(card => (
                <AnimatedLayer key={card.id} progress={visibleProgress} tracks={card.tracks} className={styles.mobileCard} left={card.left} top={card.top}>
                  <Image src={ASSETS[0]} alt="" width={MOBILE_CARD_WIDTH} height={MOBILE_CARD_HEIGHT}
                    unoptimized className={styles.mobileCardImage} />
                </AnimatedLayer>
              ))}
            </AnimatedLayer>}
        </div>
      </div>}
      <div className={styles.content}>
        <div className={styles.category}>
          <Image src="/icons/eye-gradient.svg" alt="" width={24} height={24} />
          <p className="font-instrument-xs">{dictionary.categoryPrefix} {categoryLabel}</p>
        </div>
        <div className={styles.messages} aria-hidden>
          {dictionary.loadingMessages.map((message, index) => (
            reducedMotion
              ? <StaticLayer key={index} time={isMobile ? MOBILE_REST_PROGRESS : 0.2656} tracks={(isMobile ? mobileTextTracks : textTracks)[index]} className={styles.message}>
                <p className={`font-bona-topblock-title ${styles.title}`}>{message.title}</p>
                <p className={`font-instrument-xs ${styles.description}`}>{message.description}</p>
              </StaticLayer>
              : <AnimatedLayer key={index} progress={visibleProgress} tracks={(isMobile ? mobileTextTracks : textTracks)[index]} className={styles.message}>
              <p className={`font-bona-topblock-title ${styles.title}`}>{message.title}</p>
              <p className={`font-instrument-xs ${styles.description}`}>{message.description}</p>
            </AnimatedLayer>
          ))}
        </div>
        <span className={styles.srOnly} role="status">{text.generating}</span>
        {reducedMotion
          ? <StaticProgress time={isMobile ? MOBILE_REST_PROGRESS : 0.2656} tracks={isMobile ? mobileProgressTracks : progressTracks} />
          : <Progress progress={visibleProgress} tracks={isMobile ? mobileProgressTracks : progressTracks} />}
        {error && <div className={styles.error} role="alert">{error} <button type="button" onClick={onRetry}>{text.retry}</button></div>}
      </div>
    </div>
  );
}
