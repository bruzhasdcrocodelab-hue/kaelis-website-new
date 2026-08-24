import type { Dictionary } from "@/lang";
import styles from "./TermsHeroSection.module.css";

export interface TermsHeroSectionProps {
  dictionary: Dictionary["termsOfUse"];
}

export default function TermsHeroSection({ dictionary }: TermsHeroSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.titleBlock}>
        <p className={`font-instrument-base-emphasized ${styles.eyebrow}`}>{dictionary.eyebrow}</p>
        <p className={`font-bona-terms-title ${styles.title}`}>{dictionary.title}</p>
      </div>
      <p className={`font-instrument-base ${styles.lastUpdated}`}>{dictionary.lastUpdated}</p>
    </section>
  );
}
