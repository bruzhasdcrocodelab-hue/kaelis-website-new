import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { routing, seo, seoContent } from "./routing-fixture.mjs";

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

test("only known canonical tarot paths resolve and locale paths redirect to canonical URL locales", () => {
  assert.equal(seo.resolveTarotSeo("ru", ["dreams"])?.path, "/tarot/dreams");
  assert.equal(seo.resolveTarotSeo("ru", ["dreams-xyz"]), undefined);
  assert.equal(seo.resolveTarotSeo("ru", ["personality", "state", "extra"]), undefined);
  assert.equal(seo.resolveTarotSeo("ru", ["DREAMS"]), undefined);
  assert.equal(routing.lowercaseKnownLocalePathname("/ru/tarot/DREAMS"), "/ru/tarot/dreams");
  assert.equal(routing.lowercaseKnownLocalePathname("/RU/tarot/DREAMS"), "/ru/tarot/dreams");
  assert.equal(routing.lowercaseKnownLocalePathname("/UK/tarot/DREAMS"), "/ua/tarot/dreams");
  assert.equal(routing.isUnsupportedLocalePrefix("es"), true);
  assert.equal(routing.isUnsupportedLocalePrefix("pt-BR"), true);
  assert.equal(routing.isUnsupportedLocalePrefix("tarot"), false);
  assert.equal(routing.isUnsupportedLocalePrefix("uk"), false);
});

test("every spreadsheet row has exact English metadata and separate complete translations", async () => {
  const source = JSON.parse(await readFile(new URL("../src/lib/seo/source.json", import.meta.url), "utf8"));
  const seen = new Set();
  for (const [url, title = "", description = "", h1] of source.slice(2)) {
    const path = new URL(url).pathname.replace(/^\/en/, "") || "/";
    assert.equal(seen.has(path), false);
    seen.add(path);
    if (path === "/tarot/dreams") {
      assert.equal(seoContent.en[path].title, "AI Dream Interpreter Online — Tarot Dream Meanings | Kaelis");
      assert.equal(seoContent.en[path].description, "Describe your dream — Kaelis AI will do a Tarot reading and explain its meaning. Free, online, no registration.");
      assert.equal(seoContent.en[path].h1, "Interpret Dreams with Tarot and Artificial Intelligence");
    } else {
      assert.equal(seoContent.en[path].title, path === "/" ? "Kaelis — Your AI Guide to Tarot" : title);
      assert.equal(seoContent.en[path].description, description);
      assert.equal(seoContent.en[path].h1, h1?.trim());
    }
    for (const locale of ["ru", "uk"]) {
      const entry = seoContent[locale][path];
      assert.ok(entry, `${locale}: ${path}`);
      assert.match(entry.description, /[а-яіїєґ]/i);
      assert.doesNotMatch(JSON.stringify(entry), /\?{2}|undefined|\uFFFD/);
      if (path !== "/" && path !== "/tarot/dreams") {
        assert.ok(entry.h1);
        assert.equal(entry.title, `${entry.h1} | Kaelis`);
      } else assert.ok(entry.title.trim());
    }
  }
});

test("metadata uses localized SEO fields, a shared OG image, and safe limits", () => {
  const metadata = seo.pageMetadata("ru", "/tarot/dreams");
  assert.equal(metadata.title.absolute, "Сонник ИИ онлайн — толкование снов по картам Таро | Kaelis");
  assert.equal(metadata.description, "Опишите сон — нейросеть Kaelis сделает расклад Таро и расшифрует его значение. Бесплатно, онлайн, без регистрации.");
  assert.equal(metadata.openGraph.locale, "ru_RU");
  assert.equal(metadata.openGraph.images[0].url, "/images/seo/og-placeholder-1200x630.png");
  assert.equal(metadata.twitter.card, "summary_large_image");
  assert.ok(metadata.title.absolute.length <= 60);
  assert.ok(metadata.description.length <= 160);

  for (const locale of ["en", "ru", "uk"]) {
    for (const path of Object.keys(seoContent[locale])) {
      const current = seo.pageMetadata(locale, path);
      assert.ok(current.title.absolute.length <= 60, `${locale}: ${path}`);
      assert.ok(current.description.length <= 160, `${locale}: ${path}`);
      assert.doesNotMatch(current.description, /\p{Extended_Pictographic}/u, `${locale}: ${path}`);
    }
  }
});
