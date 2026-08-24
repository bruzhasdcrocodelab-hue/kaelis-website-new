import Image from "next/image";
import type { Dictionary } from "@/lang";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import TermsHeroSection from "@/components/article/TermsHeroSection";
import TermsArticleCard from "@/components/article/TermsArticleCard";
import styles from "./TermsPageView.module.css";

export interface TermsPageViewProps {
  dictionary: Dictionary;
}

export default function TermsPageView({ dictionary }: TermsPageViewProps) {
  return (
    <div className={styles.page}>
      <Image
        src="/images/backgrounds/main.png"
        alt=""
        width={1440}
        height={500}
        className={styles.backgroundImage}
        priority
      />
      <Image
        src="/images/backgrounds/pattern-article.svg"
        alt=""
        width={1440}
        height={650}
        className={styles.patternArticle}
        priority
      />
      <div className={styles.content}>
        <Header dictionary={dictionary.header} />
        <TermsHeroSection dictionary={dictionary.termsOfUse} />
        <div className={styles.articleWrap}>
          <TermsArticleCard dictionary={dictionary.termsOfUse} />
        </div>
        <Footer dictionary={dictionary.footer} />
      </div>
    </div>
  );
}
