"use client";

import { useState } from "react";
import HeroSection from "@/components/main-page/HeroSection";
import CardsFan from "@/components/main-page/CardsFan";
import type { Dictionary, Locale } from "@/lang";
import { useCategories } from "@/components/categories/CatalogProvider";
import CatalogStatus from "@/components/categories/CatalogStatus";
import type { HomeCardSlug } from "@/lib/tarot/homeCards";

export interface HeroCardsSectionProps {
  locale: Locale;
  heroDictionary: Dictionary["hero"];
  cardsDictionary: Dictionary["cards"];
  selectedSlug: HomeCardSlug | null;
  onCardSelect: (slug: HomeCardSlug) => void;
  onEntranceComplete?: () => void;
}

export default function HeroCardsSection({ locale, heroDictionary, cardsDictionary, selectedSlug, onCardSelect, onEntranceComplete }: HeroCardsSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { state, retry } = useCategories();

  if (state.status !== "success" && !selectedSlug) {
    return <div style={{ minHeight: "60vh", display: "grid", placeContent: "center" }}>
      <CatalogStatus locale={locale} status={state.status} retry={retry} />
    </div>;
  }

  return (
    <>
      <HeroSection dictionary={heroDictionary} isCardHovered={hoveredIndex !== null} />
      <CardsFan
        dictionary={cardsDictionary}
        hoveredIndex={hoveredIndex}
        onCardHoverChange={setHoveredIndex}
        selectedSlug={selectedSlug}
        onCardSelect={onCardSelect}
        onEntranceComplete={onEntranceComplete}
      />
    </>
  );
}
