import type { Locale } from "@/lang";
import { apiFetch } from "../api";
import { API_PLATFORM, REQUEST_TIMEOUT_MS } from "../config/constants";
import { BACKEND_ORIGIN } from "../config/env";

export type Speaker = { id: string; name: string; icon: string | null };
export type ReadingCard = {
  name: string | null; description: string | null; image: string;
  position: string; orientation: boolean | number | null;
};
export type Interpretation = {
  sections: { title: string; text: string }[];
  cards: { position: string; text: string }[];
};
export type Reading = {
  id: string; chat_id: string; question: string;
  tarot: { id: string; matrix: Record<string, [number, number]> };
  cards: ReadingCard[]; reading: Interpretation | null;
};
export class TarotError extends Error {
  constructor(message: string, public status = 0) { super(message); }
}
export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new TarotError("Invalid API response");
  return value as Record<string, unknown>;
}
export function apiId(value: unknown): string {
  if ((typeof value !== "string" && typeof value !== "number") || !/^\d+$/.test(String(value))) throw new TarotError("Invalid API ID");
  return String(value);
}
export function normalizeInterpretation(value: unknown): Interpretation | null {
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    const text = value.trim();
    if (!text) return null;
    try { return normalizeInterpretation(JSON.parse(text)); } catch {
      // Malformed structured payloads must not become a visible JSON answer.
      if (/^[{[]/.test(text)) throw new TarotError("Invalid interpretation");
      return { sections: [{ title: "", text }], cards: [] };
    }
  }
  const data = record(value);
  if (data.status === "error" || data.status === "failed") throw new TarotError("Generation failed");
  const sections = Array.isArray(data.interpretation) ? data.interpretation.map((item) => {
    const row = record(item);
    return { title: typeof row.title === "string" ? row.title : "", text: typeof row.text === "string" ? row.text : "" };
  }).filter((item) => item.text.trim()) : [];
  const cards = Array.isArray(data.cards) ? data.cards.map((item) => {
    const row = record(item);
    return { position: String(row.position), text: typeof row.text === "string" ? row.text : "" };
  }) : [];
  return sections.length ? { sections, cards } : null;
}
export function normalizeReading(value: unknown): Reading {
  const data = record(value), tarot = record(data.tarot), matrix = record(tarot.matrix);
  if (!Array.isArray(data.cards) || !data.cards.length) throw new TarotError("Reading has no cards");
  const coordinates: Reading["tarot"]["matrix"] = {};
  for (const [key, point] of Object.entries(matrix)) {
    if (!Array.isArray(point) || point.length !== 2 || !point.every((n) => typeof n === "number" && Number.isFinite(n))) throw new TarotError("Invalid spread matrix");
    coordinates[key] = [point[0], point[1]];
  }
  const cards = data.cards.map((item): ReadingCard => {
    const card = record(item), position = String(card.position);
    if (!Object.hasOwn(coordinates, position) || typeof card.image !== "string") throw new TarotError("Invalid card position");
    return { name: typeof card.name === "string" ? card.name : null,
      description: typeof card.description === "string" ? card.description : null,
      image: card.image, position,
      orientation: typeof card.orientation === "boolean" || typeof card.orientation === "number" ? card.orientation : null };
  });
  if (new Set(cards.map(c => c.position)).size !== cards.length || cards.length !== Object.keys(coordinates).length) throw new TarotError("Incomplete spread");
  return { id: apiId(data.id), chat_id: apiId(data.chat_id), question: String(data.question ?? ""),
    tarot: { id: apiId(tarot.id), matrix: coordinates }, cards, reading: normalizeInterpretation(data.reading) };
}
export async function tarotRequest(path: string, locale: Locale, init: RequestInit = {}): Promise<unknown> {
  const headers = new Headers(init.headers);
  headers.set("Accept-Language", locale); headers.set("X-Platform", API_PLATFORM);
  if (init.body) headers.set("Content-Type", "application/json");
  const signal = init.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)]) : AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const response = await apiFetch(path, { ...init, headers, signal });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const errors = body?.errors && Object.values(body.errors).flat().filter((v) => typeof v === "string").join(" ");
    throw new TarotError(errors || body?.message || `Request failed (${response.status})`, response.status);
  }
  return record(body).data;
}
export async function loadSpeakers(locale: Locale, signal: AbortSignal): Promise<Speaker[]> {
  const data = await tarotRequest("/tarot/speaker", locale, { signal });
  if (!Array.isArray(data) || !data.length) throw new TarotError("No speakers available");
  return data.map((value) => { const s = record(value); return { id: apiId(s.id), name: String(s.name), icon: typeof s.icon === "string" ? s.icon : null }; });
}
export function readingPayload(question: string, categoryId: string, spreadId: string, speakerId: string) {
  if (!question.trim()) throw new TarotError("Question is required");
  return { question: question.trim(), tarot_category_id: Number(apiId(categoryId)), tarot_id: Number(apiId(spreadId)), speaker_id: Number(apiId(speakerId)) };
}
export async function createReading(payload: ReturnType<typeof readingPayload>, locale: Locale, signal: AbortSignal) {
  return normalizeReading(await tarotRequest("/tarot", locale, { method: "POST", body: JSON.stringify(payload), signal }));
}
export async function fetchReading(id: string, locale: Locale, signal: AbortSignal) {
  return normalizeReading(await tarotRequest(`/tarot/reading/${apiId(id)}`, locale, { signal }));
}
/** Never forward authorization to a URL supplied by an event without validating it. */
export function messagePath(value: unknown, chatId: string): string | null {
  if (typeof value !== "string") return null;
  let url: URL;
  try { url = new URL(value, `${BACKEND_ORIGIN}/api/`); } catch { return null; }
  if (url.origin !== BACKEND_ORIGIN || url.search || url.hash || url.username || url.password) return null;
  const path = url.pathname.replace(/^\/api(?=\/)/, "");
  return new RegExp(`^/chat/${apiId(chatId)}/message/\\d+$`).test(path) ? path : null;
}
