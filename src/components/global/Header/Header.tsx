import Link from "next/link";
import MainButton from "@/components/global/MainButton";
import LanguageSelector from "@/components/global/LanguageSelector";
import type { Dictionary, Locale } from "@/lang";
import styles from "./Header.module.css";
import OurAppLink from "./OurAppLink";
import MobileMenu from "./MobileMenu";

export interface HeaderProps {
  dictionary: Dictionary["header"];
  locale: Locale;
}

export default function Header({ dictionary, locale }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link href="/" className={`font-instrument-xl ${styles.logo}`}>
        {dictionary.logo}
      </Link>
      <nav className={`font-instrument-base ${styles.nav}`}>
        <Link href="/" className={styles.navLink}>
          {dictionary.nav.tarotSpreads}
        </Link>
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
        <LanguageSelector locale={locale} languageNames={dictionary.languageNames} />
        <div className={styles.menu}>
          <MobileMenu dictionary={dictionary} />
        </div>
      </div>
    </header>
  );
}
