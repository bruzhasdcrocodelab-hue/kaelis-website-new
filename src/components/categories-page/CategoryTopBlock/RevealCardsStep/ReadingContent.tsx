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

function Section({ section, locale, sectionId, openSections, onOpenChange }: { section: ReadingSection; locale: Locale; sectionId: string; openSections?: string[]; onOpenChange?: (id: string, open: boolean) => void }) {
  const [open, setOpen] = useState(openSections?.includes(sectionId) ?? false);
  const id = useId();
  const title = section.key ? revealMessages[locale][section.key] : section.title;
  const expandable = section.key === "why" || section.key === "risks";
  const inset = expandable || ["impact", "recognition", "focus"].includes(section.key ?? "");
  return <section className={`${styles.answerSection} ${inset ? styles.insetSection : ""}`} data-section={section.key ?? "text"}>
    {expandable ? <>
      <button type="button" className={styles.sectionToggle} aria-expanded={open} aria-controls={id} onClick={() => {
        const next = !open;
        setOpen(next);
        onOpenChange?.(sectionId, next);
      }}>
        <span>{title}</span><span className={styles.sectionToggleIcon}><span className={styles.chevronIcon} aria-hidden="true" /></span>
      </button>
      <div id={id} aria-hidden={!open} inert={!open} data-open={open} className={styles.sectionCollapse}>
        <div className={styles.sectionClip}><div className={styles.expandedSection}><SectionBody section={section} /></div></div>
      </div>
    </> : <>{title && <h3 className={styles.answerTitle}>{title}</h3>}<SectionBody section={section} /></>}
  </section>;
}

function AnswerSections({ sections, locale, openSections, onOpenChange }: { sections: ReadingSection[]; locale: Locale; openSections?: string[]; onOpenChange?: (id: string, open: boolean) => void }) {
  const expandable = (section: ReadingSection) => section.key === "why" || section.key === "risks";
  const groups: ReadingSection[][] = [];
  for (const section of sections) {
    const previous = groups.at(-1);
    if (expandable(section) && previous && expandable(previous[0])) previous.push(section);
    else groups.push([section]);
  }
  return groups.map((group, index) => expandable(group[0])
    ? <div key={index} className={styles.interpretationSections}>{group.map((section, item) => <Section key={item} section={section} locale={locale} sectionId={`answer:${section.key ?? item}`} openSections={openSections} onOpenChange={onOpenChange} />)}</div>
    : <Section key={index} section={group[0]} locale={locale} sectionId={`answer:${group[0].key ?? index}`} openSections={openSections} onOpenChange={onOpenChange} />);
}

export default function ReadingContent({ sections, locale, card, artwork, openSections, onOpenChange }: {
  sections: ReadingSection[]; locale: Locale; card?: string; artwork?: ReactNode; openSections?: string[]; onOpenChange?: (id: string, open: boolean) => void;
}) {
  const detailKeys = ["fullDescription", "impact", "recognition", "focus"];
  const details = card ? sections.filter(section => detailKeys.includes(section.key ?? "")) : [];
  const rest = card ? sections.filter(section => !detailKeys.includes(section.key ?? "")) : sections;
  const preview = card && <div className={styles.detailPreview}>
      <div className={styles.previewArtwork}>{artwork}</div>
      <p className={styles.detailLabel}>{card}</p>
    </div>;
  return <>
    {card ? <div className={styles.cardSummary}>
      {preview}
      {rest.map((section, index) => <Section key={`${section.key}-${index}`} section={section} locale={locale} sectionId={`card:${section.key ?? index}`} openSections={openSections} onOpenChange={onOpenChange} />)}
    </div> : <AnswerSections sections={rest} locale={locale} openSections={openSections} onOpenChange={onOpenChange} />}
    {details.length > 0 && <div className={styles.fullDescription}>
      <h3 className={styles.answerTitle}>{revealMessages[locale].fullDescription}</h3>
      <div className={styles.descriptionSections}>
        {details.map((section, index) => <Section key={`${section.key}-${index}`} section={section.key === "fullDescription" ? { ...section, key: null, title: "" } : section} locale={locale} sectionId={`card:${section.key ?? index}`} openSections={openSections} onOpenChange={onOpenChange} />)}
      </div>
    </div>}
  </>;
}
