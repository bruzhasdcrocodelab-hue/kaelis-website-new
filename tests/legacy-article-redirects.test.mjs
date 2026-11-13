import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/legacyArticleRedirects.ts", import.meta.url), "utf8");
const seoContent = JSON.parse(await readFile(new URL("../src/lib/seo/content.json", import.meta.url), "utf8"));
const output = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const redirects = await import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);

test("every legacy Sanity article URL redirects to a localized canonical tarot route", () => {
  const entries = Object.entries(redirects.legacyArticleRedirects);
  assert.equal(entries.length, 216);
  for (const [sourcePath, destination] of entries) {
    assert.match(sourcePath, /^\/(?:(?:en|ru|ua)\/)?articles\/.+-(en|ru|ua)$/);
    assert.match(destination, /^\/(en|ru|ua)\/tarot(?:\/[a-z0-9-]+){1,2}$/);
    const [, locale, path] = destination.match(/^\/(en|ru|ua)(\/tarot(?:\/[a-z0-9-]+){1,2})$/);
    assert.ok(seoContent[locale === "ua" ? "uk" : locale][path], destination);
  }
  assert.equal(redirects.legacyArticleRedirects["/articles/top-5-tarot-spreads-for-love-readings-en"], "/en/tarot/love");
  assert.equal(redirects.legacyArticleRedirects["/en/articles/top-5-tarot-spreads-for-love-readings-en"], "/en/tarot/love");
  assert.equal(redirects.legacyArticleRedirects["/en/articles/how-to-use-the-celtic-cross-spread-for-deep-insight-ua"], "/en/tarot/answer/celtic-cross");
  assert.equal(redirects.legacyArticleRedirects["/ru/articles/how-to-use-the-celtic-cross-spread-for-deep-insight-en"], "/ru/tarot/answer/celtic-cross");
  assert.equal(redirects.legacyArticleRedirects["/articles/how-to-use-the-celtic-cross-spread-for-deep-insight-ru"], "/ru/tarot/answer/celtic-cross");
  assert.equal(redirects.legacyArticleRedirects["/articles/unlocking-your-life-path-the-power-of-numerology-ua"], "/ua/tarot/soul-path/whats-inside");
});
