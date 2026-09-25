import type { Locale } from "@/lang";
import { catalogMessages } from "@/lib/categories/messages";
import styles from "./CatalogStatus.module.css";

export default function CatalogStatus({ locale, status, retry }: {
  locale: Locale;
  status: "loading" | "error" | "empty" | "notFound";
  retry?: () => void;
}) {
  const text = catalogMessages[locale];
  return <div className={styles.status} role={status === "error" ? "alert" : "status"} aria-live="polite" aria-busy={status === "loading"}>
    {status === "loading" && <span className={styles.spinner} aria-hidden="true" />}
    <p>{text[status]}</p>
    {status === "error" && retry && <button className={styles.retry} type="button" onClick={retry}>{text.retry}</button>}
  </div>;
}
