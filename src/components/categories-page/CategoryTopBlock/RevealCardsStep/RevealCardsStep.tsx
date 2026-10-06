"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import MainButton from "@/components/global/MainButton";
import type { Dictionary, Locale } from "@/lang";
import { frameOverlayImage } from "@/lib/tarotDeck";
import { presentCards, type PresentedCard as TarotCard } from "@/lib/tarot/cardPresentation";
import type { Reading } from "@/lib/tarot/reading";
import { readingMessages } from "@/lib/tarot/messages";
import { cardReadingSections, interpretationSections } from "@/lib/tarot/readingSections";
import ReadingScroll from "./ReadingScroll";
import ReadingContent from "./ReadingContent";
import RevealSheet from "./RevealSheet";
import { revealMessages } from "./revealMessages";
import SpreadViewport, { type SpreadViewportHandle } from "./SpreadViewport";
import { readRevealMetrics, spreadGeometry, type Point, type RevealMetrics } from "./revealGeometry";
import styles from "./RevealCardsStep.module.css";

export interface RevealCardsStepProps {
  dictionary: Dictionary["categoryPage"]["topBlock"];
  locale: Locale;
  reading: Reading;
  error: string;
  onRetry: () => void;
  onStartOver: () => void;
}

type Phase = "preparing" | "dealing" | "flipping" | "focusing" | "ready";

function CardArt({ card, locale }: { card: TarotCard; locale: Locale }) {
  return <>
    <div className={styles.cardArtWindow} style={{ transform: card.reversed ? "rotate(180deg)" : undefined }}>
      <Image src={card.image} alt="" width={756} height={1228} loading="eager" sizes="(max-width: 768px) 45vw, 226px"
        className={styles.cardArtImage} style={card.art} />
    </div>
    <Image src={frameOverlayImage} alt="" fill sizes="(max-width: 768px) 45vw, 226px" className={styles.cardFrame} />
    {card.missingArt && <span className={styles.missingArt}>{readingMessages[locale].noArt}</span>}
  </>;
}

function RevealCard({ card, locale, isRevealed, isSelected, interactive, moreInfoLabel, metrics, reduced, onCardClick, onFlipComplete }: {
  card: TarotCard; locale: Locale; isRevealed: boolean; isSelected: boolean; interactive: boolean;
  moreInfoLabel: string; metrics: RevealMetrics; reduced: boolean;
  onCardClick: () => void; onFlipComplete: () => void;
}) {
  const angle = Math.abs(metrics.rotation) * Math.PI / 180;
  const nameRise = metrics.cardWidth * Math.sin(angle) - metrics.cardHeight * (1 - Math.cos(angle));
  const selectionTransition = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: metrics.stiffness, damping: metrics.damping };
  return <div className={styles.revealCardCol}>
    <motion.p lang={locale} className={`font-instrument-xs-emphasized ${styles.revealCardName}`}
      animate={{ opacity: isRevealed ? 1 : 0, y: isSelected ? -nameRise : 0 }}
      transition={selectionTransition}>{card.name[locale]}</motion.p>
    <motion.button type="button" className={styles.revealCard} aria-label={card.name[locale]}
      aria-pressed={isSelected} disabled={!interactive}
      animate={{ rotate: isSelected ? metrics.rotation : 0 }} transition={selectionTransition}
      onClick={event => { event.stopPropagation(); onCardClick(); }}>
      <motion.div className={styles.revealCardFace} initial={{ rotateY: 0 }}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: reduced ? 0 : metrics.flip, ease: metrics.ease }}
        onAnimationComplete={() => { if (isRevealed) onFlipComplete(); }}>
        <div className={styles.cardBack}><Image src="/images/cards/default-card.png" alt="" fill sizes="200px" /></div>
        <div className={styles.cardFront}>
          <CardArt card={card} locale={locale} />
          {!isSelected && <div className={styles.revealCardHoverOverlay}><p className="font-instrument-xs-emphasized">{moreInfoLabel}</p></div>}
        </div>
      </motion.div>
    </motion.button>
  </div>;
}

/** Keying the session prevents late callbacks or a previous selection leaking into a new reading. */
export default function RevealCardsStep(props: RevealCardsStepProps) {
  return <RevealSession key={props.reading.id} {...props} />;
}

function RevealSession({ dictionary, locale, reading, error, onRetry, onStartOver }: RevealCardsStepProps) {
  const cards = useMemo(() => presentCards(reading, locale), [reading, locale]);
  const text = readingMessages[locale];
  const labels = revealMessages[locale];
  const reduced = !!useReducedMotion();
  const areaRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const viewportApi = useRef<SpreadViewportHandle | null>(null);
  const [metrics, setMetrics] = useState<RevealMetrics | null>(null);
  const [origin, setOrigin] = useState<Point | null>(null);
  const [phase, setPhase] = useState<Phase>("preparing");
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sheet, setSheet] = useState<"card" | "answer" | null>(null);
  const landed = useRef(new Set<string>());
  const flipped = useRef(new Set<string>());
  const pointerStart = useRef<Point | null>(null);
  const selectedCard = cards.find(card => card.position === selectedPosition) ?? null;
  const cardSections = useMemo(() => cardReadingSections(
    reading.cards.find(card => card.position === selectedPosition)?.description,
    reading.reading?.cards.find(card => card.position === selectedPosition)?.text,
  ), [reading, selectedPosition]);
  const answerSections = useMemo(() => interpretationSections(reading.reading?.sections), [reading.reading]);
  const closeSheet = useCallback(() => { setSheet(null); setSelectedPosition(null); }, []);
  const geometry = useMemo(() => metrics ? spreadGeometry(cards, metrics) : null, [cards, metrics]);
  const isRevealed = phase === "flipping" || phase === "focusing" || phase === "ready";
  const onReady = useCallback((point: Point) => {
    setOrigin(previous => previous ?? point);
    setPhase(previous => previous === "preparing" ? "dealing" : previous);
  }, []);

  useLayoutEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const resize = () => { setIsMobile(media.matches); setSheet(null); setSelectedPosition(null); };
    const frame = requestAnimationFrame(() => { setMetrics(readRevealMetrics(areaRef.current!)); setIsMobile(media.matches); });
    media.addEventListener("change", resize);
    return () => { cancelAnimationFrame(frame); media.removeEventListener("change", resize); };
  }, []);

  // Focus only on the first real card; later selections leave the user's viewport intact.
  const firstPosition = cards[0]?.position;
  const firstX = geometry?.positions[0]?.x;
  const firstY = geometry?.positions[0]?.y;
  useEffect(() => {
    if (phase !== "focusing" || !metrics || firstX == null || firstY == null) return;
    return viewportApi.current?.focus({
      x: firstX + metrics.cardWidth / 2,
      y: firstY + metrics.labelHeight + metrics.gap + metrics.cardHeight / 2,
    }, reduced ? 0 : metrics.focus, () => {
      if (!window.matchMedia("(max-width: 768px)").matches) setSelectedPosition(firstPosition);
      setAnswerVisible(true);
      setPhase("ready");
    });
  }, [phase, metrics, firstPosition, firstX, firstY, reduced]);

  // Both desktop cards share one scroll anchor, including while only the answer is visible.
  /*
  useLayoutEffect(() => {
    const layer = detailRef.current, panel = areaRef.current?.closest<HTMLElement>('[data-reading-panel]');
    if (!layer || !panel || !answerVisible) return;
    let frame = 0;
    const position = () => {
      frame = 0;
      if (getComputedStyle(layer).position !== "absolute") return;
      const rect = panel.getBoundingClientRect();
      const style = getComputedStyle(layer);
      const offset = parseFloat(style.getPropertyValue("--reveal-detail-center-offset"));
      const inset = parseFloat(style.getPropertyValue("--reveal-detail-scroll-inset"));
      const base = (rect.height - layer.offsetHeight) / 2 + offset;
      const top = Math.min(rect.height - layer.offsetHeight - inset, Math.max(base, inset - rect.top));
      layer.style.setProperty("--detail-top", `${Math.max(inset, top)}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(position); };
    position();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule); observer.observe(panel); observer.observe(layer);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
    };
  }, [answerVisible, isMobile]);
  */

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape" && !window.matchMedia("(max-width: 768px)").matches) setSelectedPosition(null); };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, []);

  const select = (position: string) => {
    if (phase !== "ready") return;
    setSelectedPosition(previous => isMobile ? position : previous === position ? null : position);
    if (isMobile) setSheet("card");
  };
  const transition = { duration: reduced ? 0 : metrics?.detail ?? 0, ease: metrics?.ease };

  return <>
    <div ref={areaRef} className={styles.revealArea} data-reveal-phase={phase} aria-busy={phase !== "ready"}>
      {metrics && geometry ? <SpreadViewport width={geometry.width} height={geometry.height}
        locked={phase !== "ready"} apiRef={viewportApi} onReady={onReady}>
        {origin && cards.map((card, index) => {
          const point = geometry.positions[index];
          return <motion.div key={card.position} className={styles.positionedCard} data-card-position={card.position}
            style={{ left: point.x, top: point.y }}
            initial={{ x: origin.x - point.x - metrics.cardWidth / 2, y: origin.y - point.y }}
            animate={{ x: 0, y: 0 }}
            transition={{ duration: reduced ? 0 : metrics.deal, delay: reduced ? 0 : index * metrics.stagger, ease: metrics.ease }}
            onAnimationComplete={() => {
              landed.current.add(card.position);
              if (landed.current.size === cards.length) setPhase(previous => previous === "dealing" ? "flipping" : previous);
            }}>
            <RevealCard card={card} locale={locale} metrics={metrics} reduced={reduced}
              isRevealed={isRevealed} isSelected={selectedPosition === card.position} interactive={phase === "ready"}
              moreInfoLabel={dictionary.moreInfo} onCardClick={() => select(card.position)}
              onFlipComplete={() => {
                flipped.current.add(card.position);
                if (flipped.current.size === cards.length) setPhase(previous => previous === "flipping" ? "focusing" : previous);
              }} />
          </motion.div>;
        })}
      </SpreadViewport> : <div className={styles.spreadViewport} />}
      {error && <div className={styles.readingError} role="alert">{error} <button type="button" onClick={onRetry}>{text.retry}</button></div>}
    </div>
    {isMobile && <p className={styles.mobileHint}>{labels.chooseCard}</p>}
    {!isMobile && <div ref={detailRef} className={styles.detailLayer} data-reading-details>
      <div className={styles.detailSlot}>
        <AnimatePresence>
          {selectedCard && <motion.section key="selected-detail" className={styles.cardDetail} data-selected-detail
            initial={{ opacity: 0, y: "110%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "110%" }} transition={transition}
            tabIndex={0} aria-label={`${dictionary.closeCard}: ${selectedCard.name[locale]}`}
            onKeyDown={event => {
              if (event.target !== event.currentTarget) return;
              if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedPosition(null); }
            }}
            onPointerDown={event => { pointerStart.current = { x: event.clientX, y: event.clientY }; }}
            onClick={event => {
              // Scrolling long information must not accidentally dismiss the selected card.
              const start = pointerStart.current;
              if (!(event.target as HTMLElement).closest("button") && !window.getSelection()?.toString() &&
                (!start || Math.hypot(event.clientX - start.x, event.clientY - start.y) < 5)) setSelectedPosition(null);
              pointerStart.current = null;
            }}>
            <h2 className={styles.detailHeader}>{labels.cardDescription}</h2>
            <ReadingScroll key={selectedPosition}>
              <ReadingContent sections={cardSections} locale={locale} card={selectedCard.name[locale]} artwork={<CardArt card={selectedCard} locale={locale} />} />
            </ReadingScroll>
          </motion.section>}
        </AnimatePresence>
      </div>
      <div className={styles.detailSlot}>
        {answerVisible && <motion.section className={styles.cardDetail} data-ai-detail aria-label={dictionary.readingAnswer}
          initial={{ opacity: 0, y: "110%" }} animate={{ opacity: 1, y: 0 }} transition={transition}>
          <h2 className={styles.detailHeader}>{labels.interpretation}</h2>
          <ReadingScroll>
            <ReadingContent sections={answerSections} locale={locale} />
          </ReadingScroll>
        </motion.section>}
      </div>
    </div>}
    {!isMobile && <div className={styles.startOver}>
      <MainButton variant="gradient" size="small" icon="/icons/right-arrow.svg" onClick={onStartOver}>{dictionary.startOver}</MainButton>
    </div>}
    {isMobile && createPortal(<div className={`${styles.tokens} ${styles.mobileControls}`} data-reveal-controls>
      <MainButton variant="gradient" size="large" icon="/icons/sparkles.svg" className={styles.answerButton} disabled={phase !== "ready"}
        onClick={() => { setSelectedPosition(null); setSheet("answer"); }}>{labels.seeAnswer}</MainButton>
      <MainButton variant="default" size="large" icon="/icons/right-arrow.svg" muted onClick={onStartOver}>{labels.restart}</MainButton>
    </div>, document.body)}
    <RevealSheet open={isMobile && sheet !== null} onClose={closeSheet} locale={locale} transition={transition} card={sheet === "card"}
      title={sheet === "card" ? labels.cardDescription : labels.interpretation}>
      {sheet === "card" && selectedCard
        ? <ReadingContent key={selectedPosition} sections={cardSections} locale={locale} card={selectedCard.name[locale]} artwork={<CardArt card={selectedCard} locale={locale} />} />
        : <ReadingContent sections={answerSections} locale={locale} />}
    </RevealSheet>
  </>;
}
