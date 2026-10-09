import type { Locale } from "@/lang";

export const urlLocales = ["en", "ru", "ua"] as const;
export type UrlLocale = typeof urlLocales[number];
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isUrlLocale(value: string): value is UrlLocale {
  return urlLocales.includes(value as UrlLocale);
}

export function toLocale(value: UrlLocale): Locale {
  return value === "ua" ? "uk" : value;
}

export function toUrlLocale(value: Locale): UrlLocale {
  return value === "uk" ? "ua" : value;
}

export function localizedHref(locale: Locale, path = "/"): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const prefix = toUrlLocale(locale);
  const normalized = path.replace(/^\/(en|ru|ua)(?=\/|[?#]|$)/, "")
    .replace(/^\/categories(?=\/|[?#]|$)/, "/tarot")
    .replace(/^\/terms-of-use(?=[?#]|$)/, `/policy/terms-of-use-${prefix}`)
    .replace(/^\/policy\/terms-of-use-(en|ru|ua)(?=[?#]|$)/, `/policy/terms-of-use-${prefix}`);
  return `/${prefix}${normalized === "/" ? "" : normalized.replace(/^\/(?=[?#])/, "")}`;
}

export function routeFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const prefix = parts.shift() ?? "";
  if (!isUrlLocale(prefix)) return null;
  const locale = toLocale(prefix);
  const path = parts.map(part => { try { return decodeURIComponent(part); } catch { return part; } });
  if (!path.length) return { locale, kind: "home" as const, path: [], key: "home" };
  if (path[0] === "tarot" && path.length <= 3) {
    return { locale, kind: path.length === 1 ? "catalog" as const : "category" as const, path: path.slice(1), key: path.join("/") };
  }
  if (path.length === 2 && path[0] === "policy" && path[1] === `terms-of-use-${prefix}`) {
    return { locale, kind: "terms" as const, path: [], key: "terms" };
  }
  return null;
}

export function negotiateLocale(cookie: string | undefined, acceptLanguage: string | null): UrlLocale {
  if (cookie && isUrlLocale(cookie)) return cookie;
  const preferences = (acceptLanguage ?? "").split(",").map((entry, index) => {
    const [tag, ...parameters] = entry.trim().split(";");
    const quality = parameters.find(parameter => parameter.trim().startsWith("q="));
    return { tag: tag.toLowerCase().split("-")[0], quality: quality ? Number(quality.trim().slice(2)) : 1, index };
  }).filter(item => item.quality > 0 && item.quality <= 1).sort((a, b) => b.quality - a.quality || a.index - b.index);
  for (const { tag } of preferences) if (isUrlLocale(tag)) return tag;
  return "en";
}
