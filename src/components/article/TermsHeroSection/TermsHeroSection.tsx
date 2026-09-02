import type { Dictionary, Locale } from "@/lang";
import { htmlLang } from "@/lang";
import { withSoftHyphens } from "@/lib/hyphenate";
import styles from "./TermsHeroSection.module.css";

export interface TermsHeroSectionProps {
  dictionary: Dictionary["termsOfUse"];
  locale: Locale;
}

export default function TermsHeroSection({ dictionary, locale }: TermsHeroSectionProps) {
  const title = dictionary.title
    .split(/(\s+)/)
    .map((part) => (part.trim() ? withSoftHyphens(part) : part))
    .join("");

  return (
    <section className={styles.section}>
      <div className={styles.titleBlock}>
        <p className={`font-instrument-base-emphasized ${styles.eyebrow}`}>{dictionary.eyebrow}</p>
        <p className={`font-bona-terms-title ${styles.title}`} lang={htmlLang[locale]}>
          {title}
        </p>
      </div>
      <p className={`font-instrument-base ${styles.lastUpdated}`}>{dictionary.lastUpdated}</p>
    </section>
  );
}
