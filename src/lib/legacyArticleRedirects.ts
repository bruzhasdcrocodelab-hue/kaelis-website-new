const articleRedirects = {
  "astrology-basics-understanding-your-natal-chart": "/tarot/personality",
  "become-a-tarot-reader-essential-training-tips": "/tarot/answer/triplet",
  "how-to-harness-the-power-of-tarot-practices-for-daily-guidance": "/tarot/forecast/7-days",
  "how-to-master-tarot-reading-a-comprehensive-training-guide": "/tarot/answer/triplet",
  "how-to-use-tarot-for-daily-guidance-practical-techniques": "/tarot/forecast/7-days",
  "how-to-use-tarot-spreads-for-daily-guidance": "/tarot/forecast/7-days",
  "how-to-use-the-celtic-cross-spread-for-deep-insight": "/tarot/answer/celtic-cross",
  "mastering-tarot-how-to-read-cards-like-a-pro": "/tarot/answer/triplet",
  "mastering-tarot-reading-techniques-a-comprehensive-guide": "/tarot/answer/triplet",
  "numerology-s-role-in-enhancing-your-tarot-readings": "/tarot/soul-path/whats-inside",
  "the-art-of-tarot-meditation-deepening-your-connection": "/tarot/personality/inner-child",
  "the-art-of-tarot-training-building-your-intuitive-skills": "/tarot/personality",
  "the-wheel-of-fortune-understanding-cycles-in-tarot-readings": "/tarot/forecast/prediction",
  "top-5-tarot-spreads-for-love-readings": "/tarot/love",
  "unlock-your-future-5-tarot-spreads-for-accurate-predictions": "/tarot/forecast/prediction",
  "unlocking-the-secrets-how-to-use-tarot-spreads-for-accurate-readings": "/tarot/answer/triplet",
  "unlocking-your-life-path-the-power-of-numerology": "/tarot/soul-path/whats-inside",
  "what-are-the-best-tarot-spreads-for-beginners-guide": "/tarot/answer/triplet",
} as const;

const locales = ["en", "ru", "ua"] as const;

export const legacyArticleRedirects: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(articleRedirects).flatMap(([slug, destination]) =>
    locales.flatMap(articleLocale => [
      [`/articles/${slug}-${articleLocale}`, `/${articleLocale}${destination}`],
      ...locales.map(pathLocale => [`/${pathLocale}/articles/${slug}-${articleLocale}`, `/${pathLocale}${destination}`]),
    ]),
  ),
);
