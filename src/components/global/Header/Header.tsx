import Link from "next/link";
import MainButton from "@/components/global/MainButton";
import LanguageSelector from "@/components/global/LanguageSelector";
import type { Dictionary, Locale } from "@/lang";
import styles from "./Header.module.css";
import OurAppLink from "./OurAppLink";
import TarotSpreadsLink from "./TarotSpreadsLink";
import MobileMenu from "./MobileMenu";

export interface HeaderProps {
  dictionary: Dictionary["header"];
  locale: Locale;
}

export default function Header({ dictionary, locale }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div
        className={styles.pill}
        style={{
          // Inline so the build's CSS pipeline keeps the unprefixed property,
          // matching TopBlockSection's blur scheme.
          backdropFilter: "blur(12.5px)",
          WebkitBackdropFilter: "blur(12.5px)",
        }}
      >
        <span className={styles.glowClip} aria-hidden>
          <span className={styles.glow} />
        </span>
        <Link href="/" className={`font-instrument-xl ${styles.logo}`}>
          {dictionary.logo}
        </Link>
        <nav className={`font-instrument-base ${styles.nav}`}>
          <TarotSpreadsLink className={styles.navLink} locale={locale}>
            {dictionary.nav.tarotSpreads}
          </TarotSpreadsLink>
          <OurAppLink className={styles.navLink}>{dictionary.nav.ourApp}</OurAppLink>
          <Link href="/terms-of-use" className={styles.navLink}>
            {dictionary.nav.termsOfUse}
          </Link>
        </nav>
        <div className={styles.actions}>
          <MainButton
            variant="stroke"
            size="medium"
            type="button"
            className={styles.downloadApp}
          >
            {dictionary.downloadApp}
          </MainButton>
          <LanguageSelector
            locale={locale}
            languageNames={dictionary.languageNames}
            languageShort={dictionary.languageShort}
          />
          <div className={styles.menu}>
            <MobileMenu dictionary={dictionary} />
          </div>
        </div>
      </div>
    </header>
  );
}
