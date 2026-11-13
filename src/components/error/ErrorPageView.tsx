"use client";

import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import MainButton from "@/components/global/MainButton";
import type { Dictionary, Locale } from "@/lang";
import styles from "@/components/not-found/NotFoundPageView.module.css";

export default function ErrorPageView({ dictionary, locale, retry }: { dictionary: Dictionary; locale: Locale; retry: () => void }) {
  const content = dictionary.error;
  return <div className={styles.page}>
    <div className={styles.background} aria-hidden="true" />
    <div className={styles.content}>
      <Header dictionary={dictionary.header} locale={locale} />
      <main className={styles.main}>
        <section className={styles.card} aria-labelledby="error-title">
          <p className={`font-instrument-sm ${styles.eyebrow}`}>{content.eyebrow}</p>
          <h1 id="error-title" className={`font-bona-hero ${styles.title}`}>{content.title}</h1>
          <p className={`font-instrument-base ${styles.description}`}>{content.description}</p>
          <MainButton variant="gradient-black" size="large" onClick={retry}>{content.action}</MainButton>
        </section>
      </main>
      <Footer dictionary={dictionary.footer} locale={locale} />
    </div>
  </div>;
}
