import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/tarot/readingSections.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { readingSections, adviceItems } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

test("recognizes EN, UK and RU headings independently of UI locale", () => {
  for (const headings of [
    ["Quick read", "Full Description", "Impact", "Recognition", "Focus", "Result", "Why these cards", "Risks", "Advice"],
    ["Коротко", "Повний опис", "Вплив", "Визнання", "Фокус", "Результат", "Чому ці карти", "Ризики", "Поради"],
    ["Кратко", "Полное описание", "Влияние", "Признание", "Фокус", "Итог", "Почему эти карты", "Риски", "Советы"],
  ]) {
    const sections = readingSections(headings.map((heading, index) => `## **${heading}:**\r\nContent ${index}`).join("\r\n\r\n"));
    assert.deepEqual(sections.map(section => section.key), ["quickRead", "fullDescription", "impact", "recognition", "focus", "result", "why", "risks", "advice"]);
    assert.deepEqual(sections.map(section => section.text), headings.map((_, index) => `Content ${index}`));
  }
});

test("uses structured sections without reparsing their bodies", () => {
  const body = "Risks: this is a sentence within a structured result.";
  assert.deepEqual(readingSections([{ title: "Результат", text: body }]), [{ key: "result", title: "Результат", text: body }]);
  assert.equal(readingSections(JSON.stringify({ Impact: "Personal impact", Advice: ["One", "Two"] }))[0].key, "impact");
  assert.equal(readingSections([{ title: "Unknown heading", text: "Keep this" }])[0].title, "Unknown heading");
});

test("omits empty sections and preserves unknown plain text", () => {
  for (const value of [undefined, null, "", "  ", [], {}, { title: "Risks", text: " " }]) assert.deepEqual(readingSections(value), []);
  assert.deepEqual(readingSections("A complete ordinary paragraph."), [{ key: null, title: "", text: "A complete ordinary paragraph." }]);
  assert.deepEqual(readingSections("Result:\n\nRisks:\nRisk text\nAdvice:"), [{ key: "risks", title: "Risks", text: "Risk text" }]);
  assert.equal(readingSections("Focus on the future.\nKeep going.").length, 1);
  assert.equal(readingSections("{invalid json")[0].text, "{invalid json");
});

test("handles headings with numbering, inline bodies and Unicode punctuation", () => {
  assert.deepEqual(readingSections("1. **Влияние:** Текст\n2) Фокус： Дальше").map(section => [section.key, section.text]), [["impact", "Текст"], ["focus", "Дальше"]]);
});

test("advice preserves introductory text, multiline items and ordinary paragraphs", () => {
  assert.deepEqual(adviceItems("Start here.\n1. First\ncontinued\n2) Second"), { intro: "Start here.", items: ["First\ncontinued", "Second"] });
  assert.deepEqual(adviceItems("• Один\n• Два"), { intro: "", items: ["Один", "Два"] });
  assert.deepEqual(adviceItems("1. First 2. Second"), { intro: "", items: ["First", "Second"] });
  assert.deepEqual(adviceItems("An ordinary recommendation."), { intro: "An ordinary recommendation.", items: [] });
  assert.deepEqual(adviceItems("Plan for 2026. Review the budget."), { intro: "Plan for 2026. Review the budget.", items: [] });
});
