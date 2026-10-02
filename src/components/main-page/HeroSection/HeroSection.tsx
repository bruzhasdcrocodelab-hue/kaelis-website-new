import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import MainButton from "@/components/global/MainButton";
import type { Dictionary } from "@/lang";
import styles from "./HeroSection.module.css";

export interface HeroSectionProps {
  dictionary: Dictionary["hero"];
  isCardHovered?: boolean;
}

const CTA_LAYOUT_TRANSITION = { type: "spring", stiffness: 350, damping: 32 } as const;

/**
 * CTA content swap. `AnimatePresence mode="wait"` holds the incoming content
 * until the outgoing one has fully faded out, so the two never overlap. The
 * label *and* the arrow icon live in the same animated node, so the hover
 * state ("Get Your Readings" + arrow) appears and disappears as one unit —
 * there's no in-between frame with the idle label next to the arrow. The
 * button width is animated by the `layout` wrappers.
 */
const CTA_LABEL_TRANSITION = { duration: 0, ease: [0.4, 0, 0.2, 1] } as const;

/** Arrow shown next to the hover label, recoloured to the pink-purple gradient. */
function CtaArrowIcon() {
  return (
    <span
      aria-hidden
      className={styles.ctaIcon}
      style={{
        maskImage: "url(/icons/right-arrow.svg)",
        WebkitMaskImage: "url(/icons/right-arrow.svg)",
      }}
    />
  );
}

export default function HeroSection({ dictionary, isCardHovered = false }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <div className={styles.titleTop}>
            <p className={`font-bona-hero ${styles.titleLine1}`}>{dictionary.titleLine1}</p>
            <div className={styles.titleRow}>
              <p className={`font-bona-3xl-emphasized ${styles.titleWord}`} style={{marginRight: 6}}>
                {dictionary.titleToThe}
              </p>
              <p className={`font-bona-hero-emphasized ${styles.titleHighlight}`}>
                {dictionary.titleHighlight}
              </p>
              <p className={`font-bona-3xl-emphasized ${styles.titleWord}`} style={{marginLeft: 16}}>
                {dictionary.titleWorld}
              </p>
            </div>
          </div>
          <p className={`font-instrument-sm ${styles.description}`}>{dictionary.description}</p>
        </div>
        <motion.div layout className={styles.ctaButtonWrap} transition={CTA_LAYOUT_TRANSITION}>
          <MainButton variant="stroke" size="large" type="button" aria-controls="cards"
            onClick={() => {
              const cards = document.getElementById("cards");
              if (!cards) return;
              if (window.location.hash !== "#cards") window.history.pushState(null, "", "#cards");
              cards.scrollIntoView({ behavior: prefersReducedMotion ? "instant" : "smooth", block: "start" });
            }}>
            <span className={styles.ctaLabelWrap}>
              {/* <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={isCardHovered ? "hover" : "idle"}
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={CTA_LABEL_TRANSITION}
                  className={styles.ctaLabel}
                >
                  {isCardHovered ? dictionary.ctaHover : dictionary.cta}
                  {isCardHovered && <CtaArrowIcon />}
                </motion.span>
              </AnimatePresence> */}
              {dictionary.cta}
            </span>
          </MainButton>
          {/* Anchored to the CTA button (not the section) so it holds the same
              position relative to the button at every viewport width, regardless
              of how the fluid headline above changes the section's height. */}
          <motion.div
            animate={{ opacity: isCardHovered ? 0 : 1, scale: isCardHovered ? 0.6 : 1 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={styles.star}
          >
            <Image src="/icons/main-star.svg" alt="" width={50} height={62} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
