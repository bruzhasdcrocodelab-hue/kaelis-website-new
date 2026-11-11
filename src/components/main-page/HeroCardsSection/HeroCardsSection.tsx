"use client";

import { useState } from "react";
import HeroSection from "@/components/main-page/HeroSection";
import CardsFan from "@/components/main-page/CardsFan";
import type { Dictionary, Locale } from "@/lang";
import { useCategories } from "@/components/categories/CatalogProvider";
import CatalogStatus from "@/components/categories/CatalogStatus";
import type { HomeCardSlug } from "@/lib/tarot/homeCards";
import styles from "./HeroCardsSection.module.css";

export interface HeroCardsSectionProps {
  locale: Locale;
  heroDictionary: Dictionary["hero"];
  cardsDictionary: Dictionary["cards"];
  selectedSlug: HomeCardSlug | null;
  pendingSlug?: HomeCardSlug | null;
  onCardSelect: (slug: HomeCardSlug) => void;
}

export default function HeroCardsSection({ locale, heroDictionary, cardsDictionary, selectedSlug, pendingSlug, onCardSelect }: HeroCardsSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { state, retry } = useCategories();

  return (
    <>
      <HeroSection dictionary={heroDictionary} isCardHovered={hoveredIndex !== null} />
      {state.status !== "success" && !selectedSlug ? <section id="cards" className={styles.pending}>
        <CatalogStatus locale={locale} status={state.status} retry={retry} />
      </section> : <CardsFan
        dictionary={cardsDictionary}
        hoveredIndex={hoveredIndex}
        onCardHoverChange={setHoveredIndex}
        selectedSlug={selectedSlug}
        pendingSlug={pendingSlug}
        onCardSelect={onCardSelect}
      />}
    </>
  );
}
