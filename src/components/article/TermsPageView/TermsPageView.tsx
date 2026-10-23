import Image from "next/image";
import type { PolicyDocument } from "@/lib/policies/content";
import type { Dictionary, Locale } from "@/lang";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import TermsHeroSection from "@/components/article/TermsHeroSection";
import TermsArticleCard from "@/components/article/TermsArticleCard";
import styles from "./TermsPageView.module.css";

export interface TermsPageViewProps {
  dictionary: Dictionary;
  locale: Locale;
  policy: PolicyDocument;
}

export default function TermsPageView({ dictionary, locale, policy }: TermsPageViewProps) {
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
          <TermsHeroSection dictionary={{ ...dictionary.termsOfUse, title: policy.title, lastUpdated: policy.published }} locale={locale} />
        </div>
        <div className={styles.articleWrap}>
          <TermsArticleCard policy={policy} />
        </div>
        <Footer dictionary={dictionary.footer} locale={locale} />
      </div>
    </div>
  );
}
