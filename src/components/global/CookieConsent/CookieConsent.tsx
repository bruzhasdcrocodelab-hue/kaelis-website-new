"use client";

import { useState, useSyncExternalStore } from "react";
import type { Dictionary, Locale } from "@/lang";
import { CONSENT_KEY, readConsent, saveConsent, type AnalyticsConsent } from "@/lib/consent";
import { policyHref } from "@/lib/policies/catalog";
import MainButton from "@/components/global/MainButton";
import Link from "@/components/reading/ReadingLink";
import styles from "./CookieConsent.module.css";

function needsConsent() {
  try {
    return readConsent(localStorage.getItem(CONSENT_KEY)) === null;
  } catch {
    return true;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export default function CookieConsent({ dictionary, locale }: { dictionary: Dictionary["cookieConsent"]; locale: Locale }) {
  const needsChoice = useSyncExternalStore(subscribe, needsConsent, () => false);
  const [dismissed, setDismissed] = useState(false);
  function choose(choice: AnalyticsConsent) {
    saveConsent(choice);
    setDismissed(true);
  }
  if (!needsChoice || dismissed) return null;
  return <section className={styles.panel} aria-label={dictionary.title}>
    <div className={styles.copy}>
      <h2>{dictionary.title}</h2>
      <p>{dictionary.description} <Link href={policyHref(locale, "privacy-policy")}>{dictionary.policy}</Link></p>
    </div>
    <div className={styles.actions}>
      <MainButton variant="gradient-black" onClick={() => choose("granted")}>{dictionary.accept}</MainButton>
      <MainButton variant="stroke" onClick={() => choose("denied")}>{dictionary.reject}</MainButton>
    </div>
  </section>;
}
