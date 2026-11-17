import Image from "next/image";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import ArticleContent from "@/components/article/ArticleContent";
import SanityImage from "@/components/article/SanityImage";
import type { Dictionary, Locale } from "@/lang";
import type { ArticleDocument } from "@/lib/articles/types";
import styles from "./ArticlePageView.module.css";

const dateLocales: Record<Locale, string> = { en: "en-US", ru: "ru-RU", uk: "uk-UA" };

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(dateLocales[locale], { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T00:00:00Z`));
}

export default function ArticlePageView({ dictionary, locale, article }: {
  dictionary: Dictionary;
  locale: Locale;
  article: ArticleDocument;
}) {
  return <div className={styles.page}>
    <div className={styles.hero}>
      <Image src="/images/backgrounds/pattern-article.svg" alt="" width={1440} height={650} className={styles.pattern} priority />
      <Header dictionary={dictionary.header} locale={locale} />
      <Breadcrumbs locale={locale} items={[
        { label: dictionary.header.logo, href: "/" },
        { label: dictionary.articles.title, href: "/articles" },
        { label: article.title },
      ]} />
      <section className={styles.intro}>
        <div className={styles.categories}>{article.categories.map(category => <span key={category.id}>{category.title}</span>)}</div>
        <h1 className="font-bona-terms-title">{article.title}</h1>
        {article.description && <p className="font-instrument-base">{article.description}</p>}
        <time className="font-instrument-sm" dateTime={article.date}>{dictionary.articles.published}: {formatDate(article.date, locale)}</time>
      </section>
    </div>
    <main className={styles.main}>
      {article.cover && <div className={styles.coverWrap}><SanityImage image={article.cover} className={styles.cover} priority sizes="(max-width: 900px) 100vw, 840px" /></div>}
      <article className={`shadow-medium ${styles.article}`}>
        <ArticleContent content={article.content} />
      </article>
    </main>
    <Footer dictionary={dictionary.footer} locale={locale} />
  </div>;
}
