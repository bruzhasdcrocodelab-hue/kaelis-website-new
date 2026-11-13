"use client";

import { useState } from "react";
import HeroSection from "@/components/main-page/HeroSection";
import CardsFan from "@/components/main-page/CardsFan";
import type { Dictionary } from "@/lang";
import type { HomeCardSlug } from "@/lib/tarot/homeCards";

export interface HeroCardsSectionProps {
  heroDictionary: Dictionary["hero"];
  cardsDictionary: Dictionary["cards"];
  selectedSlug: HomeCardSlug | null;
  pendingSlug?: HomeCardSlug | null;
  onCardSelect: (slug: HomeCardSlug) => void;
}

export default function HeroCardsSection({ heroDictionary, cardsDictionary, selectedSlug, pendingSlug, onCardSelect }: HeroCardsSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      <HeroSection dictionary={heroDictionary} isCardHovered={hoveredIndex !== null} />
      <CardsFan
        dictionary={cardsDictionary}
        hoveredIndex={hoveredIndex}
        onCardHoverChange={setHoveredIndex}
        selectedSlug={selectedSlug}
        pendingSlug={pendingSlug}
        onCardSelect={onCardSelect}
      />
    </>
  );
}
