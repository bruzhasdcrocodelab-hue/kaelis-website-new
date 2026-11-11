import Link from "next/link";
import type { Locale } from "@/lang";
import { localizedHref } from "@/lib/routing";
import styles from "./TarotLinks.module.css";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ locale, items }: { locale: Locale; items: BreadcrumbItem[] }) {
  return <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
    {items.map((item, index) => <span key={`${item.href ?? "current"}-${item.label}`} className={styles.breadcrumbItem}>
      {index > 0 && <span aria-hidden>→</span>}
      {item.href ? <Link href={localizedHref(locale, item.href)}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
    </span>)}
  </nav>;
}
