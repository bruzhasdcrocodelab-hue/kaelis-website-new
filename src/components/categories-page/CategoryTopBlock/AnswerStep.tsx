"use client";

import MainButton from "@/components/global/MainButton";
import type { Dictionary } from "@/lang";
import styles from "./CategoryTopBlock.module.css";

export interface AnswerStepProps {
  dictionary: Dictionary["categoryPage"]["topBlock"];
  answer: string;
  onStartOver: () => void;
}

export default function AnswerStep({ dictionary, answer, onStartOver }: AnswerStepProps) {
  return (
    <div className={styles.truthArea}>
      <p className={`font-instrument-sm ${styles.truthBox}`}>{answer}</p>
      <div className={styles.continueWrap}>
        <MainButton
          variant="gradient"
          size="small"
          icon="/icons/right-arrow.svg"
          onClick={onStartOver}
        >
          {dictionary.startOver}
        </MainButton>
      </div>
    </div>
  );
}
