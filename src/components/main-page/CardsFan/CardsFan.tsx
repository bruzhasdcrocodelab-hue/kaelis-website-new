"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { Dictionary } from "@/lang";
import styles from "./CardsFan.module.css";
import AnimatedCardFront from "./AnimatedCardFront";
import { getCardFrontAssets } from "./cardFrontAssets";
import type { HomeCardSlug } from "@/lib/tarot/homeCards";

export interface CardsFanProps {
  dictionary: Dictionary["cards"];
  hoveredIndex: number | null;
  onCardHoverChange: (index: number | null) => void;
  selectedSlug: HomeCardSlug | null;
  onCardSelect: (slug: HomeCardSlug) => void;
  onEntranceComplete?: () => void;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Viewport widths (px) that pin the two ends of the shared card-size ramp.
 * Between them the target card width scales linearly.
 */
const RAMP_MIN_VW = 390;
const RAMP_MAX_VW = 1440;
/**
 * Target card width (px) at each end of the ramp. The minimum matches the mobile
 * card (see MOBILE_CARD_W); the maximum is the desktop `.card` box at scale 1
 * (see CardsFan.module.css).
 */
const RAMP_MIN_CARD_W = 121;
const RAMP_MAX_CARD_W = 165;

/**
 * Target card width for a viewport width. Clamped at the top (never bigger than
 * the desktop reference) but *not* at the bottom: below RAMP_MIN_VW it keeps
 * shrinking with the viewport so narrow phones scale the fan down instead of
 * clipping it.
 */
function rampCardWidth(viewportWidth: number) {
  const t = (viewportWidth - RAMP_MIN_VW) / (RAMP_MAX_VW - RAMP_MIN_VW);
  return lerp(RAMP_MIN_CARD_W, RAMP_MAX_CARD_W, Math.min(1, t));
}

/**
 * Run `computeScale(viewportWidth)` on mount and on every resize. `active` gates
 * it so the inactive (hidden) fan just reports scale 1. Returns the scale plus a
 * ref for the element whose box the ResizeObserver watches (layout changes that
 * don't resize the window, e.g. the page border toggling at the breakpoint).
 */
function useFanScale(computeScale: (viewportWidth: number) => number, active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const subscribe = useCallback((update: () => void) => {
    const el = ref.current;
    if (!el || !active) return () => {};
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [active]);
  const scale = useSyncExternalStore(
    subscribe,
    () => active ? computeScale(window.innerWidth || ref.current?.clientWidth || 0) : 1,
    () => 1,
  );

  return { ref, scale };
}

function useMediaQuery(query: string) {
  const subscribe = useCallback((update: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

const MOBILE_QUERY = "(max-width: 768px)";
function useFanEntrance(count: number, active: boolean, onComplete?: () => void) {
  const completed = useRef(new Set<string>());
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (active && ready) onComplete?.();
  }, [active, ready, onComplete]);
  return (key: string) => {
    completed.current.add(key);
    if (completed.current.size === count) setReady(true);
  };
}

interface CardSpec {
  key: string;
  slug: HomeCardSlug;
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
const DEAL_DURATION = 900;
const DESKTOP_STAGE_W = 1300;
const DESKTOP_INNER_H = 410;
/** The desktop `.card` box width at scale 1 (see CardsFan.module.css). */
const DESKTOP_REF_CARD_W = RAMP_MAX_CARD_W;
/**
 * Visual width (px) of the desktop fan's outer (rotated) cards at scale 1,
 * centred within the DESKTOP_STAGE_W box. The fan is scaled to keep this within
 * the viewport (minus DESKTOP_FIT_MARGIN each side) so the outer cards are not
 * clipped — until the card would drop below DESKTOP_MIN_CARD_W, past which the
 * fan holds that size and the outer cards are allowed to spill off-screen.
 */
const DESKTOP_FAN_EXTENT = 1228;
const DESKTOP_FIT_MARGIN = 16;
/**
 * Floor for the desktop card width. Below the 768px breakpoint the mobile fan
 * takes over at ~137px cards; the desktop fan is allowed to bottom out smaller
 * than that near its own lower edge (769px) so its 7-card row still mostly fits.
 */
const DESKTOP_MIN_CARD_W = 110;

/**
 * Desktop fan scale: fit the fan within the viewport, but never smaller than
 * DESKTOP_MIN_CARD_W and never larger than scale 1.
 */
function desktopFanScale(viewportWidth: number) {
  const fitScale = (viewportWidth - DESKTOP_FIT_MARGIN * 2) / DESKTOP_FAN_EXTENT;
  return clamp(fitScale, DESKTOP_MIN_CARD_W / DESKTOP_REF_CARD_W, 1);
}

/**
 * Anchoring the TopBlock panel to the fan.
 *
 * `.inner` sits at the top of `.cardsFan` with `transform-origin: top center`,
 * so the fan's lowest card bottom is DESKTOP_FAN_BOTTOM * scale below the
 * container top. TopBlock is pulled up onto the fan by a fixed CSS
 * `margin-top: -DESKTOP_TOPBLOCK_MARGIN`. To make the panel cover the *same
 * fraction* of every card regardless of scale, the container height is
 *
 *   H = (DESKTOP_FAN_BOTTOM - DESKTOP_TOPBLOCK_OVERLAP) * scale + DESKTOP_TOPBLOCK_MARGIN
 *
 * which gives  overlap = fanBottom - (H - margin) = DESKTOP_TOPBLOCK_OVERLAP * scale.
 * The margin term cancels; it is kept only so H stays 420 (the old fixed height)
 * at scale 1.
 */
const DESKTOP_FAN_BOTTOM = 413;
const DESKTOP_TOPBLOCK_OVERLAP = 162;
const DESKTOP_TOPBLOCK_MARGIN = 169;

function desktopCardsFanHeight(scale: number) {
  return (DESKTOP_FAN_BOTTOM - DESKTOP_TOPBLOCK_OVERLAP) * scale + DESKTOP_TOPBLOCK_MARGIN;
}

interface FlippableCardProps {
  card: CardSpec;
  isHovered: boolean;
  isDealt: boolean;
  onEntranceComplete: () => void;
  zIndex: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

function FlippableCard({
  card,
  isHovered,
  isDealt,
  onEntranceComplete,
  zIndex,
  onHoverStart,
  onHoverEnd,
  isSelected,
  onSelect,
}: FlippableCardProps) {
  const frontAssets = getCardFrontAssets(card.slug);
  const [showFront, setShowFront] = useState(false);
  const [frontReady, setFrontReady] = useState(false);
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
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onSelect}
      aria-label={frontAssets ? card.alt : undefined}
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
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
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
        onAnimationComplete={onEntranceComplete}
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
          onAnimationStart={() => {
            if (frontAssets) setFrontReady(false);
          }}
          onAnimationComplete={(target) => {
            if (frontAssets && typeof target === "object" && "scaleX" in target) {
              setFrontReady(target.scaleX === 1 && showFront && isHovered);
            }
          }}
        >
          <div className={styles.cardSideInner}>
            <Image src={showFront && !frontAssets ? card.srcFront : card.srcBack} alt={card.alt} fill sizes="165px"
              style={{ visibility: showFront && frontAssets ? "hidden" : "visible" }} />
            {frontAssets && (
              <AnimatedCardFront visible={showFront} active={frontReady && isHovered} assets={frontAssets} />
            )}
          </div>
        </motion.div>
      </motion.div>
    </button>
  );
}

export default function CardsFan({ dictionary, hoveredIndex, onCardHoverChange, selectedSlug, onCardSelect, onEntranceComplete }: CardsFanProps) {
  const cards = buildCards(dictionary);
  const [isDealt, setIsDealt] = useState(false);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const completeCard = useFanEntrance(cards.length, !isMobile, onEntranceComplete);
  const { ref: fanRef, scale } = useFanScale(desktopFanScale, !isMobile);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsDealt(true), DEAL_DURATION);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      ref={fanRef}
      id="cards"
      className={styles.cardsFan}
      style={isMobile ? undefined : { height: desktopCardsFanHeight(scale) }}
    >
      <div
        className={styles.inner}
        style={{
          width: DESKTOP_STAGE_W,
          height: DESKTOP_INNER_H,
          transform: `scale(${scale})`,
        }}
      >
        {cards.map((card, index) => (
          <FlippableCard
            key={card.key}
            card={card}
            isHovered={selectedSlug === card.slug || hoveredIndex === index}
            isSelected={selectedSlug === card.slug}
            onSelect={() => { onCardHoverChange(null); onCardSelect(card.slug); }}
            isDealt={isDealt}
            onEntranceComplete={() => completeCard(card.key)}
            /* Overlap runs left → right: leftmost card sits lowest, rightmost highest. */
            zIndex={index}
            onHoverStart={() => onCardHoverChange(index)}
            onHoverEnd={() => onCardHoverChange(null)}
          />
        ))}
      </div>
      <MobileCardsFan
        onEntranceComplete={onEntranceComplete}
        dictionary={dictionary}
        hoveredIndex={hoveredIndex}
        onCardHoverChange={onCardHoverChange}
        selectedSlug={selectedSlug}
        onCardSelect={onCardSelect}
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
 * and the whole stage is scaled by CSS to the viewport (see mobileFanScale), so
 * the composition holds and the fan just shrinks on narrow screens.
 * ------------------------------------------------------------------------- */

/**
 * Design width of the mobile fan. At this viewport width the fan sits at scale 1
 * (card = MOBILE_CARD_W); wider screens grow it along the shared ramp up to the
 * 768px breakpoint, narrower screens scale the whole stage down with the
 * viewport.
 */
const MOBILE_STAGE_W = 390;
const MOBILE_STAGE_H = 360;
const MOBILE_CARD_W = RAMP_MIN_CARD_W;
const MOBILE_CARD_H = 220;
/** How far down the back row the front row starts (smaller → more overlap). */
const MOBILE_ROW_GAP = 126;
const MOBILE_LIFT = 32;
const MOBILE_DEAL_DURATION = 900;

/**
 * Mobile fan scale. At/above MOBILE_STAGE_W the card follows the shared ramp
 * (121px → ~137px up to the 768px breakpoint). Below MOBILE_STAGE_W the stage
 * tracks the viewport directly, so the fan shrinks with the screen (cards
 * smaller than 121px) instead of being clipped — the edge decks keep the same
 * proportional peek they have at 390px.
 */
function mobileFanScale(viewportWidth: number) {
  const rampScale = rampCardWidth(viewportWidth) / MOBILE_CARD_W;
  const fitScale = viewportWidth / MOBILE_STAGE_W;
  return Math.min(rampScale, fitScale);
}

/**
 * Anchoring the TopBlock panel to the mobile fan — same idea as the desktop
 * `desktopCardsFanHeight` (see there). The front row's lowest card bottom is
 * MOBILE_FRONT_BOTTOM * scale below the `.mobileFan` top; TopBlock is pulled up
 * by a fixed CSS `margin-top: -MOBILE_TOPBLOCK_MARGIN`. Setting
 *
 *   Hm = (MOBILE_FRONT_BOTTOM - MOBILE_TOPBLOCK_OVERLAP) * scale + MOBILE_TOPBLOCK_MARGIN
 *
 * makes the panel cover MOBILE_TOPBLOCK_OVERLAP * scale of every card (≈45% of
 * the Family card) at any width. The margin term cancels; it is kept so Hm stays
 * MOBILE_STAGE_H at scale 1.
 */
const MOBILE_FRONT_BOTTOM = 346;
const MOBILE_TOPBLOCK_OVERLAP = 100;
const MOBILE_TOPBLOCK_MARGIN = 114;

function mobileFanHeight(scale: number) {
  return (MOBILE_FRONT_BOTTOM - MOBILE_TOPBLOCK_OVERLAP) * scale + MOBILE_TOPBLOCK_MARGIN;
}

interface MobileCardSpec {
  key: string;
  slug?: HomeCardSlug;
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
  const cardBack = (
    key: string,
    slug: HomeCardSlug,
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

  // Back row: arc curving out toward the ends, tops dipping down at the edges.
  const back: MobileCardSpec[] = [
    cardBack("Love", "love", dictionary.love, -1.6, -5.5, 10),
    cardBack("YesNo", "yes-no", dictionary.yesNo, -0.55, -2, 4),
    cardBack("OneCard", "one-card", dictionary.oneCard, 0.55, 2, 4),
    cardBack("ThreeCards", "three-cards", dictionary.threeCards, 1.6, 5.5, 10),
  ];

  const frontCard = (
    key: string,
    slug: HomeCardSlug | undefined,
    src: string,
    alt: string,
    cxOffset: number,
    rotate: number,
    dy: number,
  ): MobileCardSpec => ({
    key,
    slug,
    srcBack: slug ? `/images/cards-turned/${src}Turned.png` : "/images/cards/default-card.png",
    srcFront: slug ? `/images/cards/${src}.png` : undefined,
    alt,
    cx: half + cxOffset,
    cy: MOBILE_CARD_H / 2 + dy,
    rotate,
  });

  // Front row: Work / Family / Money are centred and prominent; the two decks
  // (8, 9) sit further out so only a sliver peeks past each screen edge.
  const front: MobileCardSpec[] = [
    frontCard("deck-8", undefined, "", "", -217, -11.5, 23),
    frontCard("Work", "work", "Work", dictionary.work, -110, -5.5, 6),
    frontCard("Family", "family", "Family", dictionary.family, 0, 0, 0),
    frontCard("Money", "money", "Money", dictionary.money, 110, 5.5, 6),
    frontCard("deck-9", undefined, "", "", 217, 11.5, 23),
  ];

  return { back, front };
}

interface MobileFlippableCardProps {
  card: MobileCardSpec;
  rowCenterCx: number;
  isHovered: boolean;
  isDealt: boolean;
  onEntranceComplete: () => void;
  zIndex: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

function MobileFlippableCard({
  card,
  rowCenterCx,
  isHovered,
  isDealt,
  onEntranceComplete,
  zIndex,
  onHoverStart,
  onHoverEnd,
  isSelected,
  onSelect,
}: MobileFlippableCardProps) {
  const frontAssets = getCardFrontAssets(card.slug);
  const [showFront, setShowFront] = useState(false);
  const [frontReady, setFrontReady] = useState(false);
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
      onAnimationComplete={onEntranceComplete}
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
        onAnimationStart={() => {
          if (frontAssets) setFrontReady(false);
        }}
        onAnimationComplete={(target) => {
          if (frontAssets && typeof target === "object" && "scaleX" in target) {
            setFrontReady(target.scaleX === 1 && showFront && isHovered);
          }
        }}
      >
        <div className={styles.cardSideInner}>
          <Image
            src={showFront && !frontAssets && card.srcFront ? card.srcFront : card.srcBack}
            alt={card.alt}
            fill
            sizes="116px"
            style={{ visibility: showFront && frontAssets ? "hidden" : "visible" }}
          />
          {frontAssets && (
            <AnimatedCardFront visible={showFront} active={frontReady && isHovered} assets={frontAssets} />
          )}
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
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onSelect}
      className={styles.mobileCardWrap}
      aria-label={frontAssets ? card.alt : undefined}
      style={style}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
    >
      {inner}
    </button>
  );
}

function MobileCardsFan({ dictionary, hoveredIndex, onCardHoverChange, selectedSlug, onCardSelect, onEntranceComplete }: CardsFanProps) {
  const { back, front } = buildMobileRows(dictionary);
  const [isDealt, setIsDealt] = useState(false);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const completeCard = useFanEntrance(back.length + front.length, isMobile, onEntranceComplete);
  const { ref: fanRef, scale } = useFanScale(mobileFanScale, isMobile);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsDealt(true), MOBILE_DEAL_DURATION);
    return () => clearTimeout(timeoutId);
  }, []);

  const rowCenterCx = MOBILE_STAGE_W / 2;

  /**
   * Stacking runs left → right and never changes on hover/flip: within a row
   * the leftmost card sits lowest and the rightmost highest, and the whole
   * front row sits above the whole back row. A hovered card lifts + flips in
   * place at its own level, so it stays behind whatever overlaps it.
   */
  const renderRow = (row: MobileCardSpec[], rowOffset: number, rowBaseZ: number) =>
    row.map((card, i) => {
      const globalIndex = rowOffset + i;
      return (
        <MobileFlippableCard
          key={card.key}
          card={card}
          rowCenterCx={rowCenterCx}
          isHovered={selectedSlug === card.slug || hoveredIndex === globalIndex}
          isSelected={selectedSlug === card.slug}
          onSelect={() => { if (card.slug) { onCardHoverChange(null); onCardSelect(card.slug); } }}
          isDealt={isDealt}
          onEntranceComplete={() => completeCard(card.key)}
          zIndex={rowBaseZ + i}
          onHoverStart={() => onCardHoverChange(globalIndex)}
          onHoverEnd={() => onCardHoverChange(null)}
        />
      );
    });

  return (
    <div
      ref={fanRef}
      className={styles.mobileFan}
      style={{ height: mobileFanHeight(scale) }}
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
