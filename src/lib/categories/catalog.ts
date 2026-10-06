import type { Locale } from "@/lang";
import { apiFetch } from "../api";
import { API_PLATFORM, REQUEST_TIMEOUT_MS } from "../config/constants";

export interface TarotCategory {
  id: string;
  slug: string;
  name: string;
  site_description: string;
  image: string | null;
  need_new_plan: boolean;
}

export interface TarotSpread extends TarotCategory {
  description: string;
  matrix: Record<string, unknown>;
}

export type CatalogState<T> =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; data: T[] };

export const INITIAL_STATE = { status: "loading" } as const;

function isItem(value: unknown): value is Omit<TarotCategory, "id"> & { id: string | number } {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return ((typeof item.id === "string" && !!item.id.trim()) || (typeof item.id === "number" && Number.isSafeInteger(item.id))) &&
    typeof item.slug === "string" && !!item.slug && !/[/?#\\]/.test(item.slug) &&
    typeof item.name === "string" && typeof item.site_description === "string" &&
    (item.image === null || typeof item.image === "string") &&
    typeof item.need_new_plan === "boolean";
}

/** Fetch every page locally; never follow absolute paginator URLs with a token. */
// undefined loads categories; null loads all spreads without a category filter.
export async function loadCatalog(locale: Locale, categoryId?: string | null): Promise<TarotCategory[] | TarotSpread[]> {
  const items: TarotCategory[] = [];
  let lastPage = 1;
  for (let page = 1; page <= lastPage; page++) {
    const query = new URLSearchParams({ page: String(page), per_page: "50" });
    if (typeof categoryId === "string") query.set("category_id", categoryId);
    const response = await apiFetch(`${categoryId === undefined ? "/tarot/category" : "/tarot"}?${query}`, {
      headers: { "Accept-Language": locale, "X-Platform": API_PLATFORM },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
    const body = await response.json();
    if (!Array.isArray(body?.data) || !body.data.every((item: unknown) =>
      isItem(item) && (categoryId === undefined || typeof (item as TarotSpread).description === "string")) ||
      !Number.isInteger(body?.meta?.last_page) || body.meta.last_page < page ||
      body.meta.current_page !== page) {
      throw new Error("Invalid catalog response");
    }
    lastPage = body.meta.last_page;
    // The live API returns numeric IDs although OpenAPI declares strings.
    items.push(...body.data.map((item: TarotCategory) => ({ ...item, id: String(item.id) })));
  }
  return items;
}

/** One store per locale/provider: shared requests, no cross-language responses. */
export function createCatalogStore(locale: Locale) {
  const states = new Map<string, CatalogState<TarotCategory | TarotSpread>>();
  const pending = new Map<string, Promise<void>>();
  const listeners = new Set<() => void>();
  const keyFor = (categoryId?: string | null) => categoryId === undefined ? "categories" : categoryId === null ? "all-spreads" : `spreads:${categoryId}`;
  const publish = () => listeners.forEach((listener) => listener());
  return {
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    getSnapshot(categoryId?: string | null) { return states.get(keyFor(categoryId)) ?? INITIAL_STATE; },
    load(categoryId?: string | null, retry = false): Promise<void> {
      const key = keyFor(categoryId);
      const running = pending.get(key);
      if (running) return running;
      if (!retry && states.has(key)) return Promise.resolve();
      states.set(key, INITIAL_STATE);
      const request = loadCatalog(locale, categoryId).then(
        (data) => { states.set(key, { status: "success", data }); },
        () => { states.set(key, { status: "error" }); },
      ).finally(() => { pending.delete(key); publish(); });
      pending.set(key, request);
      publish();
      return request;
    },
  };
}

export function cardCount(spread: TarotSpread): number | null {
  if (!spread.matrix || typeof spread.matrix !== "object" || Array.isArray(spread.matrix)) return null;
  const positions = Object.values(spread.matrix);
  return positions.length > 0 && positions.every((position) =>
    Array.isArray(position) && position.length === 2 && position.every((n) => typeof n === "number" && Number.isFinite(n)))
    ? positions.length : null;
}

export function categoryHref(slug: string) { return `/categories/${encodeURIComponent(slug)}`; }
export function spreadHref(categorySlug: string, spreadSlug: string) {
  return `${categoryHref(categorySlug)}/${encodeURIComponent(spreadSlug)}`;
}

const DEFAULT_SPREADS: Readonly<Record<string, string>> = {
  dreams: "dream",
  personality: "celtic-cross",
  education: "opportunities",
  trips: "trip",
  health: "health",
  decision: "decision",
  hidden: "secret",
  forecast: "prediction",
  "soul-path": "whats-inside",
  love: "celtic-cross",
  work: "my-job",
  family: "celtic-cross",
  money: "celtic-cross",
  answer: "triplet",
};

export function defaultSpreadSlug(categorySlug: string, spreads: TarotSpread[]): string | undefined {
  if (Object.hasOwn(DEFAULT_SPREADS, categorySlug)) return DEFAULT_SPREADS[categorySlug];
  return spreads.length === 1 ? spreads[0].slug : spreads.length > 1 ? "triplet" : undefined;
}

export function resolveCatalogPath(categories: TarotCategory[], spreads: TarotSpread[], path: string[], defaultSpread?: TarotSpread) {
  if (path.length < 1 || path.length > 2) return null;
  const category = categories.find((item) => item.slug === path[0]);
  if (!category) return null;
  const slug = path.length === 2 ? path[1] : defaultSpreadSlug(category.slug, spreads);
  const spread = spreads.find((item) => item.slug === slug)
    ?? (path.length === 1 && slug !== undefined && defaultSpread?.slug === slug ? defaultSpread : undefined);
  if (path.length === 2 && !spread) return null;
  return { category, spread };
}
