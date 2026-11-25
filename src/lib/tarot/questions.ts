import type { Locale } from "@/lang";
import { TarotError, apiId, record, tarotRequest } from "./reading";

export type PresetQuestion = {
  id: string;
  tarotId: string;
  categoryId: string;
  text: string;
};

export type PresetQuestionScope = { categoryId: string } | { spreadId: string };

export async function loadPresetQuestions(locale: Locale, scope: PresetQuestionScope, signal: AbortSignal): Promise<PresetQuestion[]> {
  const query = "categoryId" in scope
    ? new URLSearchParams({ category_id: apiId(scope.categoryId) })
    : new URLSearchParams({ tarot_id: apiId(scope.spreadId) });
  const data = await tarotRequest(`/tarot/questions?${query}`, locale, { signal });
  if (!Array.isArray(data)) throw new TarotError("Invalid preset questions response");
  return data.map((value) => {
    const row = record(value);
    const text = typeof row.text === "string" ? row.text.trim() : "";
    if (!text) throw new TarotError("Invalid preset question");
    return {
      id: apiId(row.id),
      tarotId: apiId(row.tarot_id),
      categoryId: apiId(row.tarot_category_id),
      text,
    };
  });
}
