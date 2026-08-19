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
  return (
    <section className={styles.section}>
      <div className={styles.panel}>
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
        <Image
          src="/images/backgrounds/waves.svg"
          alt=""
          width={1780}
          height={800}
          className={styles.waves}
          aria-hidden
        />
        <Image
          src="/images/backgrounds/pattern-categories-top-block.svg"
          alt=""
          width={1627}
          height={731}
          className={styles.pattern}
          aria-hidden
        />

        <div className={styles.row}>
          <div className={styles.side}>
            <MainButton variant="default" size="medium" icon="/icons/edit.svg" href="/">
              {dictionary.changeQuestion}
            </MainButton>
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
              <p className={`font-bona-topblock-title ${styles.askTitle}`}>{dictionary.askTitle}</p>
              <p className={`font-instrument-xs ${styles.askDescription}`}>{dictionary.askDescription}</p>
            </div>
          </div>

          <div className={styles.side}>
            <div className={styles.sideEnd}>
              <TriggerButton dictionary={dictionary.guides} />
            </div>
          </div>
        </div>

        <div className={styles.inputArea}>
          <div className={styles.inputBox}>
            <p className={`font-instrument-sm ${styles.placeholder}`}>{dictionary.placeholder}</p>
          </div>
          <Image
            src="/icons/main-star-gradient.svg"
            alt=""
            width={50}
            height={62}
            className={styles.inputStar}
            aria-hidden
          />
          <div className={styles.continueWrap}>
            <MainButton variant="gradient" size="small" icon="/icons/right-arrow.svg" href="/">
              {dictionary.continue}
            </MainButton>
          </div>
        </div>
      </div>
    </section>
  );
}
