"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import MainButton from "@/components/global/MainButton";
import type { Dictionary, Locale } from "@/lang";
import { frameOverlayImage } from "@/lib/tarotDeck";
import { presentCards, type PresentedCard as TarotCard } from "@/lib/tarot/cardPresentation";
import type { Reading } from "@/lib/tarot/reading";
import { readingMessages } from "@/lib/tarot/messages";
import SpreadViewport from "./SpreadViewport";
import { CARD_TRUE_HEIGHT, CARD_TRUE_WIDTH } from "../cardFan";
import styles from "./RevealCardsStep.module.css";

export interface RevealCardsStepProps {
  dictionary: Dictionary["categoryPage"]["topBlock"];
  locale: Locale;
  reading: Reading;
  error: string;
  onRetry: () => void;
  onAnswerQuestion: () => void;
  /** CategoryTopBlock's subtitle paragraph — the mobile detail sheet rises to meet its bottom edge. */
  mobileSheetTopRef?: RefObject<HTMLParagraphElement | null>;
}

const FLIP_DURATION = 0.5;
const SELECT_ROTATION = -8;
const DETAIL_TRANSITION = { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const };
const SELECT_ROTATION_RAD = (Math.abs(SELECT_ROTATION) * Math.PI) / 180;
/**
 * When the card rotates, its rotated bounding box grows taller than
 * CARD_TRUE_HEIGHT (see cardFan.ts for W/H), so the name — kept a fixed gap
 * above the card — has to rise by that same delta to hold the gap steady.
 */
const NAME_RISE =
  CARD_TRUE_WIDTH * Math.sin(SELECT_ROTATION_RAD) -
  CARD_TRUE_HEIGHT * (1 - Math.cos(SELECT_ROTATION_RAD));

const MOBILE_QUERY = "(max-width: 768px)";
const SHEET_BACKDROP_TRANSITION = { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const };
const SHEET_TRANSITION = { duration: 0.32, ease: [0.32, 0.72, 0, 1] as const };
const SHEET_DRAG_CLOSE_OFFSET = 90;
const SHEET_DRAG_CLOSE_VELOCITY = 500;

/** Tracks a media query, SSR-safe (starts false, corrects on mount). */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

interface RevealCardProps {
  card: TarotCard;
  locale: Locale;
  isRevealed: boolean;
  isSelected: boolean;
  moreInfoLabel: string;
  onCardClick: () => void;
}

function RevealCard({ card, locale, isRevealed, isSelected, moreInfoLabel, onCardClick }: RevealCardProps) {
  const [showFront, setShowFront] = useState(false);
  const [nameWrapped, setNameWrapped] = useState(false);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const cardName = card.name[locale];
  const isSingleWord = cardName.trim().split(/\s+/).length === 1;

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => setShowFront(isRevealed),
      (FLIP_DURATION * 1000) / 2,
    );
    return () => clearTimeout(timeoutRef.current);
  }, [isRevealed]);

  useLayoutEffect(() => {
    const el = nameRef.current;
    if (!el) return;

    const checkWrap = () => {
      const range = document.createRange();
      range.selectNodeContents(el);
      setNameWrapped(range.getClientRects().length > 1);
    };

    checkWrap();

    const observer = new ResizeObserver(checkWrap);
    observer.observe(el);
    return () => observer.disconnect();
  }, [card.name, locale, isRevealed]);

  return (
    <div className={`${styles.revealCardCol} ${nameWrapped ? styles.revealCardColWrapped : ""}`}>
      <motion.p
        ref={nameRef}
        lang={locale}
        className={`font-instrument-xs-emphasized ${styles.revealCardName} ${isRevealed ? styles.revealCardNameVisible : ""}`}
        style={isSingleWord ? { hyphens: "auto", WebkitHyphens: "auto", overflowWrap: "break-word" } : undefined}
        animate={{ y: isSelected ? -NAME_RISE + 6 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        {cardName}
      </motion.p>
      <motion.button
        type="button"
        className={styles.revealCard}
        aria-label={cardName}
        animate={{ rotate: isSelected ? SELECT_ROTATION : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(event) => {
          event.stopPropagation();
          onCardClick();
        }}
      >
        <motion.div
          className={styles.revealCardFace}
          animate={{ scaleX: isRevealed === showFront ? 1 : 0 }}
          transition={{ duration: FLIP_DURATION / 2, ease: [0.4, 0, 0.2, 1] }}
        >
          {showFront ? (
            <>
              <Image
                src={card.image}
                alt=""
                width={756}
                height={1228}
                sizes="200px"
                className={styles.revealCardArt}
                style={{
                  left: card.art.left,
                  top: card.art.top,
                  width: card.art.width,
                  height: card.art.height,
                  transform: card.reversed ? "rotate(180deg)" : undefined,
                }}
              />
              <Image
                src={frameOverlayImage}
                alt=""
                fill
                sizes="200px"
                className={styles.revealCardFrame}
              />
              {card.missingArt && <span className={styles.missingArt}>{readingMessages[locale].noArt}</span>}
              {!isSelected && (
                <div className={styles.revealCardHoverOverlay}>
                  <p className="font-instrument-xs-emphasized">{moreInfoLabel}</p>
                </div>
              )}
            </>
          ) : (
            <Image src="/images/cards/default-card.png" alt="" fill sizes="200px" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}

interface MobileCardDetailSheetProps {
  card: TarotCard | null;
  locale: Locale;
  description: string;
  onClose: () => void;
  /** Element the sheet's top edge should rise to meet the bottom of. */
  topRef?: RefObject<HTMLParagraphElement | null>;
}

function MobileCardDetailSheet({ card, locale, description, onClose, topRef }: MobileCardDetailSheetProps) {
  const [sheetHeight, setSheetHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!card) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    function updateSheetHeight() {
      const subtitleBottom = topRef?.current?.getBoundingClientRect().bottom;
      setSheetHeight(
        subtitleBottom != null ? Math.max(0, window.innerHeight - subtitleBottom) : null
      );
    }

    updateSheetHeight();
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updateSheetHeight);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updateSheetHeight);
    };
  }, [card, onClose, topRef]);

  function handleDragEnd(_event: unknown, info: PanInfo) {
    if (info.offset.y > SHEET_DRAG_CLOSE_OFFSET || info.velocity.y > SHEET_DRAG_CLOSE_VELOCITY) {
      onClose();
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {card && (
        <div className={styles.mobileSheetRoot}>
          <motion.div
            className={styles.mobileSheetBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={SHEET_BACKDROP_TRANSITION}
            onClick={onClose}
          />
          <motion.div
            className={`effect-blur ${styles.mobileSheet}`}
            role="dialog"
            aria-modal="true"
            aria-label={card.name[locale]}
            style={sheetHeight != null ? { height: sheetHeight } : undefined}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SHEET_TRANSITION}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.9 }}
            onDragEnd={handleDragEnd}
          >
            <div className={styles.mobileSheetGrabberRow}>
              <span className={styles.mobileSheetGrabber} />
            </div>
            <p className={`font-bona-3xl ${styles.mobileSheetTitle}`}>{card.name[locale]}</p>
            <span className={styles.mobileSheetDivider} />
            <p className={`font-instrument-sm ${styles.mobileSheetDescription}`}>{description}</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function RevealCardsStep({
  dictionary,
  locale,
  reading, error, onRetry,
  onAnswerQuestion,
  mobileSheetTopRef,
}: RevealCardsStepProps) {
  const cards = useMemo(() => presentCards(reading, locale), [reading, locale]);
  const text = readingMessages[locale];
  const width = Math.max(...cards.map(c => c.x)) * 140 + 160;
  const height = Math.max(...cards.map(c => c.y)) * 250 + 280;
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const revealAreaRef = useRef<HTMLDivElement>(null);
  const cardDetailArtRef = useRef<HTMLDivElement>(null);
  const cardDetailInfoRef = useRef<HTMLDivElement>(null);

  const selectedCard = cards.find((card) => card.slug === selectedSlug) ?? null;

  useEffect(() => {
    if (isMobile || !selectedCard) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        revealAreaRef.current?.contains(target) ||
        cardDetailArtRef.current?.contains(target) ||
        cardDetailInfoRef.current?.contains(target)
      ) {
        return;
      }
      setSelectedSlug(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isMobile, selectedCard]);

  const handleCardClick = (slug: string) => {
    if (!isRevealed) {
      setIsRevealed(true);
      return;
    }
    setSelectedSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <>
      <div ref={revealAreaRef} className={`${styles.revealArea} ${isRevealed ? 'bottom-[-10px]' : 'bottom-[-20px]'}`} onClick={() => setSelectedSlug(null)}>
        <p
          className={`font-instrument-xxs-emphasized ${styles.revealLabel} ${isRevealed ? styles.revealLabelHidden : ""}`}
        >
          {dictionary.tapToReveal}
        </p>
        <SpreadViewport width={width} height={height} locale={locale}>
          {cards.map((card) => (
            <div key={card.position} className={styles.positionedCard} style={{ left: card.x * 140 + 30, top: card.y * 250 + 30 }}>
            <RevealCard
              card={card}
              locale={locale}
              isRevealed={isRevealed}
              isSelected={selectedSlug === card.slug}
              moreInfoLabel={dictionary.moreInfo}
              onCardClick={() => handleCardClick(card.slug)}
            />
            </div>
          ))}
        </SpreadViewport>
        <div className={`${styles.answerWrap} ${isRevealed ? styles.answerWrapVisible : ""}`}>
          <MainButton variant="gradient" size="small" onClick={onAnswerQuestion} disabled={!reading.reading} aria-busy={!reading.reading && !error}>
            {reading.reading ? dictionary.answerQuestion : text.generating}
          </MainButton>
        </div>
        {error && <div className={styles.readingError} role="alert">{error} <button type="button" onClick={onRetry}>{text.retry}</button></div>}
      </div>
      <MobileCardDetailSheet
        card={isMobile ? selectedCard : null}
        locale={locale}
        description={selectedCard?.description || text.noDescription}
        onClose={() => setSelectedSlug(null)}
        topRef={mobileSheetTopRef}
      />
      <AnimatePresence>
        {!isMobile && selectedCard && (
          <motion.div
            key="art"
            ref={cardDetailArtRef}
            className={styles.cardDetailArt}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={DETAIL_TRANSITION}
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedCard.image}
              alt=""
              width={756}
              height={1228}
              sizes="226px"
              className={styles.cardDetailArtImage}
              style={{
                left: selectedCard.art.left,
                top: selectedCard.art.top,
                width: selectedCard.art.width,
                height: selectedCard.art.height,
                transform: selectedCard.reversed ? "rotate(180deg)" : undefined,
              }}
            />
            <Image
              src={frameOverlayImage}
              alt=""
              fill
              sizes="226px"
              className={styles.cardDetailArtFrame}
            />
            <p
              className={`font-instrument-base ${styles.cardDetailArtLabel}`}
              style={{
                backdropFilter: "blur(12.5px)",
                WebkitBackdropFilter: "blur(12.5px)",
              }}
            >
              {selectedCard.name[locale]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!isMobile && selectedCard && (
          <motion.div
            key="info"
            ref={cardDetailInfoRef}
            className={styles.cardDetailInfo}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={DETAIL_TRANSITION}
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src="/images/cards/default-card.png"
              alt=""
              fill
              sizes="226px"
              className={styles.cardDetailInfoBg}
            />
            <p
              className={`font-instrument-sm ${styles.cardDetailInfoText}`}
              style={{
                backdropFilter: "blur(12.5px)",
                WebkitBackdropFilter: "blur(12.5px)",
              }}
            >
              {selectedCard.description || text.noDescription}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
