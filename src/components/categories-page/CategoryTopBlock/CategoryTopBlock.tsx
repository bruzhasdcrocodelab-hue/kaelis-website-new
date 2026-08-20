"use client";

import { useState } from "react";
import Image from "next/image";
import MainButton from "@/components/global/MainButton";
import TriggerButton from "@/components/categories-page/TriggerButton";
import type { Dictionary } from "@/lang";
import {
  cardFan,
  CARD_TRUE_HEIGHT,
  CARD_TRUE_WIDTH,
  FAN_CONTAINER_HEIGHT,
  FAN_CONTAINER_WIDTH,
} from "./cardFan";
import styles from "./CategoryTopBlock.module.css";

export interface CategoryTopBlockProps {
  dictionary: Dictionary["categoryPage"]["topBlock"];
  /** Always the top-level category name, even when viewing a nested subcategory. */
  categoryLabel: string;
}

export default function CategoryTopBlock({ dictionary, categoryLabel }: CategoryTopBlockProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <section className={styles.section}>
      <div className={`${styles.panel} ${isConfirmed ? styles.panelConfirmed : ""}`}>
        {isConfirmed && (
          <Image
            src="/images/backgrounds/pattern-categories-top-block.svg"
            alt=""
            width={1627}
            height={731}
            className={`${styles.pattern} ${styles.patternBehind}`}
            aria-hidden
          />
        )}
        <div className={styles.fan} aria-hidden>
          {cardFan.map((card) => (
            <div
              key={card.id}
              className={styles.fanCardBox}
              style={{
                left: `${(card.left / FAN_CONTAINER_WIDTH) * 100}%`,
                top: `${(card.top / FAN_CONTAINER_HEIGHT) * 100}%`,
                width: `${(card.width / FAN_CONTAINER_WIDTH) * 100}%`,
                height: `${(card.height / FAN_CONTAINER_HEIGHT) * 100}%`,
              }}
            >
              <div
                className={styles.fanCard}
                style={{
                  width: CARD_TRUE_WIDTH,
                  height: CARD_TRUE_HEIGHT,
                  transform: `rotate(${card.rotate}deg)`,
                }}
              >
                <Image src="/images/cards/default-card.png" alt="" fill sizes="200px" />
              </div>
            </div>
          ))}
        </div>
        {!isConfirmed && <div className={styles.fadeOverlay} aria-hidden />}
        <Image
          src={isConfirmed ? "/images/backgrounds/waves-3.svg" : "/images/backgrounds/waves.svg"}
          alt=""
          width={1780}
          height={800}
          className={styles.waves}
          aria-hidden
          style={{zIndex: 3}}
        />
        {!isConfirmed ? (
          <Image
            src="/images/backgrounds/pattern-categories-top-block.svg"
            alt=""
            width={1627}
            height={731}
            className={styles.pattern}
            aria-hidden
          />
        ):(
          <Image
            src="/images/backgrounds/gradient-line-waves.svg"
            alt=""
            width={1285}
            height={400}
            className={styles.wavesLine}
            aria-hidden
            style={{zIndex: -2}}
          />
        )}

        <div className={styles.row}>
          <div className={styles.side}>
            {isConfirmed && (
              <MainButton
                variant="default"
                size="medium"
                muted
                icon="/icons/edit.svg"
                onClick={() => setIsConfirmed(false)}
              >
                {dictionary.changeQuestion}
              </MainButton>
            )}
          </div>

          <div className={styles.center}>
            <div className={styles.categoryTag}>
              <Image
                src="/icons/eye-gradient.svg"
                alt=""
                width={24}
                height={24}
                className={styles.eyeIcon}
                aria-hidden
              />
              <p className={`font-instrument-xs ${styles.categoryTagLabel}`}>
                {dictionary.categoryPrefix} {categoryLabel}
              </p>
            </div>
            <div className={styles.askBlock}>
              <p className={`font-bona-topblock-title ${styles.askTitle}`}>
                {isConfirmed ? dictionary.chooseTitle : dictionary.askTitle}
              </p>
              <p className={`font-instrument-xs ${styles.askDescription}`}>
                {isConfirmed ? dictionary.chooseDescription : dictionary.askDescription}
              </p>
            </div>
          </div>

          <div className={styles.side}>
            <div className={styles.sideEnd}>
              <TriggerButton dictionary={dictionary.guides} />
            </div>
          </div>
        </div>

        {!isConfirmed && (
          <div className={styles.inputArea}>
            <textarea
              className={`font-instrument-sm ${styles.inputBox}`}
              placeholder={dictionary.placeholder}
              rows={1}
            />
            <Image
              src="/icons/main-star-gradient.svg"
              alt=""
              width={50}
              height={62}
              className={styles.inputStar}
              aria-hidden
            />
            <div className={styles.continueWrap}>
              <MainButton
                variant="gradient"
                size="small"
                icon="/icons/right-arrow.svg"
                onClick={() => setIsConfirmed(true)}
              >
                {dictionary.continue}
              </MainButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
