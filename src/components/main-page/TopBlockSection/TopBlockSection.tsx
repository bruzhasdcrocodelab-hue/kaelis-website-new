import Image from "next/image";
import type { Dictionary } from "@/lang";
import styles from "./TopBlockSection.module.css";
import MainButton from "@/components/global/MainButton";

export interface TopBlockSectionProps {
  dictionary: Dictionary["topBlock"];
  className?: string;
}

export default function TopBlockSection({ dictionary, className = "" }: TopBlockSectionProps) {
  return (
    <section
      id="top-block"
      className={`${styles.topBlock} ${className}`}
      style={{
        // Inline so the build's CSS pipeline doesn't drop the unprefixed property:
        // it blurs whatever the page paints behind this panel, within its bounds.
        backdropFilter: "blur(12.5px)",
        WebkitBackdropFilter: "blur(12.5px)",
      }}
    >
      <div className={styles.background} aria-hidden>
                <div className={styles.backgroundTintMobile} />
        <div className={styles.backgroundTint} />
        <div className={styles.backgroundImageCrop}>
          <Image
            src="/images/backgrounds/TopBlock-3.png"
            alt=""
            fill
            className={styles.backgroundImage}
          />
        </div>
      </div>
      <div className={styles.textPanel}>
        <p className={`font-instrument-sm ${styles.eyebrow}`}>{dictionary.eyebrow}</p>
        <div className={`font-bona-2xl-emphasized ${styles.heading}`}>
          <p>{dictionary.titleLine1}</p>
          <p>{dictionary.titleLine2}</p>
        </div>
        <p className={`font-instrument-sm ${styles.description}`}>{dictionary.description}</p>
      </div>
      <div className={styles.spacer} />
      <div className={styles.actions}>
        
              <MainButton
                icon="/icons/apple.svg"
                size="medium"
                disabled
                aria-label="App Store"
              />
              <MainButton
                icon="/icons/google-play.svg"
                size="medium"
                href="https://play.google.com/store/apps/details?id=io.kaelsi.app"
                aria-label="Google Play"
              />
           
        {/* <Link href="/" className={styles.actionButton} aria-label="App Store">
          <span className={styles.actionIconWrap}>
            <Image src="/icons/apple.svg" alt="" width={24} height={24} />
          </span>
        </Link>
        <Link href="/" className={styles.actionButton} aria-label="Google Play">
          <span className={styles.actionIconWrapWide}>
            <Image src="/icons/google-play.svg" alt="" width={24} height={24} />
          </span>
        </Link> */}
      </div>
    </section>
  );
}
