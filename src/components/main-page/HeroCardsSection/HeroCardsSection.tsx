"use client";

import { useState } from "react";
import HeroSection from "@/components/main-page/HeroSection";
import CardsFan from "@/components/main-page/CardsFan";
import type { Dictionary } from "@/lang";

export interface HeroCardsSectionProps {
  heroDictionary: Dictionary["hero"];
  cardsDictionary: Dictionary["cards"];
}

export default function HeroCardsSection({ heroDictionary, cardsDictionary }: HeroCardsSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      <HeroSection dictionary={heroDictionary} isCardHovered={hoveredIndex !== null} />
      <CardsFan
        dictionary={cardsDictionary}
        hoveredIndex={hoveredIndex}
        onCardHoverChange={setHoveredIndex}
      />
    </>
  );
}
