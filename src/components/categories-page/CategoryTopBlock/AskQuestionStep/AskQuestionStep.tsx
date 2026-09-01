"use client";

import Image from "next/image";
import MainButton from "@/components/global/MainButton";
import type { Dictionary } from "@/lang";
import styles from "./AskQuestionStep.module.css";

export interface AskQuestionStepProps {
  dictionary: Dictionary["categoryPage"]["topBlock"];
  onContinue: () => void;
}

export default function AskQuestionStep({ dictionary, onContinue }: AskQuestionStepProps) {
  return (
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
          onClick={onContinue}
        >
          {dictionary.continue}
        </MainButton>
      </div>
    </div>
  );
}
