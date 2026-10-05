export type SectionKey = "quickRead" | "fullDescription" | "impact" | "recognition" | "focus" | "result" | "why" | "risks" | "advice";
export type ReadingSection = { key: SectionKey | null; title: string; text: string };

const aliases: Record<SectionKey, string[]> = {
  quickRead: ["Quick read", "Quick reading", "Summary", "Кратко", "Краткое описание", "Краткое толкование", "Краткое прочтение", "Коротко", "Короткий опис", "Коротке тлумачення", "Коротке прочитання"],
  fullDescription: ["Full Description", "Description", "Полное описание", "Подробное описание", "Описание", "Повний опис", "Детальний опис", "Опис"],
  impact: ["Impact", "Influence", "Влияние", "Воздействие", "Вплив"],
  recognition: ["Recognition", "Признание", "Признання", "Визнання"],
  focus: ["Focus", "Фокус", "Акцент", "На чем сосредоточиться", "На чому зосередитися"],
  result: ["Result", "Outcome", "Результат", "Итог", "Вывод", "Підсумок", "Висновок"],
  why: ["Why these cards", "Why these cards?", "Почему эти карты", "Почему именно эти карты", "Чому ці карти", "Чому саме ці карти"],
  risks: ["Risks", "Risk", "Риски", "Риск", "Ризики", "Ризик"],
  advice: ["Advice", "Recommendations", "Совет", "Советы", "Рекомендации", "Порада", "Поради", "Рекомендації"],
};

const normalize = (text: string) => text.normalize("NFKC").toLowerCase().replace(/ё/g, "е").replace(/[^\p{L}\p{N}]/gu, "");
const keys = new Map(Object.entries(aliases).flatMap(([key, values]) => [key, ...values].map(value => [normalize(value), key as SectionKey] as const)));
const cleanTitle = (text: string) => text.trim().replace(/^\s*(?:#{1,6}\s*|\d+[.)]\s*)/, "").replace(/[*_`]/g, "").replace(/[:：\s]+$/, "").trim();
const sectionKey = (title: string) => keys.get(normalize(cleanTitle(title))) ?? null;

function parseText(text: string): ReadingSection[] {
  const result: ReadingSection[] = [];
  let section: ReadingSection = { key: null, title: "", text: "" };
  const flush = () => { if (section.text.trim()) result.push({ ...section, text: section.text.trim() }); };
  for (const line of text.replace(/\r\n?/g, "\n").split("\n")) {
    const colon = line.search(/[:：]/);
    const title = cleanTitle(colon < 0 ? line : line.slice(0, colon));
    const key = sectionKey(title);
    if (key) {
      flush();
      section = { key, title, text: colon < 0 ? "" : line.slice(colon + 1).replace(/^\s*\*{1,2}(?=\s|$)/, "").trim() };
    } else {
      section.text += `${section.text ? "\n" : ""}${line}`;
    }
  }
  flush();
  return result;
}

export function readingSections(value: unknown): ReadingSection[] {
  if (typeof value === "string") {
    const text = value.trim();
    if (!text) return [];
    if (/^[\[{]/.test(text)) {
      try { return readingSections(JSON.parse(text)); } catch { return parseText(text); }
    }
    return parseText(text);
  }
  if (Array.isArray(value)) return value.flatMap(readingSections);
  if (!value || typeof value !== "object") return [];
  const data = value as Record<string, unknown>;
  if (typeof data.text === "string") {
    const title = typeof data.title === "string" ? cleanTitle(data.title) : "";
    if (title) return data.text.trim() ? [{ key: sectionKey(title), title, text: data.text.trim() }] : [];
    return parseText(data.text);
  }
  return Object.entries(data).flatMap(([title, content]) => {
    const key = sectionKey(title);
    if (!key) return [];
    const text = typeof content === "string" ? content : Array.isArray(content)
      ? content.filter((item): item is string => typeof item === "string").map((item, i) => `${i + 1}. ${item}`).join("\n") : "";
    return text.trim() ? [{ key, title, text: text.trim() }] : [];
  });
}

export function adviceItems(text: string): { intro: string; items: string[] } {
  const lines = text.replace(/\r\n?/g, "\n").split("\n").flatMap(line =>
    /^\s*\d+[.)]\s+/.test(line) ? line.replace(/\s+(?=\d+[.)]\s+)/g, "\n").split("\n") : [line]);
  const items: string[] = [];
  let intro = "";
  for (const line of lines) {
    const match = /^\s*(?:[-*•–]\s+|\d+[.)]\s+)(.+)/.exec(line);
    if (match) items.push(match[1].trim());
    else if (items.length) items[items.length - 1] += `\n${line}`;
    else intro += `${intro ? "\n" : ""}${line}`;
  }
  return { intro: intro.trim(), items: items.map(item => item.trim()).filter(Boolean) };
}
