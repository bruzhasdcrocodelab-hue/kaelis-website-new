import "server-only";
import { request } from "node:https";
import type { Locale } from "@/lang";
import { BACKEND_ORIGIN } from "@/lib/config/env";
import { API_PLATFORM, REQUEST_TIMEOUT_MS } from "@/lib/config/constants";
import type { TarotCategory, TarotSpread } from "./catalog";

type ApiResponse = { status: number; body: unknown };

function requestJson(url: URL, method: "GET" | "POST", headers: Record<string, string>): Promise<ApiResponse> {
  return new Promise((resolve, reject) => {
    const operation = request(url, { method, headers }, (response) => {
      let raw = "";
      response.setEncoding("utf8");
      response.on("data", (chunk: string) => { raw += chunk; });
      response.once("end", () => {
        try {
          resolve({ status: response.statusCode ?? 500, body: JSON.parse(raw) });
        } catch {
          resolve({ status: response.statusCode ?? 500, body: null });
        }
      });
    });
    const timeout = setTimeout(() => operation.destroy(new Error("Public catalog request timed out")), REQUEST_TIMEOUT_MS);
    operation.once("error", reject);
    operation.once("close", () => clearTimeout(timeout));
    operation.end();
  });
}

function isItem(value: unknown): value is Omit<TarotCategory, "id"> & { id: string | number } {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return ((typeof item.id === "string" && !!item.id.trim()) || (typeof item.id === "number" && Number.isSafeInteger(item.id))) &&
    typeof item.slug === "string" && !!item.slug && !/[/?#\\]/.test(item.slug) &&
    typeof item.name === "string" && typeof item.site_description === "string" &&
    (item.image === null || typeof item.image === "string") && typeof item.need_new_plan === "boolean";
}

async function publicToken(): Promise<string> {
  const response = await requestJson(new URL("/api/user/anonymous", BACKEND_ORIGIN), "POST", { Accept: "application/json" });
  const body = response.body as { data?: { token_type?: unknown; access_token?: unknown } } | null;
  if (response.status < 200 || response.status >= 300 || body?.data?.token_type !== "Bearer" || typeof body?.data?.access_token !== "string" || !body.data.access_token.trim()) {
    throw new Error("Public catalog authorization failed");
  }
  return body.data.access_token;
}

async function loadPages<T>(locale: Locale, path: string, token: string, isValid: (item: unknown) => boolean): Promise<T[]> {
  const items: T[] = [];
  let lastPage = 1;
  for (let page = 1; page <= lastPage; page++) {
    const url = new URL(`/api/tarot${path}`, BACKEND_ORIGIN);
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", "50");
    const response = await requestJson(url, "GET", { Accept: "application/json", Authorization: `Bearer ${token}`, "Accept-Language": locale, "X-Platform": API_PLATFORM });
    const body = response.body as { data?: unknown; meta?: { last_page?: unknown; current_page?: unknown } } | null;
    const meta = body?.meta;
    if (response.status < 200 || response.status >= 300 || !Array.isArray(body?.data) || !body.data.every(isValid) ||
      typeof meta?.last_page !== "number" || !Number.isInteger(meta.last_page) || meta.last_page < page || meta.current_page !== page) {
      throw new Error("Invalid public catalog response");
    }
    lastPage = meta.last_page;
    items.push(...body.data.map((item: { id: string | number }) => ({ ...item, id: String(item.id) }) as T));
  }
  return items;
}

function isSpread(value: unknown): value is TarotSpread {
  return isItem(value) && typeof (value as TarotSpread).description === "string" &&
    !!(value as TarotSpread).matrix && typeof (value as TarotSpread).matrix === "object" && !Array.isArray((value as TarotSpread).matrix);
}

export async function loadPublicCategories(locale: Locale): Promise<TarotCategory[]> {
  return loadPages<TarotCategory>(locale, "/category", await publicToken(), isItem);
}

export async function loadPublicSpreads(locale: Locale, categoryId?: string | null): Promise<TarotSpread[]> {
  const query = categoryId === undefined ? "" : categoryId === null ? "" : `&category_id=${encodeURIComponent(categoryId)}`;
  return loadPages<TarotSpread>(locale, `?${query.slice(1)}`, await publicToken(), isSpread);
}

export async function loadPublicTarotCatalog(locale: Locale): Promise<{ categories: TarotCategory[]; spreadsByCategory: Record<string, TarotSpread[]> }> {
  const token = await publicToken();
  const categories = await loadPages<TarotCategory>(locale, "/category", token, isItem);
  const spreads = await Promise.all(categories.map(async (category) => [
    category.id,
    await loadPages<TarotSpread>(locale, `?category_id=${encodeURIComponent(category.id)}`, token, isSpread),
  ] as const));
  return { categories, spreadsByCategory: Object.fromEntries(spreads) };
}
