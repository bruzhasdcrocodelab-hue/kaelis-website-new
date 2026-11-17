const articleRedirects = {
  "astrology-basics-understanding-your-natal-chart": true,
  "become-a-tarot-reader-essential-training-tips": true,
  "how-to-harness-the-power-of-tarot-practices-for-daily-guidance": true,
  "how-to-master-tarot-reading-a-comprehensive-training-guide": true,
  "how-to-use-tarot-for-daily-guidance-practical-techniques": true,
  "how-to-use-tarot-spreads-for-daily-guidance": true,
  "how-to-use-the-celtic-cross-spread-for-deep-insight": true,
  "mastering-tarot-how-to-read-cards-like-a-pro": true,
  "mastering-tarot-reading-techniques-a-comprehensive-guide": true,
  "numerology-s-role-in-enhancing-your-tarot-readings": true,
  "the-art-of-tarot-meditation-deepening-your-connection": true,
  "the-art-of-tarot-training-building-your-intuitive-skills": true,
  "the-wheel-of-fortune-understanding-cycles-in-tarot-readings": true,
  "top-5-tarot-spreads-for-love-readings": true,
  "unlock-your-future-5-tarot-spreads-for-accurate-predictions": true,
  "unlocking-the-secrets-how-to-use-tarot-spreads-for-accurate-readings": true,
  "unlocking-your-life-path-the-power-of-numerology": true,
  "what-are-the-best-tarot-spreads-for-beginners-guide": true,
} as const;

const locales = ["en", "ru", "ua"] as const;

export const legacyArticleRedirects: Readonly<Record<string, string>> = Object.fromEntries(
  Object.keys(articleRedirects).flatMap(slug =>
    locales.flatMap(articleLocale => [
      [`/articles/${slug}-${articleLocale}`, `/${articleLocale}/articles/${slug}-${articleLocale}`],
      ...locales.map(pathLocale => [`/${pathLocale}/articles/${slug}-${articleLocale}`, `/${pathLocale}/articles/${slug}-${pathLocale}`]),
    ]),
  ),
);
