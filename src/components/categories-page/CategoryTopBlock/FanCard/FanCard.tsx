"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { FanCardSpec } from "../cardFan";
import styles from "./FanCard.module.css";

/**
 * Push distance (px, along the card's radial fan direction) applied on hover
 * vs. on selection. Derived from comparing the fan's resting layout against
 * the pushed-card layouts in the Figma reference (node-id=1494-490 for hover,
 * 1464-3655 for the multi-select "Choose N Cards" state): every pushed card
 * moves purely along the radial line from the fan's pivot through its own
 * center (equivalent to translating along its own rotated local Y-axis),
 * and the selected push is ~2x the hover push.
 */
const HOVER_PUSH = 11;
const SELECTED_PUSH = 22;

export interface FanCardProps {
  card: FanCardSpec;
  width: number;
  height: number;
  isSelected: boolean;
  isDisabled: boolean;
  isInteractive: boolean;
  onToggle: () => void;
  /** Mirror the card vertically (mobile fan's front-facing center card). */
  flipY?: boolean;
}

export default function FanCard({
  card,
  width,
  height,
  isSelected,
  isDisabled,
  isInteractive,
  onToggle,
  flipY,
}: FanCardProps) {
  const rad = (card.rotate * Math.PI) / 180;
  const push = isSelected ? SELECTED_PUSH : HOVER_PUSH;
  const pushX = Math.sin(rad) * push;
  const pushY = -Math.cos(rad) * push;

  return (
    <motion.button
      type="button"
      className={styles.fanCard}
      style={{
        width,
        height,
        rotate: card.rotate,
        scaleY: flipY ? -1 : undefined,
      }}
      animate={{
        x: isSelected ? pushX : 0,
        y: isSelected ? pushY : 0,
        filter: isSelected ? "brightness(1.2) saturate(1)" : "brightness(1) saturate(1)",
      }}
      whileHover={
        isInteractive && !isSelected && !isDisabled
          ? { x: pushX, y: pushY }
          : undefined
      }
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      onClick={onToggle}
      disabled={!isInteractive || isDisabled}
      aria-pressed={isSelected}
      aria-label=""
      tabIndex={isInteractive ? 0 : -1}
    >
      <Image src="/images/cards/default-card.png" alt="" fill sizes="200px" />
    </motion.button>
  );
}
