import Image from "next/image";
import MainButton from "@/components/global/MainButton";
import type { Dictionary } from "@/lang";
import styles from "./HeroSection.module.css";

export interface HeroSectionProps {
  dictionary: Dictionary["hero"];
}

export default function HeroSection({ dictionary }: HeroSectionProps) {
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
        <MainButton variant="stroke" size="large" type="button">
          {dictionary.cta}
        </MainButton>
      </div>
      <Image
        src="/icons/main-star.svg"
        alt=""
        width={50}
        height={62}
        className={styles.star}
      />
    </section>
  );
}
