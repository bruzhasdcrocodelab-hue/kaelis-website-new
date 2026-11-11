import Link from "next/link";
import type { Locale } from "@/lang";
import { localizedHref } from "@/lib/routing";
import styles from "./TarotLinks.module.css";

export default function Breadcrumbs({ locale, home, hub, current }: { locale: Locale; home: string; hub: string; current: string }) {
  return <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
    <Link href={localizedHref(locale, "/")}>{home}</Link>
    <span aria-hidden>→</span>
    <Link href={localizedHref(locale, "/tarot")}>{hub}</Link>
    <span aria-hidden>→</span>
    <span aria-current="page">{current}</span>
  </nav>;
}
