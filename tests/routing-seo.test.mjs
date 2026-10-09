import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { routing, seoContent } from "./routing-fixture.mjs";

test("localized links preserve logical pages, query, hash and backend language", () => {
  for (const [locale, prefix] of [["en", "en"], ["ru", "ru"], ["uk", "ua"]]) {
    assert.equal(routing.localizedHref(locale), `/${prefix}`);
    assert.equal(routing.localizedHref(locale, "/categories/personality/state?q=1#reading"), `/${prefix}/tarot/personality/state?q=1#reading`);
    assert.equal(routing.localizedHref(locale, "/en/policy/terms-of-use-en"), `/${prefix}/policy/terms-of-use-${prefix}`);
    assert.equal(routing.localizedHref(locale, "/#top-block"), `/${prefix}#top-block`);
    assert.equal(routing.routeFromPath(`/${prefix}/tarot/personality/state`).locale, locale);
    assert.equal(routing.localizedHref(locale, "https://example.com"), "https://example.com");
  }
});

test("locale detection follows the reference cookie, weighted header, then English default", () => {
  assert.equal(routing.negotiateLocale("ua", "ru,en;q=0.8"), "ua");
  assert.equal(routing.negotiateLocale(undefined, "fr;q=1,ru-RU;q=0.9,en;q=0.8"), "ru");
  assert.equal(routing.negotiateLocale("invalid", "ru;q=0,en;q=0.4"), "en");
  assert.equal(routing.negotiateLocale(undefined, "invalid;q=oops"), "en");
  assert.equal(routing.routeFromPath("/en/tarot/a/b/c"), null);
  assert.equal(routing.routeFromPath("/en/policy/terms-of-use-ru"), null);
});

test("every spreadsheet row has exact English metadata and separate complete translations", async () => {
  const source = JSON.parse(await readFile(new URL("../src/lib/seo/source.json", import.meta.url), "utf8"));
  const seen = new Set();
  for (const [url, title = "", description = "", h1] of source.slice(2)) {
    const path = new URL(url).pathname.replace(/^\/en/, "") || "/";
    assert.equal(seen.has(path), false);
    seen.add(path);
    assert.equal(seoContent.en[path].title, title);
    assert.equal(seoContent.en[path].description, description);
    assert.equal(seoContent.en[path].h1, h1?.trim());
    for (const locale of ["ru", "uk"]) {
      const entry = seoContent[locale][path];
      assert.ok(entry, `${locale}: ${path}`);
      assert.match(entry.description, /[а-яіїєґ]/i);
      assert.doesNotMatch(JSON.stringify(entry), /\?{2}|undefined|\uFFFD/);
      if (path !== "/") {
        assert.ok(entry.h1);
        assert.equal(entry.title, `${entry.h1} | Kaelis`);
      } else assert.equal(entry.title, "");
    }
  }
});
