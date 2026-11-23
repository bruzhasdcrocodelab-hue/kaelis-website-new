import { routing, seoContent } from "./routing-fixture.mjs";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { constants } from "./env-fixture.mjs";

const require = createRequire(import.meta.url);
async function loadComponent(path, dependencies) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  });
  const loaded = { exports: {} };
  new Function("require", "module", "exports", outputText)(
    name => Object.hasOwn(dependencies, name) ? dependencies[name] : require(name), loaded, loaded.exports,
  );
  return loaded.exports;
}

const marker = name => function Marker() { return createElement("div", { "data-component": name }); };
const hero = (await loadComponent("../src/components/categories-page/CategoryHeroSection/CategoryHeroSection.tsx", {
  "@/lib/seo": { getSeo: (locale, path) => seoContent[locale][path] },
  "next/navigation": { useRouter: () => ({ replace() {} }) },
  "@/components/global/MainButton": ({ children }) => createElement("button", null, children),
  "@/components/categories-page/SubcategoryRing": marker("ring"),
  "./CategoryTitle": ({ title }) => createElement("h1", null, title),
  "./CategoryHeroSection.module.css": { container: "container", containerWithRows: "with-rows" },
})).default;
const catalog = await loadComponent("../src/lib/categories/catalog.ts", { "../api": {}, "../config/constants": constants, "@/lib/routing": routing });
const success = data => ({ status: "success", data });
const spread = (id, slug, count = 4) => ({ id, slug, name: slug, site_description: "", description: "", matrix: Object.fromEntries(Array.from({ length: count }, (_, i) => [i, [i, 0]])) });
const triplet = spread("62", "triplet");
const familySpreads = [spread("11", "my-family", 14), spread("12", "children", 10)];
const dictionary = { header: {}, footer: {}, categoryPage: { topBlock: {}, categoryLabel: "Category", getYourReadings: "Read" } };

async function renderPage({ slug = "other", spreads = familySpreads, all = success([triplet]), nested } = {}) {
  let enabled;
  let reading;
  let ask;
  let retry;
  const retryAll = () => {};
  const Page = (await loadComponent("../src/components/categories-page/CategoryPageView/CategoryPageView.tsx", {
    "next/image": () => null,
    "next/link": ({ children }) => createElement("a", null, children),
    "@/components/reading/ReadingLink": ({ children }) => createElement("a", null, children),
    "@/components/reading/ReadingNavigationProvider": ({ children }) => children,
    "@/lib/categories/catalog": catalog,
    "@/lib/routing": routing,
    "@/components/categories/CatalogProvider": {
      useCategories: () => ({ state: success([{ id: "4", slug, name: slug, site_description: "" }]), retry() {} }),
      useSpreads: () => ({ state: success(spreads), retry() {} }),
      useAllSpreads: value => { enabled = value; return { state: all, retry: retryAll }; },
    },
    "@/components/categories/CatalogStatus": props => { retry = props.retry; return createElement("div", { "data-status": props.status }); },
    "@/components/global/Header": () => null,
    "@/components/global/Footer": () => null,
    "@/components/categories/ConstellationGeometry.module.css": {},
    "@/components/categories-page/CategoryHeroSection": hero,
    "@/components/categories-page/CategoryTopBlock": props => { reading = props; return createElement("div", { "data-component": "reading" }); },
    "@/components/categories-page/CategoryAskBlock": props => { ask = props; return createElement("div", { "data-component": "ask" }); },
    "@/components/categories-page/CategorySpreadsSection": marker("spreads"),
    "@/components/categories-page/CategoryLearningSection": marker("learning"),
    "@/components/categories-page/ConstellationPattern": () => null,
    "@/components/categories-list-page/StarField": () => null,
    "@/components/seo/Breadcrumbs": () => null,
    "@/components/faq/FaqSection": marker("faq"),
    "./CategoryPageView.module.css": {},
  })).default;
  const html = renderToStaticMarkup(createElement(Page, { dictionary, locale: "en", path: nested ? [slug, nested] : [slug] }));
  return { html, enabled, reading, ask, retry, retryAll };
}

test("multi-spread category reads the global triplet and renders the standalone category UI", async () => {
  const result = await renderPage();
  assert.equal(result.enabled, true);
  assert.doesNotMatch(result.html, /data-component="ring"|with-rows/);
  assert.equal(result.ask.spreadId, "62");
  assert.equal(result.ask.categoryId, "4");
  assert.equal(result.reading, undefined);
});

test("dreams and other single-spread categories omit the ring and its spacing without loading all spreads", async () => {
  for (const slug of ["dreams", "other"]) {
    const result = await renderPage({ slug, spreads: [spread("1", "dream", 8)], all: { status: "loading" } });
    assert.equal(result.enabled, false);
    assert.doesNotMatch(result.html, /data-component="ring"|with-rows/);
    assert.equal(result.ask.spreadId, "1");
    assert.equal(result.reading, undefined);
  }
});

test("loading, failed or missing triplet leaves manual selection available without a fallback reading", async () => {
  for (const all of [{ status: "loading" }, { status: "error" }, success([])]) {
    const result = await renderPage({ all });
    assert.match(result.html, /data-component="ring"/);
    assert.match(result.html, new RegExp(`data-status="${all.status === "loading" ? "loading" : "error"}"`));
    assert.equal(result.reading, undefined);
    assert.equal(result.retry, result.retryAll);
  }
});

test("explicit spread URL works while the global catalog is unavailable", async () => {
  const result = await renderPage({ nested: "children", all: { status: "error" } });
  assert.equal(result.enabled, false);
  assert.equal(result.ask.spreadId, "12");
  assert.doesNotMatch(result.html, /data-component="ring"|data-status="error"/);
});

test("empty categories and unknown nested URLs retain their existing statuses", async () => {
  const empty = await renderPage({ spreads: [] });
  assert.equal(empty.enabled, false);
  assert.match(empty.html, /data-status="empty"/);
  const missing = await renderPage({ nested: "missing" });
  assert.match(missing.html, /data-status="notFound"/);
  assert.equal(missing.reading, undefined);
});
