import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";
import { victory, balance, cardText } from "./card-description-fixtures.mjs";

const source = await readFile(new URL("../src/lib/tarot/readingSections.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { readingSections, adviceItems, cardReadingSections } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

test("unheaded card examples become populated design sections without changing their text", () => {
  for (const fixture of [...Object.values(victory), balance]) {
    assert.deepEqual(cardReadingSections(cardText(fixture)).map(({ key, text }) => [key, text]), Object.entries(fixture));
    const { quickRead, ...details } = fixture;
    assert.deepEqual(cardReadingSections(quickRead, Object.values(details).join(" ")).map(({ key, text }) => [key, text]), Object.entries(fixture));
  }
});

test("card sections preserve explicit structure, unknown prose and missing values", () => {
  assert.deepEqual(cardReadingSections(null, undefined), []);
  assert.deepEqual(cardReadingSections({ quickRead: "", fullDescription: { Impact: "Actual impact", Recognition: null } }).map(({ key, text }) => [key, text]), [["impact", "Actual impact"]]);
  assert.deepEqual(cardReadingSections("An unclassified observation.").map(({ key, text }) => [key, text]), [["fullDescription", "An unclassified observation."]]);
  assert.deepEqual(cardReadingSections([{ title: "Impact", text: "Focus on this exact backend wording." }]).map(({ key, text }) => [key, text]), [["impact", "Focus on this exact backend wording."]]);
  assert.deepEqual(cardReadingSections("Patience, balance, care.").map(({ key, text }) => [key, text]), [["quickRead", "Patience, balance, care."]]);
});

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

test("partial answers keep only populated sections and render unmarked advice as items in EN, UK and RU", () => {
  for (const [result, advice, first, second] of [
    ["Result", "Advice", "Write a one-page concept with your target customer, location type, menu focus, price range, and one concrete reason customers would choose you over nearby cafés; then obtain actual quotes for rent, equipment, suppliers, and staffing.", "Run a small-scale demand and margin test—for example, a pop-up, catering trial, market stall, or limited delivery menu—and compare sales, repeat interest, and unit margins against pre-set thresholds before signing a lease."],
    ["Результат", "Поради", "Складіть план і перевірте витрати.", "Перевірте попит перед орендою."],
    ["Итог", "Советы", "Составьте план и проверьте расходы.", "Проверьте спрос перед арендой."],
  ]) {
    const sections = readingSections(`${result}\n\nAn existing result.\nAnother paragraph.\n\n${advice}\n\n${first}\n${second}`);
    assert.deepEqual(sections.map(section => section.key), ["result", "advice"]);
    assert.deepEqual(adviceItems(sections[1].text), { intro: "", items: [first, second] });
    assert.deepEqual(adviceItems(`${first}\n\n${second}`), { intro: "", items: [first, second] });
  }
  assert.deepEqual(readingSections({ Result: null, Risks: [], Advice: [null, "", "   "] }), []);
  assert.deepEqual(adviceItems("A recommendation wrapped\nacross two lines."), { intro: "A recommendation wrapped\nacross two lines.", items: [] });
});
