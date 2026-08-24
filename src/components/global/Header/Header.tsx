import Link from "next/link";
import MainButton from "@/components/global/MainButton";
import LanguageSelector from "@/components/global/LanguageSelector";
import type { Dictionary, Locale } from "@/lang";
import styles from "./Header.module.css";

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
        <Link href="/" className={styles.navLink}>
          {dictionary.nav.ourApp}
        </Link>
        <Link href="/terms-of-use" className={styles.navLink}>
          {dictionary.nav.termsOfUse}
        </Link>
      </nav>
      <div className={styles.actions}>
        <MainButton variant="stroke" size="medium" type="button">
          {dictionary.downloadApp}
        </MainButton>
        <LanguageSelector locale={locale} />
      </div>
    </header>
  );
}
