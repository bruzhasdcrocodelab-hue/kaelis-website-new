import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lang";
import styles from "./Footer.module.css";

export interface FooterProps {
  dictionary: Dictionary["footer"];
}

export default function Footer({ dictionary }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.social}>
        <Link href="/" className={styles.socialLink} aria-label="TikTok">
          <Image src="/icons/tiktok.svg" alt="" width={24} height={24} className={styles.socialIcon} />
        </Link>
        <Link href="/" className={styles.socialLink} aria-label="Instagram">
          <Image
            src="/icons/instagram.svg"
            alt=""
            width={24}
            height={24}
            className={styles.socialIcon}
          />
        </Link>
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
      <Link href="/" className={`font-instrument-xl ${styles.logo}`}>
        {dictionary.logo}
      </Link>
    </footer>
  );
}
