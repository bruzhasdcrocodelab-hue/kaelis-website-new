import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/analytics.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
});
const loaded = { exports: {} };
new Function("require", "module", "exports", outputText)(
  name => name === "./routing" ? {
    routeFromPath: () => ({ locale: "uk", kind: "category", path: ["love", "between-us"] }),
  } : undefined,
  loaded,
  loaded.exports,
);

test("analytics sends sanitized route and tarot funnel events", () => {
  const calls = [];
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  globalThis.window = {
    location: {
      origin: "https://kaelisai.com",
      pathname: "/ua/tarot/love/between-us",
      search: "?utm_source=instagram&utm_campaign=launch&question=private",
    },
    gtag: (...args) => calls.push(args),
  };
  globalThis.document = { title: "Tarot", referrer: "https://example.com/path?email=private" };
  try {
    loaded.exports.trackRoute("/ua/tarot/love/between-us");
    loaded.exports.trackEvent("tarot_question_submit", {
      locale: "uk",
      category_id: "7",
      spread_id: "12",
    });
    assert.deepEqual(calls, [
      ["event", "page_view", {
        page_title: "Tarot",
        page_referrer: "https://example.com",
        page_location: "https://kaelisai.com/ua/tarot/love/between-us?utm_source=instagram&utm_campaign=launch",
      }],
      ["event", "view_tarot_spread", {
        locale: "uk",
        category_slug: "love",
        spread_slug: "between-us",
        page_location: "https://kaelisai.com/ua/tarot/love/between-us?utm_source=instagram&utm_campaign=launch",
      }],
      ["event", "tarot_question_submit", {
        locale: "uk",
        category_id: "7",
        spread_id: "12",
        page_location: "https://kaelisai.com/ua/tarot/love/between-us?utm_source=instagram&utm_campaign=launch",
      }],
    ]);
    assert.equal(JSON.stringify(calls).includes("private"), false);
    assert.equal(JSON.stringify(calls).includes("question_text"), false);
  } finally {
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
  }
});
