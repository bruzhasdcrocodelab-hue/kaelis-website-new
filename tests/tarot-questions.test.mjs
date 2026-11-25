import { bindEnv } from "./env-fixture.mjs";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(ts.transpileModule(bindEnv(source), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText).toString("base64")}`;
let calls = [];
globalThis.__tarotFetch = async (path, init) => {
  calls.push({ path, init });
  return Response.json({ data: [{ id: 1, tarot_id: 2, tarot_category_id: 3, text: "Question" }] });
};
const readingSource = (await readFile(new URL("../src/lib/tarot/reading.ts", import.meta.url), "utf8")).replace('import { apiFetch } from "../api";', 'const apiFetch = (...args) => globalThis.__tarotFetch(...args);');
const readingUrl = moduleUrl(readingSource);
const questionsSource = (await readFile(new URL("../src/lib/tarot/questions.ts", import.meta.url), "utf8")).replace('"./reading"', JSON.stringify(readingUrl));
const questions = await import(moduleUrl(questionsSource));

test("loads localized preset questions for a category", async () => {
  calls = [];
  const items = await questions.loadPresetQuestions("uk", { categoryId: "3" }, new AbortController().signal);
  assert.equal(calls[0].path, "/tarot/questions?category_id=3");
  assert.equal(calls[0].init.headers.get("Accept-Language"), "uk");
  assert.equal(items.length, 1);
});

test("loads localized preset questions for a spread", async () => {
  calls = [];
  await questions.loadPresetQuestions("ru", { spreadId: "2" }, new AbortController().signal);
  assert.equal(calls[0].path, "/tarot/questions?tarot_id=2");
  assert.equal(calls[0].init.headers.get("Accept-Language"), "ru");
});
