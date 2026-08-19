import Link from "next/link";
import MainButton from "@/components/global/MainButton";
import type { Dictionary } from "@/lang";
import styles from "./Header.module.css";

export interface HeaderProps {
  dictionary: Dictionary["header"];
}

export default function Header({ dictionary }: HeaderProps) {
  return (
    <header className={styles.header}>
      <p className={`font-instrument-xl ${styles.logo}`}>{dictionary.logo}</p>
      <nav className={`font-instrument-base ${styles.nav}`}>
        <Link href="/" className={styles.navLink}>
          {dictionary.nav.tarotSpreads}
        </Link>
        <Link href="/" className={styles.navLink}>
          {dictionary.nav.ourApp}
        </Link>
        <Link href="/" className={styles.navLink}>
          {dictionary.nav.termsOfUse}
        </Link>
      </nav>
      <div className={styles.actions}>
        <MainButton variant="stroke" size="medium" type="button">
          {dictionary.downloadApp}
        </MainButton>
        <MainButton
          variant="stroke"
          size="medium"
          icon="/icons/right-arrow.svg"
          iconRotation={90}
          type="button"
        >
          {dictionary.language}
        </MainButton>
      </div>
    </header>
  );
}
