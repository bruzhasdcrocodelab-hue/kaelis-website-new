"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "@/lang";
import { localizedHref } from "@/lib/routing";
import type { ArticleCategory, ArticlePreview } from "@/lib/articles/types";
import SanityImage from "@/components/article/SanityImage";
import styles from "./BlogPageView.module.css";

type Labels = {
  searchPlaceholder: string;
  clearSearch: string;
  empty: string;
  allCategories: string;
  published: string;
};

const dateLocales: Record<Locale, string> = { en: "en-US", ru: "ru-RU", uk: "uk-UA" };

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(dateLocales[locale], { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T00:00:00Z`));
}

export default function BlogList({ locale, dictionary, articles, categories }: {
  locale: Locale;
  dictionary: Labels;
  articles: ArticlePreview[];
  categories: ArticleCategory[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const normalizedQuery = query.trim().toLocaleLowerCase(dateLocales[locale]);
  const filtered = useMemo(() => articles.filter(article => {
    const matchesQuery = !normalizedQuery || `${article.title} ${article.description}`.toLocaleLowerCase(dateLocales[locale]).includes(normalizedQuery);
    const matchesCategory = selected.length === 0 || article.categories.some(category => selected.includes(category.id));
    return matchesQuery && matchesCategory;
  }), [articles, locale, normalizedQuery, selected]);

  function toggleCategory(id: string) {
    setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  }

  function reset() {
    setQuery("");
    setSelected([]);
  }

  return <section className={styles.catalog} aria-label={dictionary.searchPlaceholder}>
    <div className={styles.filters}>
      <label className={styles.search}>
        <span className={styles.searchLabel}>{dictionary.searchPlaceholder}</span>
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder={dictionary.searchPlaceholder} type="search" />
        {query && <button type="button" onClick={() => setQuery("")} aria-label={dictionary.clearSearch}>×</button>}
      </label>
      <div className={styles.tags} aria-label={dictionary.allCategories}>
        {categories.map(category => <button
          key={category.id}
          type="button"
          className={selected.includes(category.id) ? styles.tagActive : styles.tag}
          aria-pressed={selected.includes(category.id)}
          onClick={() => toggleCategory(category.id)}
        >
          {category.title}
        </button>)}
      </div>
    </div>
    {filtered.length ? <div className={styles.grid}>
      {filtered.map(article => <Link key={article.id} href={localizedHref(locale, `/articles/${article.slug}`)} className={styles.card}>
        {article.cover && <div className={styles.imageWrap}><SanityImage image={article.cover} className={styles.image} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" /></div>}
        <div className={styles.cardBody}>
          <div className={styles.cardMeta}>
            <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
            {article.categories.length ? <span>{article.categories.map(category => category.title).join(" · ")}</span> : null}
          </div>
          <h2 className="font-bona-2xl">{article.title}</h2>
          {article.description && <p>{article.description}</p>}
        </div>
      </Link>)}
    </div> : <div className={styles.empty}>
      <p className="font-instrument-base">{dictionary.empty}</p>
      {(query || selected.length) && <button type="button" onClick={reset}>{dictionary.allCategories}</button>}
    </div>}
  </section>;
}
