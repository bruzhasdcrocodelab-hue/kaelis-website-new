import type { Dictionary } from "@/lang";
import styles from "./TermsArticleCard.module.css";

export interface TermsArticleCardProps {
  dictionary: Dictionary["termsOfUse"];
}

export default function TermsArticleCard({ dictionary }: TermsArticleCardProps) {
  return (
    <div className={`shadow-medium ${styles.card}`}>
      <p className={`font-instrument-xs ${styles.marker}`}>{dictionary.headerMarker}</p>
      <div className={styles.sections}>
        {dictionary.sections.map((section, index) => (
          <div
            key={section.title}
            className={styles.section}
          >
            <div className={`font-bona-2xl ${styles.sectionHeader}`}>
              <p className={styles.sectionNumber}>{index + 1}.</p>
              <p className={styles.sectionTitle}>{section.title}</p>
            </div>
            <div className={styles.sectionBody}>
              <p className={`font-instrument-base ${styles.paragraph}`}>{section.body}</p>
              {section.note && (
                <p className={`font-instrument-base ${styles.note}`}>
                  <span className={styles.noteLabel}>{section.note.label}</span>
                  {section.note.text}
                </p>
              )}
              {section.contact && (
                <div className={styles.contactPlate}>
                  <p className={`font-instrument-base-emphasized ${styles.contactName}`}>
                    {section.contact.name}
                  </p>
                  <p className={`font-instrument-sm ${styles.contactLine}`}>
                    {section.contact.email}
                  </p>
                  <p className={`font-instrument-sm ${styles.contactLine}`}>
                    {section.contact.address}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
