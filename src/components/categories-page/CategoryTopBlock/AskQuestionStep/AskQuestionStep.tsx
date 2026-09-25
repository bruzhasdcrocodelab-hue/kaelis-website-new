"use client";

import Image from "next/image";
import MainButton from "@/components/global/MainButton";
import type { Dictionary } from "@/lang";
import styles from "./AskQuestionStep.module.css";

export interface AskQuestionStepProps {
  dictionary: Dictionary["categoryPage"]["topBlock"];
  onContinue: () => void;
  question: string;
  onChange: (question: string) => void;
  disabled: boolean;
  loading: boolean;
  loadingLabel: string;
  error: string;
}

export default function AskQuestionStep({ dictionary, onContinue, question, onChange, disabled, loading, loadingLabel, error }: AskQuestionStepProps) {
  return (
    <div className={styles.inputArea}>
      <textarea
        className={`font-instrument-sm ${styles.inputBox}`}
        placeholder={dictionary.placeholder}
        rows={1}
        value={question}
        onChange={event => onChange(event.target.value)}
        disabled={loading}
        aria-label={dictionary.placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? "reading-question-error" : undefined}
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
          disabled={disabled || !question.trim()}
          aria-busy={loading}
        >
          {loading ? loadingLabel : dictionary.continue}
        </MainButton>
      </div>
      {error && <p id="reading-question-error" className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
