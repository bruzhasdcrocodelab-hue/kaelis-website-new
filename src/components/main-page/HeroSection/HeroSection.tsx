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
 * CTA label swap. `AnimatePresence mode="wait"` holds the incoming label until
 * the outgoing one has fully faded out, so the two texts are never on screen at
 * the same time (no overlap smear). The fade is quick on each side so the swap
 * still feels snappy; the button width is animated by the `layout` wrappers.
 */
const CTA_LABEL_TRANSITION = { duration: 0.16, ease: [0.4, 0, 0.2, 1] } as const;

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
          <MainButton
            variant="stroke"
            size="large"
            type="button"
            icon={isCardHovered ? "/icons/right-arrow.svg" : undefined}
          >
            <span className={styles.ctaLabelWrap}>
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={isCardHovered ? "hover" : "idle"}
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={CTA_LABEL_TRANSITION}
                  className={styles.ctaLabel}
                >
                  {isCardHovered ? dictionary.ctaHover : dictionary.cta}
                </motion.span>
              </AnimatePresence>
            </span>
          </MainButton>
        </motion.div>
      </div>
      <motion.div
        animate={{ opacity: isCardHovered ? 0 : 1, scale: isCardHovered ? 0.6 : 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={styles.star}
      >
        <Image src="/icons/main-star.svg" alt="" width={50} height={62} />
      </motion.div>
    </section>
  );
}
