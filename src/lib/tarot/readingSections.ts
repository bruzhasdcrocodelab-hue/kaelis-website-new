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
    if (content && typeof content === "object" && !Array.isArray(content)) return readingSections(content);
    const text = typeof content === "string" ? content : Array.isArray(content)
      ? content.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map((item, i) => `${i + 1}. ${item.trim()}`).join("\n") : "";
    return text.trim() ? [{ key, title, text: text.trim() }] : [];
  });
}

const sentences = (text: string) => [...new Intl.Segmenter(undefined, { granularity: "sentence" }).segment(text.replace(/\s*\n\s*/g, " "))]
  .map(({ segment }) => segment.trim()).filter(Boolean);
const paragraphs = (text: string) => text.replace(/\r\n?/g, "\n").split(/\n+/).map(part => part.trim()).filter(Boolean);

export function cardReadingSections(description: unknown, interpretation?: unknown): ReadingSection[] {
  const source = [...readingSections(description), ...readingSections(interpretation)];
  const result: ReadingSection[] = [];
  const detailKeys: SectionKey[] = ["impact", "recognition", "focus"];
  const explicitDetails = source.some(section => detailKeys.includes(section.key as SectionKey));
  let sentenceIndex = 0;
  for (const section of source) {
    if ((section.key && section.key !== "fullDescription") || (!section.key && section.title)) {
      result.push(section);
      continue;
    }
    const parts = section.text.split(/\n\s*\n/).map(text => text.trim()).filter(Boolean);
    if (!section.key && !result.some(item => item.key === "quickRead") && parts.length) {
      const first = parts[0];
      const summary = first.length <= 240 && (/(?:\breversed\b|перевернут\p{L}*|перевёрнут\p{L}*|обернен\p{L}*)/iu.test(first) ||
        (first.split(/\s+/).length <= 22 && (first.match(/[,;]/g)?.length ?? 0) >= 2));
      if (summary) result.push({ key: "quickRead", title: "", text: parts.shift()! });
    }
    if (explicitDetails) {
      if (parts.length) result.push({ ...section, key: "fullDescription", text: parts.join("\n\n") });
      continue;
    }
    for (const text of sentences(parts.join("\n\n"))) {
      const key = detailKeys[Math.min(sentenceIndex++, detailKeys.length - 1)];
      const existing = result.find(item => item.key === key);
      if (existing) existing.text += ` ${text}`;
      else result.push({ key, title: "", text });
    }
  }
  return result;
}

export function interpretationSections(value: unknown): ReadingSection[] {
  const sections = readingSections(value);
  if (sections.some(section => section.key === "why" || section.key === "risks")) return sections;
  return sections.flatMap(section => {
    if (section.key !== "result" && (section.key || section.title)) return [section];
    const parts = paragraphs(section.text);
    const keys: SectionKey[] = ["result", "why", "risks"];
    const bodies = [parts[0], parts.slice(1, -1).join("\n\n"), parts.length > 1 ? parts.at(-1) : undefined];
    return keys.flatMap((key, index) => {
      const text = bodies[index];
      return text ? [{ key, title: "", text }] : [];
    });
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
  if (!items.length) {
    const paragraphs = intro.trim().split(/\n\s*\n/).map(item => item.trim()).filter(Boolean);
    if (paragraphs.length > 1) return { intro: "", items: paragraphs };
    const separateLines = intro.trim().split("\n").map(item => item.trim()).filter(Boolean);
    if (separateLines.length > 1 && separateLines.every(line => /[.!?。！？]["'»”’)]?$/.test(line))) return { intro: "", items: separateLines };
    return { intro: "", items: sentences(intro) };
  }
  return { intro: intro.trim(), items: items.map(item => item.trim()).filter(Boolean) };
}
