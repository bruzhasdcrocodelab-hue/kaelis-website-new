import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const REQUEST_TIMEOUT_MS = 30000;
const LOCALES = ["en", "ru", "uk"];

function isObject(value) {
  return value !== null && typeof value === "object";
}

function isItem(value) {
  if (!isObject(value)) return false;
  return (typeof value.id === "string" && value.id.trim() || Number.isSafeInteger(value.id)) &&
    typeof value.slug === "string" && value.slug && !/[/?#\\]/.test(value.slug) &&
    typeof value.name === "string" && typeof value.site_description === "string" &&
    (value.image === null || typeof value.image === "string") && typeof value.need_new_plan === "boolean";
}

function isSpread(value) {
  return isItem(value) && typeof value.description === "string" &&
    isObject(value.matrix) && !Array.isArray(value.matrix);
}

async function environmentOrigin(readEnvironment = readFile) {
  const inline = process.env.NEXT_PUBLIC_BACKEND_ORIGIN?.trim();
  if (inline) return new URL(inline).origin;
  const source = await readEnvironment(".env", "utf8");
  const value = source.match(/^NEXT_PUBLIC_BACKEND_ORIGIN\s*=\s*(.+)\s*$/m)?.[1].replace(/^['"]|['"]$/g, "").trim();
  if (!value) throw new Error("Missing environment variable: NEXT_PUBLIC_BACKEND_ORIGIN");
  return new URL(value).origin;
}

async function requestJson(fetchImpl, url, options) {
  const response = await fetchImpl(url, { ...options, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  return { status: response.status, body: await response.json().catch(() => null) };
}

async function publicToken(fetchImpl, origin) {
  const response = await requestJson(fetchImpl, new URL("/api/user/anonymous", origin), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": "en",
      "X-Platform": "site",
    },
  });
  const token = response.body?.data;
  if (response.status < 200 || response.status >= 300 || token?.token_type !== "Bearer" || typeof token.access_token !== "string" || !token.access_token.trim()) {
    throw new Error(`Public catalog authorization failed (${response.status})`);
  }
  return token.access_token;
}

async function loadPages(fetchImpl, origin, token, locale, path, isValid) {
  let page = 1;
  let lastPage = 1;
  const items = [];
  while (page <= lastPage) {
    const url = new URL(`/api/tarot${path}`, origin);
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", "50");
    const response = await requestJson(fetchImpl, url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": locale,
        "X-Platform": "site",
      },
    });
    const meta = response.body?.meta;
    if (response.status < 200 || response.status >= 300 || !Array.isArray(response.body?.data) || !response.body.data.every(isValid) ||
      !Number.isInteger(meta?.last_page) || meta.last_page < page || meta.current_page !== page) {
      throw new Error(`Invalid public catalog response (${response.status})`);
    }
    items.push(...response.body.data);
    lastPage = meta.last_page;
    page += 1;
  }
  return items;
}

export async function verifyPublicCatalog({ fetchImpl = fetch, origin } = {}) {
  const resolvedOrigin = origin ?? await environmentOrigin();
  const token = await publicToken(fetchImpl, resolvedOrigin);
  const catalog = {};
  for (const locale of LOCALES) {
    const categories = await loadPages(fetchImpl, resolvedOrigin, token, locale, "/category", isItem);
    const spreads = await loadPages(fetchImpl, resolvedOrigin, token, locale, "", isSpread);
    const spreadsByCategory = {};
    for (const category of categories) {
      spreadsByCategory[category.id] = await loadPages(fetchImpl, resolvedOrigin, token, locale, `?category_id=${encodeURIComponent(category.id)}`, isSpread);
    }
    catalog[locale] = { categories, spreads, spreadsByCategory };
  }
  return { token, catalog };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  verifyPublicCatalog().then(
    () => process.stdout.write("Public catalog verified.\n"),
    (error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; },
  );
}
