"use client";

import { useId, useState } from "react";
import type { FaqItem } from "@/lib/faq/content";
import styles from "./FaqSection.module.css";

export interface FaqSectionProps {
  heading: string;
  items: FaqItem[];
  className?: string;
}

export default function FaqSection({ heading, items, className }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const idPrefix = useId();
  return <section className={`${styles.section} ${className ?? ""}`}>
    <h2 className={`font-bona-3xl ${styles.heading}`}>{heading}</h2>
    <div className={styles.items}>
      {items.map((item, index) => {
        const open = openIndex === index;
        const answerId = `${idPrefix}-${index}`;
        return <div key={item.question} className={styles.item} data-open={open || undefined}>
        <button
          type="button"
          className={`font-instrument-base-emphasized ${styles.question}`}
          aria-expanded={open}
          aria-controls={answerId}
          onClick={() => setOpenIndex(open ? null : index)}
        >
          <span>{item.question}</span>
          <span className={styles.icon} aria-hidden />
        </button>
        <div id={answerId} className={styles.answerWrap}>
          <p className={`font-instrument-base ${styles.answer}`}>{item.answer}</p>
        </div>
      </div>;
      })}
    </div>
  </section>;
}
