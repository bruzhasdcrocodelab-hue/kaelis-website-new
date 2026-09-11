import Image from "next/image";
import type { Dictionary, Locale } from "@/lang";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import TermsHeroSection from "@/components/article/TermsHeroSection";
import TermsArticleCard from "@/components/article/TermsArticleCard";
import styles from "./TermsPageView.module.css";

export interface TermsPageViewProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function TermsPageView({ dictionary, locale }: TermsPageViewProps) {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.hero}>
          <Image
            src="/images/backgrounds/pattern-article.svg"
            alt=""
            width={1440}
            height={650}
            className={styles.patternArticle}
            priority
          />
          <Header dictionary={dictionary.header} locale={locale} />
          <TermsHeroSection dictionary={dictionary.termsOfUse} locale={locale} />
        </div>
        <div className={styles.articleWrap}>
          <TermsArticleCard dictionary={dictionary.termsOfUse} />
        </div>
        <Footer dictionary={dictionary.footer} />
      </div>
    </div>
  );
}
