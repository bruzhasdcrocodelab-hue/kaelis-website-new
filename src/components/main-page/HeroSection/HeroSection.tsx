import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import MainButton from "@/components/global/MainButton";
import type { Dictionary } from "@/lang";
import styles from "./HeroSection.module.css";

export interface HeroSectionProps {
  dictionary: Dictionary["hero"];
  isCardHovered?: boolean;
}

export default function HeroSection({ dictionary, isCardHovered = false }: HeroSectionProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <div className={styles.titleTop}>
            <p className={`font-bona-hero ${styles.titleLine1}`}>{dictionary.titleLine1}</p>
            <div className={styles.titleRow}>
              <p className={`font-bona-3xl-emphasized ${styles.titleWord}`}>
                {dictionary.titleToThe}
              </p>
              <p className={`font-bona-hero-emphasized ${styles.titleHighlight}`}>
                {dictionary.titleHighlight}
              </p>
              <p className={`font-bona-3xl-emphasized ${styles.titleWord}`}>
                {dictionary.titleWorld}
              </p>
            </div>
          </div>
          <p className={`font-instrument-sm ${styles.description}`}>{dictionary.description}</p>
        </div>
        <MainButton variant="stroke" size="large" type="button" icon={isCardHovered ? "/icons/right-arrow.svg" : undefined}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isCardHovered ? "hover" : "idle"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className={styles.ctaLabel}
            >
              {isCardHovered ? dictionary.ctaHover : dictionary.cta}
            </motion.span>
          </AnimatePresence>
        </MainButton>
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
