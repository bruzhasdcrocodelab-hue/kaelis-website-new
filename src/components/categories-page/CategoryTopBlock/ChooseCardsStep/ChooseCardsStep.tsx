"use client";

import {
  cardFan,
  CARD_TRUE_HEIGHT,
  CARD_TRUE_WIDTH,
  FAN_CONTAINER_HEIGHT,
  FAN_CONTAINER_WIDTH,
} from "../cardFan";
import {
  cardFanMobile,
  MOBILE_CARD_TRUE_HEIGHT,
  MOBILE_CARD_TRUE_WIDTH,
  MOBILE_FAN_CONTAINER_HEIGHT,
  MOBILE_FAN_CONTAINER_WIDTH,
} from "../cardFanMobile";
import FanCard from "../FanCard/FanCard";
import styles from "./ChooseCardsStep.module.css";

export interface ChooseCardsStepProps {
  selectedIds: string[];
  maxSelectableCards: number;
  onToggleCard: (id: string) => void;
  isInteractive?: boolean;
}

export default function ChooseCardsStep({
  selectedIds,
  maxSelectableCards,
  onToggleCard,
  isInteractive = true,
}: ChooseCardsStepProps) {
  return (
    <>
      <div className={styles.fan}>
        {cardFan.map((card) => {
          const isSelected = selectedIds.includes(card.id);
          const selectionDisabled = !isSelected && selectedIds.length >= maxSelectableCards;
          return (
            <div
              key={card.id}
              className={styles.fanCardBox}
              style={{
                left: `${(card.left / FAN_CONTAINER_WIDTH) * 100}%`,
                top: `${(card.top / FAN_CONTAINER_HEIGHT) * 100}%`,
                width: `${(card.width / FAN_CONTAINER_WIDTH) * 100}%`,
                height: `${(card.height / FAN_CONTAINER_HEIGHT) * 100}%`,
                zIndex: isSelected ? cardFan.length + 1 : undefined,
              }}
            >
              <FanCard
                card={card}
                width={CARD_TRUE_WIDTH}
                height={CARD_TRUE_HEIGHT}
                isSelected={isSelected}
                isDisabled={selectionDisabled}
                isInteractive={isInteractive}
                onToggle={() => onToggleCard(card.id)}
              />
            </div>
          );
        })}
      </div>

      <div
        className={styles.fanMobile}
        style={{
          width: MOBILE_FAN_CONTAINER_WIDTH,
          height: MOBILE_FAN_CONTAINER_HEIGHT,
        }}
        aria-hidden={!isInteractive}
      >
        {cardFanMobile.map((card) => {
          const isSelected = selectedIds.includes(card.id);
          const selectionDisabled = !isSelected && selectedIds.length >= maxSelectableCards;
          return (
            <div
              key={card.id}
              className={styles.fanCardBox}
              style={{
                left: card.left,
                top: card.top,
                width: card.width,
                height: card.height,
                zIndex: isSelected ? cardFanMobile.length + 1 : undefined,
              }}
            >
              <FanCard
                card={card}
                width={MOBILE_CARD_TRUE_WIDTH}
                height={MOBILE_CARD_TRUE_HEIGHT}
                isSelected={isSelected}
                isDisabled={selectionDisabled}
                isInteractive={isInteractive}
                onToggle={() => onToggleCard(card.id)}
                flipY={card.flipY}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
