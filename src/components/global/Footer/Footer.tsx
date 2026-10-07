import Link, { ReadingAnchor } from "@/components/reading/ReadingLink";
import MainButton from "@/components/global/MainButton";
import type { Dictionary, Locale } from "@/lang";
import { getSocialData } from "@/lib/config/social_links";
import styles from "./Footer.module.css";

export interface FooterProps {
  dictionary: Dictionary["footer"];
  locale: Locale;
  variant?: "default" | "on-dark";
}

export default function Footer({ dictionary, locale, variant = "default" }: FooterProps) {
  return (
    <footer className={`${styles.footer} ${variant === "on-dark" ? styles.onDark : ""}`}>
      <div className={styles.social}>
        {getSocialData(locale).map(({ href, label, icon }) => (
          <span key={label} className={styles.socialButton}>
            <span className={styles.socialButtonDesktop}>
              <MainButton icon={icon} size="medium" href={href} aria-label={label} />
            </span>
            <span className={styles.socialButtonMobile}>
              <MainButton
                icon={icon}
                size="large"
                variant="stroke"
                href={href}
                aria-label={label}
              />
            </span>
          </span>
        ))}
      </div>
      <div className={`font-instrument-base ${styles.links}`}>
        <Link href="/" className={styles.link}>
          {dictionary.links.childrensPrivacyPolicy}
        </Link>
        <Link href="/" className={styles.link}>
          {dictionary.links.refundSubscriptionPolicy}
        </Link>
        <Link href="/" className={styles.link}>
          {dictionary.links.privacyPolicy}
        </Link>
      </div>
      {/* A native link reloads the home page, including when already on it. */}
      <ReadingAnchor href="/" className={`font-instrument-xl ${styles.logo}`}>
        {dictionary.logo}
      </ReadingAnchor>
    </footer>
  );
}
