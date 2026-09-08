import Link from "next/link";
import styles from "./TarotSpreadsLink.module.css";

export interface TarotSpreadsLinkProps {
  className?: string;
  children: React.ReactNode;
}

export default function TarotSpreadsLink({ className, children }: TarotSpreadsLinkProps) {
  return (
    <Link href="/categories" className={`${styles.link} ${className ?? ""}`}>
      <span>{children}</span>
      <span
        className={styles.chevron}
        style={{ maskImage: "url(/icons/chevron-down.svg)", WebkitMaskImage: "url(/icons/chevron-down.svg)" }}
        aria-hidden
      />
    </Link>
  );
}
