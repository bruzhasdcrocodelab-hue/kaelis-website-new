import Link from "next/link";
import MainButton from "@/components/global/MainButton";
import type { Dictionary } from "@/lang";
import styles from "./Footer.module.css";

export interface FooterProps {
  dictionary: Dictionary["footer"];
  variant?: "default" | "on-dark";
}

const SOCIAL_LINKS = [
  { href: "/", label: "TikTok", icon: "/icons/tiktok.svg" },
  { href: "/", label: "Instagram", icon: "/icons/instagram.svg" },
];

export default function Footer({ dictionary, variant = "default" }: FooterProps) {
  return (
    <footer className={`${styles.footer} ${variant === "on-dark" ? styles.onDark : ""}`}>
      <div className={styles.social}>
        {SOCIAL_LINKS.map(({ href, label, icon }) => (
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
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/" className={`font-instrument-xl ${styles.logo}`}>
        {dictionary.logo}
      </a>
    </footer>
  );
}
