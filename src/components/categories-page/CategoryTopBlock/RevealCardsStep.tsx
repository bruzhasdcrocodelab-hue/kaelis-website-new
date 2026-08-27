"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import MainButton from "@/components/global/MainButton";
import type { Dictionary, Locale } from "@/lang";
import { frameOverlayImage, tarotDeck, type TarotCard } from "@/lib/tarotDeck";
import { CARD_TRUE_HEIGHT, CARD_TRUE_WIDTH } from "./cardFan";
import styles from "./CategoryTopBlock.module.css";

export interface RevealCardsStepProps {
  dictionary: Dictionary["categoryPage"]["topBlock"];
  locale: Locale;
  cardCount: number;
  onAnswerQuestion: () => void;
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

function pickRandomCards(count: number): TarotCard[] {
  const shuffled = [...tarotDeck].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
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
        className={`font-instrument-xs-emphasized ${styles.revealCardName} ${isRevealed ? styles.revealCardNameVisible : ""}`}
        animate={{ y: isSelected ? -NAME_RISE + 6 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        {card.name[locale]}
      </motion.p>
      <motion.button
        type="button"
        className={styles.revealCard}
        style={{ width: CARD_TRUE_WIDTH, height: CARD_TRUE_HEIGHT }}
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
                }}
              />
              <Image
                src={frameOverlayImage}
                alt=""
                fill
                sizes="200px"
                className={styles.revealCardFrame}
              />
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

export default function RevealCardsStep({
  dictionary,
  locale,
  cardCount,
  onAnswerQuestion,
}: RevealCardsStepProps) {
  const cards = useMemo(() => pickRandomCards(cardCount), [cardCount]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const selectedCard = cards.find((card) => card.slug === selectedSlug) ?? null;

  const handleCardClick = (slug: string) => {
    if (!isRevealed) {
      setIsRevealed(true);
      return;
    }
    setSelectedSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <>
      <div className={`${styles.revealArea} ${isRevealed ? 'bottom-[-10px]' : 'bottom-[-20px]'}`} onClick={() => setSelectedSlug(null)}>
        <p
          className={`font-instrument-xxs-emphasized ${styles.revealLabel} ${isRevealed ? styles.revealLabelHidden : ""}`}
        >
          {dictionary.tapToReveal}
        </p>
        <div className={styles.revealRow}>
          {cards.map((card) => (
            <RevealCard
              key={card.slug}
              card={card}
              locale={locale}
              isRevealed={isRevealed}
              isSelected={selectedSlug === card.slug}
              moreInfoLabel={dictionary.moreInfo}
              onCardClick={() => handleCardClick(card.slug)}
            />
          ))}
        </div>
        <div className={`${styles.answerWrap} ${isRevealed ? styles.answerWrapVisible : ""}`}>
          <MainButton variant="gradient" size="small" onClick={onAnswerQuestion}>
            {dictionary.answerQuestion}
          </MainButton>
        </div>
      </div>
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            key="art"
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
        {selectedCard && (
          <motion.div
            key="info"
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
              {dictionary.cardDescription}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
