import Image from "next/image";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import type { Dictionary, Locale } from "@/lang";
import type { ArticleCategory, ArticlePreview } from "@/lib/articles/types";
import BlogList from "./BlogList";
import styles from "./BlogPageView.module.css";

export default function BlogPageView({ dictionary, locale, articles, categories }: {
  dictionary: Dictionary;
  locale: Locale;
  articles: ArticlePreview[];
  categories: ArticleCategory[];
}) {
  return <div className={styles.page}>
    <div className={styles.hero}>
      <Image src="/images/backgrounds/pattern-article.svg" alt="" width={1440} height={650} className={styles.pattern} priority />
      <Header dictionary={dictionary.header} locale={locale} />
      <Breadcrumbs locale={locale} items={[
        { label: dictionary.header.logo, href: "/" },
        { label: dictionary.articles.title },
      ]} />
      <section className={styles.intro}>
        <h1 className="font-bona-terms-title">{dictionary.articles.title}</h1>
        <p className="font-instrument-base">{dictionary.articles.description}</p>
      </section>
    </div>
    <main className={styles.main}>
      <BlogList locale={locale} dictionary={dictionary.articles} articles={articles} categories={categories} />
    </main>
    <Footer dictionary={dictionary.footer} locale={locale} />
  </div>;
}
