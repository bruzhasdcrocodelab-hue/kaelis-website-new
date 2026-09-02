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
 *
 * The fan is laid out in a fixed design coordinate space (MOBILE_STAGE_W wide)
 * and the whole stage is scaled down by CSS on narrower screens, so cards are
 * never clipped by the viewport — the fan just shrinks.
 * ------------------------------------------------------------------------- */

const MOBILE_STAGE_W = 390;
const MOBILE_STAGE_H = 360;
const MOBILE_CARD_W = 121;
const MOBILE_CARD_H = 220;
const MOBILE_ROW_GAP = 116;
const MOBILE_LIFT = 32;
const MOBILE_DEAL_DURATION = 900;
/** Horizontal breathing room kept between the fan's outer cards and the screen edges. */
const MOBILE_STAGE_MARGIN = 12;

interface MobileCardSpec {
  key: string;
  slug?: string;
  srcBack: string;
  srcFront?: string;
  alt: string;
  /** card centre X within the MOBILE_STAGE_W design space */
  cx: number;
  /** card centre Y within its row's design space */
  cy: number;
  rotate: number;
}

function buildMobileRows(dictionary: Dictionary["cards"]): {
  back: MobileCardSpec[];
  front: MobileCardSpec[];
} {
  const half = MOBILE_STAGE_W / 2;
  const backPitch = 92;
  const frontPitch = 104;
  const cardBack = (
    key: string,
    slug: string,
    alt: string,
    slot: number,
    rotate: number,
    dy: number,
  ): MobileCardSpec => ({
    key,
    slug,
    srcBack: `/images/cards-turned/${key}Turned.png`,
    srcFront: `/images/cards/${key}.png`,
    alt,
    cx: half + slot * backPitch,
    cy: MOBILE_CARD_H / 2 + dy,
    rotate,
  });

  const back: MobileCardSpec[] = [
    cardBack("Love", "love", dictionary.love, -1.5, -8, 14),
    cardBack("YesNo", "yes-no", dictionary.yesNo, -0.5, -3, 3),
    cardBack("OneCard", "one-card", dictionary.oneCard, 0.5, 3, 3),
    cardBack("ThreeCards", "three-cards", dictionary.threeCards, 1.5, 8, 14),
  ];

  const frontCard = (
    key: string,
    slug: string | undefined,
    src: string,
    alt: string,
    slot: number,
    rotate: number,
    dy: number,
  ): MobileCardSpec => ({
    key,
    slug,
    srcBack: slug ? `/images/cards-turned/${src}Turned.png` : "/images/cards/default-card.png",
    srcFront: slug ? `/images/cards/${src}.png` : undefined,
    alt,
    cx: half + slot * frontPitch,
    cy: MOBILE_CARD_H / 2 + dy,
    rotate,
  });

  const front: MobileCardSpec[] = [
    frontCard("deck-8", undefined, "", "", -2, -13, 30),
    frontCard("Work", "work", "Work", dictionary.work, -1, -6, 8),
    frontCard("Family", "family", "Family", dictionary.family, 0, 0, 0),
    frontCard("Money", "money", "Money", dictionary.money, 1, 6, 8),
    frontCard("deck-9", undefined, "", "", 2, 13, 30),
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
            sizes="116px"
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
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
    >
      {inner}
    </Link>
  );
}

function MobileCardsFan({ dictionary, hoveredIndex, onCardHoverChange }: CardsFanProps) {
  const { back, front } = buildMobileRows(dictionary);
  const [isDealt, setIsDealt] = useState(false);
  const fanRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsDealt(true), MOBILE_DEAL_DURATION);
    return () => clearTimeout(timeoutId);
  }, []);

  // Scale the whole fan down to the available width so its outer cards are
  // never clipped by the screen — the fan shrinks instead.
  useEffect(() => {
    const el = fanRef.current;
    if (!el) return;
    const update = () => {
      const available = el.clientWidth - MOBILE_STAGE_MARGIN * 2;
      setScale(Math.min(1, Math.max(0, available) / MOBILE_STAGE_W));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const rowCenterCx = MOBILE_STAGE_W / 2;

  /**
   * Stacking is fixed and never changes on hover/flip: the centre card of each
   * row sits highest, the outer cards lowest, and the whole front row sits
   * above the whole back row. A hovered card lifts + flips in place at its own
   * level, so it stays behind whatever overlaps it in the fan.
   */
  const renderRow = (row: MobileCardSpec[], rowOffset: number, rowBaseZ: number) =>
    row.map((card, i) => {
      const globalIndex = rowOffset + i;
      const midpoint = (row.length - 1) / 2;
      const stackZ = rowBaseZ + (row.length - Math.round(Math.abs(i - midpoint)));
      return (
        <MobileFlippableCard
          key={card.key}
          card={card}
          rowCenterCx={rowCenterCx}
          isHovered={hoveredIndex === globalIndex}
          isDealt={isDealt}
          zIndex={stackZ}
          onHoverStart={() => onCardHoverChange(globalIndex)}
          onHoverEnd={() => onCardHoverChange(null)}
        />
      );
    });

  return (
    <div
      ref={fanRef}
      className={styles.mobileFan}
      style={{ height: MOBILE_STAGE_H * scale }}
    >
      <div
        className={styles.mobileFanStage}
        style={{
          width: MOBILE_STAGE_W,
          height: MOBILE_STAGE_H,
          transform: `scale(${scale})`,
        }}
      >
        <div className={styles.mobileBackRow}>{renderRow(back, 0, 0)}</div>
        <div
          className={styles.mobileFrontRow}
          style={{ marginTop: MOBILE_ROW_GAP - MOBILE_CARD_H }}
        >
          {renderRow(front, back.length, 10)}
        </div>
      </div>
    </div>
  );
}
