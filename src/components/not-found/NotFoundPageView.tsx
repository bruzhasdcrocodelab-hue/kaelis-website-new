import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import MainButton from "@/components/global/MainButton";
import type { Dictionary, Locale } from "@/lang";
import styles from "./NotFoundPageView.module.css";

export default function NotFoundPageView({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const content = dictionary.notFound;
  return <div className={styles.page}>
    <div className={styles.background} aria-hidden="true" />
    <div className={styles.content}>
      <Header dictionary={dictionary.header} locale={locale} />
      <main className={styles.main}>
        <section className={styles.card} aria-labelledby="not-found-title">
          <p className={`font-instrument-sm ${styles.eyebrow}`}>{content.eyebrow}</p>
          <p className={`font-bona-hero-emphasized ${styles.code}`}>404</p>
          <h1 id="not-found-title" className={`font-bona-hero ${styles.title}`}>{content.title}</h1>
          <p className={`font-instrument-base ${styles.description}`}>{content.description}</p>
          <MainButton href="/" variant="gradient-black" size="large">{content.action}</MainButton>
        </section>
      </main>
      <Footer dictionary={dictionary.footer} locale={locale} />
    </div>
  </div>;
}
