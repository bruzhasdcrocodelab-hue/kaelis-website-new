"use client";

import Image from "next/image";
import type { Dictionary } from "@/lang";
import { CARD_TRUE_HEIGHT, CARD_TRUE_WIDTH } from "./cardFan";
import styles from "./CategoryTopBlock.module.css";

export interface RevealCardsStepProps {
  dictionary: Dictionary["categoryPage"]["topBlock"];
  cardCount: number;
}

export default function RevealCardsStep({ dictionary, cardCount }: RevealCardsStepProps) {
  return (
    <div className={styles.revealArea}>
      <p className={`font-instrument-xxs-emphasized ${styles.revealLabel}`}>
        {dictionary.tapToReveal}
      </p>
      <div className={styles.revealRow}>
        {Array.from({ length: cardCount }, (_, index) => (
          <button
            key={index}
            type="button"
            className={styles.revealCard}
            style={{ width: CARD_TRUE_WIDTH, height: CARD_TRUE_HEIGHT }}
          >
            <Image src="/images/cards/default-card.png" alt="" fill sizes="200px" />
            {/* Пример лицевой стороны с картой-рыцарем: */}
            {/* <Image
              src="/images/cards/deck/knight-of-wands.png"
              alt=""
              width={756}
              height={1228}
              sizes="200px"
              className={styles.revealCardArt}
            />
            <Image
              src="/images/cards/default-card.png"
              alt=""
              fill
              sizes="200px"
              className={styles.revealCardFrame}
            /> */}
          </button>
        ))}
      </div>
    </div>
  );
}
