"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { Dictionary } from "@/lang";
import styles from "./CardsFan.module.css";

export interface CardsFanProps {
  dictionary: Dictionary["cards"];
  hoveredIndex: number | null;
  onCardHoverChange: (index: number | null) => void;
}

interface CardSpec {
  key: string;
  srcBack: string;
  srcFront: string;
  alt: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
}

function buildCards(dictionary: Dictionary["cards"]): CardSpec[] {
  return [
    {
      key: "love",
      srcBack: "/images/cards-turned/LoveTurned.png",
      srcFront: "/images/cards/Love.png",
      alt: dictionary.love,
      left: 36,
      top: 71.24,
      width: 243.855,
      height: 334.643,
      rotate: -16.61,
    },
    {
      key: "yesNo",
      srcBack: "/images/cards-turned/YesNoTurned.png",
      srcFront: "/images/cards/YesNo.png",
      alt: dictionary.yesNo,
      left: 206.06,
      top: 38.95,
      width: 217.672,
      height: 325.355,
      rotate: -10.67,
    },
    {
      key: "oneCard",
      srcBack: "/images/cards-turned/OneCardTurned.png",
      srcFront: "/images/cards/OneCard.png",
      alt: dictionary.oneCard,
      left: 383.12,
      top: 20.31,
      width: 192.594,
      height: 314.242,
      rotate: -5.42,
    },
    {
      key: "threeCards",
      srcBack: "/images/cards-turned/ThreeCardsTurned.png",
      srcFront: "/images/cards/ThreeCards.png",
      alt: dictionary.threeCards,
      left: 563.51,
      top: 20.34,
      width: 165.87,
      height: 300.478,
      rotate: 0.17,
    },
    {
      key: "work",
      srcBack: "/images/cards-turned/WorkTurned.png",
      srcFront: "/images/cards/Work.png",
      alt: dictionary.work,
      left: 715.93,
      top: 21.19,
      width: 193.089,
      height: 314.479,
      rotate: 5.52,
    },
    {
      key: "family",
      srcBack: "/images/cards-turned/FamilyTurned.png",
      srcFront: "/images/cards/Family.png",
      alt: dictionary.family,
      left: 866.09,
      top: 38.81,
      width: 221.805,
      height: 326.993,
      rotate: 11.57,
    },
    {
      key: "money",
      srcBack: "/images/cards-turned/MoneyTurned.png",
      srcFront: "/images/cards/Money.png",
      alt: dictionary.money,
      left: 1013.06,
      top: 76.43,
      width: 251.17,
      height: 336.721,
      rotate: 18.38,
    },
  ];
}

const CARD_LIFT = 40;
const FLIP_DURATION = 0.5;

interface FlippableCardProps {
  card: CardSpec;
  isHovered: boolean;
  zIndex: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

function FlippableCard({ card, isHovered, zIndex, onHoverStart, onHoverEnd }: FlippableCardProps) {
  const [showFront, setShowFront] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => setShowFront(isHovered),
      (FLIP_DURATION * 1000) / 2,
    );
    return () => clearTimeout(timeoutRef.current);
  }, [isHovered]);

  return (
    <div
      className={styles.cardWrap}
      style={{
        left: card.left,
        top: card.top,
        width: card.width,
        height: card.height,
        zIndex,
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <motion.div
        className={styles.card}
        animate={{
          rotate: card.rotate,
          y: isHovered ? -CARD_LIFT : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <motion.div
          className={styles.cardFace}
          animate={{ scaleX: isHovered === showFront ? 1 : 0 }}
          transition={{ duration: FLIP_DURATION / 2, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className={styles.cardSideInner}>
            <Image src={showFront ? card.srcFront : card.srcBack} alt={card.alt} fill sizes="165px" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function CardsFan({ dictionary, hoveredIndex, onCardHoverChange }: CardsFanProps) {
  const cards = buildCards(dictionary);

  return (
    <div className={styles.cardsFan}>
      <div className={styles.inner}>
        {cards.map((card, index) => (
          <FlippableCard
            key={card.key}
            card={card}
            isHovered={hoveredIndex === index}
            zIndex={hoveredIndex === index ? 10 : index}
            onHoverStart={() => onCardHoverChange(index)}
            onHoverEnd={() => onCardHoverChange(null)}
          />
        ))}
      </div>
    </div>
  );
}
