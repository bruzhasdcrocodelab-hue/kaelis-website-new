import type { FaqItem } from "@/lib/faq/content";
import styles from "./FaqSection.module.css";

export interface FaqSectionProps {
  heading: string;
  items: FaqItem[];
  className?: string;
}

export default function FaqSection({ heading, items, className }: FaqSectionProps) {
  return <section className={`${styles.section} ${className ?? ""}`}>
    <h2 className={`font-bona-3xl ${styles.heading}`}>{heading}</h2>
    <div className={styles.items}>
      {items.map((item) => <details key={item.question} className={styles.item}>
        <summary className={`font-instrument-base-emphasized ${styles.question}`}>
          <span>{item.question}</span>
          <span className={styles.icon} aria-hidden />
        </summary>
        <p className={`font-instrument-base ${styles.answer}`}>{item.answer}</p>
      </details>)}
    </div>
  </section>;
}
