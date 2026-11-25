import content from "./seo/content.json";
import { legacyArticleRedirects } from "./legacyArticleRedirects";
import { policyKeys } from "./policies/catalog";
import { isUrlLocale, type UrlLocale } from "./routing";

type Redirect = { destination: string; status: 301 | 308 };

const articleSlugs = Object.keys(legacyArticleRedirects).reduce((entries, source) => {
  const match = source.match(/^\/articles\/(.+)-(en|ru|ua)$/);
  if (match) entries.add(match[1]);
  return entries;
}, new Set<string>());

const tarotPaths = Object.keys(content.en).filter(path => path.startsWith("/tarot/"));
const categorySlugs = [...new Set(tarotPaths.map(path => path.split("/")[2]))];
const legacyArticleAliases: Readonly<Record<string, string>> = {
  "exploring-the-mystical-connection-between-tarot-and-numerology":
    "numerology-s-role-in-enhancing-your-tarot-readings",
};
const exactLegacyRedirects: Readonly<Record<string, Redirect>> = {
  "/tarot/work/job-change": { destination: "/en/tarot/work/job-change", status: 308 },
};

function canonicalLocale(value: string | undefined): UrlLocale | undefined {
  if (value === "uk") return "ua";
  return value && isUrlLocale(value) ? value : undefined;
}

function articleLocale(pathLocale: string | undefined, suffix: string | undefined): UrlLocale {
  return canonicalLocale(pathLocale) ?? canonicalLocale(suffix) ?? "en";
}

function splitArticlePath(pathname: string) {
  const parts = pathname.slice(1).split("/");
  const pathLocale = /^[a-z]{2}$/.test(parts[0]) ? parts.shift() : undefined;
  const hasArticles = parts[0] === "articles";
  if (hasArticles) parts.shift();
  if (parts.length !== 1 || !parts[0]) return null;
  const slug = parts[0];
  const suffix = slug.match(/-([a-z]{2})$/)?.[1];
  return { pathLocale, hasArticles, slug, suffix };
}

function articleRedirect(pathname: string): Redirect | undefined {
  const parsed = splitArticlePath(pathname);
  if (!parsed) return undefined;
  for (const [source, target] of Object.entries(legacyArticleAliases)) {
    if (parsed.slug === source || parsed.slug.match(new RegExp(`^${source}-[a-z]{2}$`))) {
      const locale = articleLocale(parsed.pathLocale, parsed.suffix);
      const destination = `/${locale}/articles/${target}-${locale}`;
      return destination === pathname ? undefined : { destination, status: 301 };
    }
  }
  for (const slug of articleSlugs) {
    if (parsed.slug === slug || parsed.slug.match(new RegExp(`^${slug}-[a-z]{2}$`))) {
      const locale = articleLocale(parsed.pathLocale, parsed.suffix);
      const destination = `/${locale}/articles/${slug}-${locale}`;
      return destination === pathname ? undefined : { destination, status: 301 };
    }
  }
  if (!parsed.hasArticles) return undefined;
  return { destination: `/${articleLocale(parsed.pathLocale, parsed.suffix)}/articles`, status: 301 };
}

function policyRedirect(pathname: string): Redirect | undefined {
  const rootMatch = pathname.match(/^\/policy\/(.+)-(en|ru|ua|uk)$/);
  if (rootMatch) {
    const locale = canonicalLocale(rootMatch[2]);
    const key = policyKeys.find(candidate => candidate === rootMatch[1]);
    if (locale && key) {
      return { destination: `/${locale}/policy/${key}-${locale}`, status: 308 };
    }
  }
  const match = pathname.match(/^\/(en|ru|ua)\/(?:policy\/)?(.+)$/);
  if (!match) return undefined;
  const key = policyKeys.find(candidate => match[2] === candidate ||
    (match[2].startsWith(`${candidate}-`) && /^[a-z]{2}$/.test(match[2].slice(candidate.length + 1))));
  if (!key) return undefined;
  const destination = `/${match[1]}/policy/${key}-${match[1]}`;
  return destination === pathname ? undefined : { destination, status: 308 };
}

function uniquePrefix(value: string, candidates: string[]): string | undefined {
  if (value.length < 3) return undefined;
  const matches = candidates.filter(candidate => candidate !== value && candidate.startsWith(value));
  return matches.length === 1 ? matches[0] : undefined;
}

function tarotRedirect(pathname: string): Redirect | undefined {
  const parts = pathname.slice(1).split("/");
  if (!isUrlLocale(parts[0]) || parts[1] !== "tarot") return undefined;
  if (parts.length === 3) {
    const category = uniquePrefix(parts[2], categorySlugs);
    return category ? { destination: `/${parts[0]}/tarot/${category}`, status: 308 } : undefined;
  }
  if (parts.length !== 4 || !categorySlugs.includes(parts[2])) return undefined;
  const spreads = tarotPaths
    .map(path => path.split("/"))
    .filter(([, , category, spread]) => category === parts[2] && spread)
    .map(([, , , spread]) => spread);
  const spread = uniquePrefix(parts[3], spreads);
  return spread ? { destination: `/${parts[0]}/tarot/${parts[2]}/${spread}`, status: 308 } : undefined;
}

export function legacyRedirect(pathname: string): Redirect | undefined {
  return exactLegacyRedirects[pathname] ?? articleRedirect(pathname) ?? policyRedirect(pathname) ?? tarotRedirect(pathname);
}
