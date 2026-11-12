import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = await readFile(new URL("../src/components/categories-page/CategoryHeroSection/CategoryHeroSection.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
});
const loaded = { exports: {} };
new Function("require", "module", "exports", outputText)(
  name => ({
    "next/navigation": { useRouter: () => ({ replace() {} }) },
    "@/components/global/MainButton": ({ children }) => createElement("button", null, children),
    "@/components/categories-page/SubcategoryRing": () => null,
    "./CategoryTitle": ({ title }) => createElement("h1", null, title),
    "@/lib/seo": { getSeo: () => null },
    "./CategoryHeroSection.module.css": {},
  })[name] ?? require(name), loaded, loaded.exports,
);
const Hero = loaded.exports.default;

test("hero prefers the selected spread API description", () => {
  const html = renderToStaticMarkup(createElement(Hero, {
    dictionary: { categoryLabel: "Category", getYourReadings: "Read" },
    locale: "ru",
    current: { id: "1", slug: "dream", name: "Dream", site_description: "Category description", description: "Spread description", image: null, need_new_plan: false, matrix: {} },
    spreads: [],
    path: ["dreams"],
    returnHref: "/ru/tarot",
    returnLabel: "Back",
    description: "Spread API description",
  }));
  assert.match(html, /Spread API description/);
  assert.doesNotMatch(html, /Category description/);
});
