"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import MainButton from "@/components/global/MainButton";
import type { Dictionary, Locale } from "@/lang";
import { frameOverlayImage, tarotDeck, type TarotCard } from "@/lib/tarotDeck";
import { CARD_TRUE_HEIGHT, CARD_TRUE_WIDTH } from "./cardFan";
import styles from "./CategoryTopBlock.module.css";

export interface RevealCardsStepProps {
  dictionary: Dictionary["categoryPage"]["topBlock"];
  locale: Locale;
  cardCount: number;
}

const FLIP_DURATION = 0.5;

function pickRandomCards(count: number): TarotCard[] {
  const shuffled = [...tarotDeck].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface RevealCardProps {
  card: TarotCard;
  locale: Locale;
  isRevealed: boolean;
}

function RevealCard({ card, locale, isRevealed }: RevealCardProps) {
  const [showFront, setShowFront] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => setShowFront(isRevealed),
      (FLIP_DURATION * 1000) / 2,
    );
    return () => clearTimeout(timeoutRef.current);
  }, [isRevealed]);

  return (
    <div className={styles.revealCardCol}>
      <p
        className={`font-instrument-xs-emphasized ${styles.revealCardName} ${isRevealed ? styles.revealCardNameVisible : ""}`}
      >
        {card.name[locale]}
      </p>
      <button
        type="button"
        className={styles.revealCard}
        style={{ width: CARD_TRUE_WIDTH, height: CARD_TRUE_HEIGHT }}
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
            </>
          ) : (
            <Image src="/images/cards/default-card.png" alt="" fill sizes="200px" />
          )}
        </motion.div>
      </button>
    </div>
  );
}

export default function RevealCardsStep({ dictionary, locale, cardCount }: RevealCardsStepProps) {
  const cards = useMemo(() => pickRandomCards(cardCount), [cardCount]);
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className={styles.revealArea}>
      <p
        className={`font-instrument-xxs-emphasized ${styles.revealLabel} ${isRevealed ? styles.revealLabelHidden : ""}`}
      >
        {dictionary.tapToReveal}
      </p>
      <div className={styles.revealRow} onClick={() => setIsRevealed(true)}>
        {cards.map((card) => (
          <RevealCard key={card.slug} card={card} locale={locale} isRevealed={isRevealed} />
        ))}
      </div>
      <div className={`${styles.answerWrap} ${isRevealed ? styles.answerWrapVisible : ""}`}>
        <MainButton variant="gradient" size="small">
          {dictionary.answerQuestion}
        </MainButton>
      </div>
    </div>
  );
}
