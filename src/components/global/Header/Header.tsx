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
          // Inline so the build's CSS pipeline doesn't drop the unprefixed
          // property (same scheme as TopBlockSection); --pill-blur is toggled to
          // `none` on mobile by the stylesheet.
          backdropFilter: "var(--pill-blur)",
          WebkitBackdropFilter: "var(--pill-blur)",
        }}
      >
        <span className={styles.glowClip} aria-hidden>
          <span className={styles.glow} />
        </span>
        {/* A native link reloads the home page, including when already on it. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className={`font-instrument-xl ${styles.logo}`}>
          {dictionary.logo}
        </a>
        <nav className={`font-instrument-base ${styles.nav}`}>
          <TarotSpreadsLink className={styles.navLink} locale={locale}>
            {dictionary.nav.tarotSpreads}
          </TarotSpreadsLink>
          <OurAppLink className={styles.navLink}>{dictionary.nav.ourApp}</OurAppLink>
          <Link href="/terms-of-use" className={styles.navLink} lang={locale}>
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
            <MobileMenu dictionary={dictionary} locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
