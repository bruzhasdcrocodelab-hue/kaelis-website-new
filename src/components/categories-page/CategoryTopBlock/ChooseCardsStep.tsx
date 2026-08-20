"use client";

import {
  cardFan,
  CARD_TRUE_HEIGHT,
  CARD_TRUE_WIDTH,
  FAN_CONTAINER_HEIGHT,
  FAN_CONTAINER_WIDTH,
} from "./cardFan";
import FanCard from "./FanCard";
import styles from "./CategoryTopBlock.module.css";

export interface ChooseCardsStepProps {
  selectedIds: string[];
  maxSelectableCards: number;
  onToggleCard: (id: string) => void;
}

export default function ChooseCardsStep({
  selectedIds,
  maxSelectableCards,
  onToggleCard,
}: ChooseCardsStepProps) {
  return (
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
              isInteractive
              onToggle={() => onToggleCard(card.id)}
            />
          </div>
        );
      })}
    </div>
  );
}
