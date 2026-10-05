"use client";

import { useId, useState, type ReactNode } from "react";
import type { Locale } from "@/lang";
import { adviceItems, type ReadingSection } from "@/lib/tarot/readingSections";
import { revealMessages } from "./revealMessages";
import styles from "./RevealCardsStep.module.css";

function SectionBody({ section }: { section: ReadingSection }) {
  const advice = section.key === "advice" ? adviceItems(section.text) : null;
  return advice ? <>
    {advice.intro && <p>{advice.intro}</p>}
    {advice.items.length > 0 && <ol className={styles.adviceList}>{advice.items.map((item, index) => <li key={index}>{item}</li>)}</ol>}
  </> : <p>{section.text}</p>;
}

function Section({ section, locale }: { section: ReadingSection; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const title = section.key ? revealMessages[locale][section.key] : section.title;
  const expandable = section.key === "why" || section.key === "risks";
  const inset = expandable || ["impact", "recognition", "focus"].includes(section.key ?? "");
  return <section className={`${styles.answerSection} ${inset ? styles.insetSection : ""}`} data-section={section.key ?? "text"}>
    {expandable ? <>
      <button type="button" className={styles.sectionToggle} aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}>
        <span>{title}</span><span className={styles.sectionToggleIcon}><span className={styles.chevronIcon} aria-hidden="true" /></span>
      </button>
      <div id={id} hidden={!open} className={styles.expandedSection}><SectionBody section={section} /></div>
    </> : <>{title && <h3 className={styles.answerTitle}>{title}</h3>}<SectionBody section={section} /></>}
  </section>;
}

export default function ReadingContent({ sections, locale, card, artwork }: {
  sections: ReadingSection[]; locale: Locale; card?: string; artwork?: ReactNode;
}) {
  const detailKeys = ["fullDescription", "impact", "recognition", "focus"];
  const details = card ? sections.filter(section => detailKeys.includes(section.key ?? "")) : [];
  const rest = card ? sections.filter(section => !detailKeys.includes(section.key ?? "")) : sections;
  return <>
    {card && <div className={styles.detailPreview}>
      <div className={styles.previewArtwork}>{artwork}</div>
      <p className={styles.detailLabel}>{card}</p>
    </div>}
    {rest.map((section, index) => <Section key={`${section.key}-${index}`} section={section} locale={locale} />)}
    {details.length > 0 && <div className={styles.fullDescription}>
      <h3 className={styles.answerTitle}>{revealMessages[locale].fullDescription}</h3>
      {details.map((section, index) => <Section key={`${section.key}-${index}`} section={section.key === "fullDescription" ? { ...section, key: null, title: "" } : section} locale={locale} />)}
    </div>}
  </>;
}
