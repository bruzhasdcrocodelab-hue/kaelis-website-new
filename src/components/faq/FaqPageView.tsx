import Image from "next/image";
import type { Dictionary, Locale } from "@/lang";
import type { FaqPageContent } from "@/lib/faq/content";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import FaqSection from "./FaqSection";
import styles from "./FaqPageView.module.css";

export interface FaqPageViewProps {
  dictionary: Dictionary;
  locale: Locale;
  content: FaqPageContent;
}

export default function FaqPageView({ dictionary, locale, content }: FaqPageViewProps) {
  return <div className={styles.page}>
    <div className={styles.hero}>
      <Image src="/images/backgrounds/pattern-article.svg" alt="" width={1440} height={650} className={styles.pattern} priority />
      <Header dictionary={dictionary.header} locale={locale} />
      <Breadcrumbs locale={locale} items={[
        { label: dictionary.header.logo, href: "/" },
        { label: content.heading },
      ]} />
      <div className={styles.heroContent}>
        <p className={`font-instrument-base-emphasized ${styles.eyebrow}`}>{content.eyebrow}</p>
        <h1 className={`font-bona-terms-title ${styles.title}`}>{content.heading}</h1>
        <p className={`font-instrument-base ${styles.intro}`}>{content.intro}</p>
      </div>
    </div>
    <main className={styles.main}>
      <div className={styles.card}>
        <FaqSection heading={content.heading} items={content.items} />
      </div>
    </main>
    <Footer dictionary={dictionary.footer} locale={locale} />
  </div>;
}
