import Image from "next/image";
import type { Dictionary } from "@/lang";
import styles from "./CardsFan.module.css";

export interface CardsFanProps {
  dictionary: Dictionary["cards"];
}

interface CardSpec {
  src: string;
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
      src: "/images/cards-turned/LoveTurned.png",
      alt: dictionary.love,
      left: 36,
      top: 71.24,
      width: 243.855,
      height: 334.643,
      rotate: -16.61,
    },
    {
      src: "/images/cards-turned/YesNoTurned.png",
      alt: dictionary.yesNo,
      left: 206.06,
      top: 38.95,
      width: 217.672,
      height: 325.355,
      rotate: -10.67,
    },
    {
      src: "/images/cards-turned/OneCardTurned.png",
      alt: dictionary.oneCard,
      left: 383.12,
      top: 20.31,
      width: 192.594,
      height: 314.242,
      rotate: -5.42,
    },
    {
      src: "/images/cards-turned/ThreeCardsTurned.png",
      alt: dictionary.threeCards,
      left: 563.51,
      top: 20.34,
      width: 165.87,
      height: 300.478,
      rotate: 0.17,
    },
    {
      src: "/images/cards-turned/WorkTurned.png",
      alt: dictionary.work,
      left: 715.93,
      top: 21.19,
      width: 193.089,
      height: 314.479,
      rotate: 5.52,
    },
    {
      src: "/images/cards-turned/FamilyTurned.png",
      alt: dictionary.family,
      left: 866.09,
      top: 38.81,
      width: 221.805,
      height: 326.993,
      rotate: 11.57,
    },
    {
      src: "/images/cards-turned/MoneyTurned.png",
      alt: dictionary.money,
      left: 1013.06,
      top: 76.43,
      width: 251.17,
      height: 336.721,
      rotate: 18.38,
    },
  ];
}

export default function CardsFan({ dictionary }: CardsFanProps) {
  const cards = buildCards(dictionary);

  return (
    <div className={styles.cardsFan}>
      <div className={styles.inner}>
        {cards.map((card) => (
          <div
            key={card.alt}
            className={styles.cardWrap}
            style={{
              left: card.left,
              top: card.top,
              width: card.width,
              height: card.height,
            }}
          >
            <div className={styles.card} style={{ transform: `rotate(${card.rotate}deg)` }}>
              <Image src={card.src} alt={card.alt} fill sizes="165px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
