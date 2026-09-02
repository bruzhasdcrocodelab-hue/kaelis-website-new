"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  slug: string;
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
      slug: "love",
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
      slug: "yes-no",
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
      slug: "one-card",
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
      slug: "three-cards",
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
      slug: "work",
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
      slug: "family",
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
      slug: "money",
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
const FAN_CENTER_LEFT = 650;
const FAN_CENTER_TOP = 205;
const FAN_CENTER_INDEX = 3;
const DEAL_DURATION = 900;

interface FlippableCardProps {
  card: CardSpec;
  isHovered: boolean;
  isDealt: boolean;
  stackZIndex: number;
  hoverZIndex: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

function FlippableCard({
  card,
  isHovered,
  isDealt,
  stackZIndex,
  hoverZIndex,
  onHoverStart,
  onHoverEnd,
}: FlippableCardProps) {
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

  const cardCenterX = card.left + card.width / 2;
  const cardCenterY = card.top + card.height / 2;
  const dealOffsetX = FAN_CENTER_LEFT - cardCenterX;
  const dealOffsetY = FAN_CENTER_TOP - cardCenterY;

  return (
    <Link
      href={`/categories/${card.slug}`}
      className={styles.cardWrap}
      style={{
        left: card.left,
        top: card.top,
        width: card.width,
        height: card.height,
        zIndex: isDealt ? hoverZIndex : stackZIndex,
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <motion.div
        className={styles.card}
        initial={{
          x: dealOffsetX,
          y: dealOffsetY,
          rotate: 0,
        }}
        animate={{
          x: 0,
          rotate: card.rotate,
          y: isDealt && isHovered ? -CARD_LIFT : 0,
        }}
        transition={
          isDealt
            ? { type: "spring", stiffness: 300, damping: 24 }
            : { type: "spring", stiffness: 190, damping: 22 }
        }
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
    </Link>
  );
}

export default function CardsFan({ dictionary, hoveredIndex, onCardHoverChange }: CardsFanProps) {
  const cards = buildCards(dictionary);
  const [isDealt, setIsDealt] = useState(false);

  const dealOrder = [...cards.keys()].sort(
    (a, b) => Math.abs(a - FAN_CENTER_INDEX) - Math.abs(b - FAN_CENTER_INDEX),
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsDealt(true), DEAL_DURATION);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={styles.cardsFan}>
      <div className={styles.inner}>
        {cards.map((card, index) => {
          const dealRank = dealOrder.indexOf(index);
          return (
            <FlippableCard
              key={card.key}
              card={card}
              isHovered={hoveredIndex === index}
              isDealt={isDealt}
              stackZIndex={dealRank}
              hoverZIndex={hoveredIndex === index ? 10 : index}
              onHoverStart={() => onCardHoverChange(index)}
              onHoverEnd={() => onCardHoverChange(null)}
            />
          );
        })}
      </div>
      <MobileCardsFan
        dictionary={dictionary}
        hoveredIndex={hoveredIndex}
        onCardHoverChange={onCardHoverChange}
      />
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Mobile: two synchronised fans (back row + front row) mirroring the desktop
 * deal + hover-flip animation. Rendered alongside the desktop fan and toggled
 * by CSS at the 768px breakpoint.
 * ------------------------------------------------------------------------- */

const MOBILE_CARD_W = 121;
const MOBILE_CARD_H = 220;
const MOBILE_STAGE_W = 390;
const MOBILE_LIFT = 32;
const MOBILE_DEAL_DURATION = 900;

interface MobileCardSpec {
  key: string;
  slug?: string;
  srcBack: string;
  srcFront?: string;
  alt: string;
  /** card centre X within the 390px stage */
  cx: number;
  /** card centre Y within its row */
  cy: number;
  rotate: number;
}

function buildMobileRows(dictionary: Dictionary["cards"]): {
  back: MobileCardSpec[];
  front: MobileCardSpec[];
} {
  const back: MobileCardSpec[] = [
    {
      key: "love",
      slug: "love",
      srcBack: "/images/cards-turned/LoveTurned.png",
      srcFront: "/images/cards/Love.png",
      alt: dictionary.love,
      cx: 49.6,
      cy: 128.6,
      rotate: -5.42,
    },
    {
      key: "yesNo",
      slug: "yes-no",
      srcBack: "/images/cards-turned/YesNoTurned.png",
      srcFront: "/images/cards/YesNo.png",
      alt: dictionary.yesNo,
      cx: 146.3,
      cy: 116.3,
      rotate: -2,
    },
    {
      key: "oneCard",
      slug: "one-card",
      srcBack: "/images/cards-turned/OneCardTurned.png",
      srcFront: "/images/cards/OneCard.png",
      alt: dictionary.oneCard,
      cx: 254.3,
      cy: 112.3,
      rotate: 2,
    },
    {
      key: "threeCards",
      slug: "three-cards",
      srcBack: "/images/cards-turned/ThreeCardsTurned.png",
      srcFront: "/images/cards/ThreeCards.png",
      alt: dictionary.threeCards,
      cx: 359.9,
      cy: 117.9,
      rotate: 5.52,
    },
  ];

  const front: MobileCardSpec[] = [
    {
      key: "deck-8",
      srcBack: "/images/cards/default-card.png",
      alt: "",
      cx: -25.2,
      cy: 157.6,
      rotate: -10.67,
    },
    {
      key: "work",
      slug: "work",
      srcBack: "/images/cards-turned/WorkTurned.png",
      srcFront: "/images/cards/Work.png",
      alt: dictionary.work,
      cx: 83.3,
      cy: 127.3,
      rotate: -5.42,
    },
    {
      key: "family",
      slug: "family",
      srcBack: "/images/cards-turned/FamilyTurned.png",
      srcFront: "/images/cards/Family.png",
      alt: dictionary.family,
      cx: 194.3,
      cy: 110.2,
      rotate: 0.17,
    },
    {
      key: "money",
      slug: "money",
      srcBack: "/images/cards-turned/MoneyTurned.png",
      srcFront: "/images/cards/Money.png",
      alt: dictionary.money,
      cx: 325.05,
      cy: 115.96,
      rotate: 5.52,
    },
    {
      key: "deck-9",
      srcBack: "/images/cards/default-card.png",
      alt: "",
      cx: 456.4,
      cy: 134.3,
      rotate: 11.57,
    },
  ];

  return { back, front };
}

interface MobileFlippableCardProps {
  card: MobileCardSpec;
  rowCenterCx: number;
  isHovered: boolean;
  isDealt: boolean;
  zIndex: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

function MobileFlippableCard({
  card,
  rowCenterCx,
  isHovered,
  isDealt,
  zIndex,
  onHoverStart,
  onHoverEnd,
}: MobileFlippableCardProps) {
  const [showFront, setShowFront] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const flippable = Boolean(card.slug && card.srcFront);

  useEffect(() => {
    if (!flippable) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => setShowFront(isHovered),
      (FLIP_DURATION * 1000) / 2,
    );
    return () => clearTimeout(timeoutRef.current);
  }, [isHovered, flippable]);

  const left = card.cx - MOBILE_CARD_W / 2;
  const top = card.cy - MOBILE_CARD_H / 2;
  const dealOffsetX = rowCenterCx - card.cx;
  const dealOffsetY = -top;

  const inner = (
    <motion.div
      className={styles.mobileCard}
      initial={{ x: dealOffsetX, y: dealOffsetY, rotate: 0 }}
      animate={{
        x: 0,
        rotate: card.rotate,
        y: isDealt && isHovered && flippable ? -MOBILE_LIFT : 0,
      }}
      transition={
        isDealt
          ? { type: "spring", stiffness: 300, damping: 24 }
          : { type: "spring", stiffness: 190, damping: 22 }
      }
    >
      <motion.div
        className={styles.cardFace}
        animate={{ scaleX: !flippable || isHovered === showFront ? 1 : 0 }}
        transition={{ duration: FLIP_DURATION / 2, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className={styles.cardSideInner}>
          <Image
            src={showFront && card.srcFront ? card.srcFront : card.srcBack}
            alt={card.alt}
            fill
            sizes="121px"
          />
        </div>
      </motion.div>
    </motion.div>
  );

  const style = {
    left,
    top,
    width: MOBILE_CARD_W,
    height: MOBILE_CARD_H,
    zIndex,
  } as const;

  if (!flippable) {
    return (
      <div className={styles.mobileCardWrap} style={style} aria-hidden>
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/categories/${card.slug}`}
      className={styles.mobileCardWrap}
      style={style}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      {inner}
    </Link>
  );
}

function MobileCardsFan({ dictionary, hoveredIndex, onCardHoverChange }: CardsFanProps) {
  const { back, front } = buildMobileRows(dictionary);
  const [isDealt, setIsDealt] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsDealt(true), MOBILE_DEAL_DURATION);
    return () => clearTimeout(timeoutId);
  }, []);

  const rowCenterCx = MOBILE_STAGE_W / 2;

  const renderRow = (row: MobileCardSpec[], rowOffset: number) =>
    row.map((card, i) => {
      const globalIndex = rowOffset + i;
      const midpoint = (row.length - 1) / 2;
      const stackZ = row.length - Math.round(Math.abs(i - midpoint));
      const isHovered = hoveredIndex === globalIndex;
      return (
        <MobileFlippableCard
          key={card.key}
          card={card}
          rowCenterCx={rowCenterCx}
          isHovered={isHovered}
          isDealt={isDealt}
          zIndex={isHovered ? 100 : stackZ}
          onHoverStart={() => onCardHoverChange(globalIndex)}
          onHoverEnd={() => onCardHoverChange(null)}
        />
      );
    });

  return (
    <div className={styles.mobileFan}>
      <div className={styles.mobileBackRow}>{renderRow(back, 0)}</div>
      <div className={styles.mobileFrontRow}>{renderRow(front, back.length)}</div>
    </div>
  );
}
