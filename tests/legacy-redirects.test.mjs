import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

function loadCommonJs(source, dependencies) {
  const output = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, resolveJsonModule: true },
  }).outputText;
  const loaded = { exports: {} };
  new Function("require", "module", "exports", output)(name => dependencies[name], loaded, loaded.exports);
  return loaded.exports;
}

const [articleSource, redirectsSource, contentSource, policiesSource] = await Promise.all([
  readFile(new URL("../src/lib/legacyArticleRedirects.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/lib/legacyRedirects.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/lib/seo/content.json", import.meta.url), "utf8"),
  readFile(new URL("../src/lib/policies/catalog.ts", import.meta.url), "utf8"),
]);
const articles = loadCommonJs(articleSource, {});
const policies = loadCommonJs(policiesSource, {});
const redirects = loadCommonJs(redirectsSource, {
  "./seo/content.json": { default: JSON.parse(contentSource) },
  "./legacyArticleRedirects": articles,
  "./policies/catalog": policies,
  "./routing": { isUrlLocale: value => ["en", "ru", "ua"].includes(value) },
});

test("known legacy articles accept missing, alternate and absent articles language segments", () => {
  const slug = "top-5-tarot-spreads-for-love-readings";
  assert.deepEqual(redirects.legacyRedirect(`/ru/articles/${slug}`), { destination: `/ru/articles/${slug}-ru`, status: 301 });
  assert.deepEqual(redirects.legacyRedirect(`/ua/${slug}-uk`), { destination: `/ua/articles/${slug}-ua`, status: 301 });
  assert.deepEqual(redirects.legacyRedirect(`/en/articles/${slug}-fr`), { destination: `/en/articles/${slug}-en`, status: 301 });
  assert.deepEqual(redirects.legacyRedirect(`/us/articles/${slug}-en`), { destination: `/en/articles/${slug}-en`, status: 301 });
});

test("legacy article aliases normalize locale variants before the generic fallback", () => {
  assert.deepEqual(redirects.legacyRedirect("/ru/articles/exploring-the-mystical-connection-between-tarot-and-numerology"), {
    destination: "/ru/articles/numerology-s-role-in-enhancing-your-tarot-readings-ru",
    status: 301,
  });
  assert.deepEqual(redirects.legacyRedirect("/articles/exploring-the-mystical-connection-between-tarot-and-numerology"), {
    destination: "/en/articles/numerology-s-role-in-enhancing-your-tarot-readings-en",
    status: 301,
  });
  assert.deepEqual(redirects.legacyRedirect("/ua/articles/exploring-the-mystical-connection-between-tarot-and-numerology-uk"), {
    destination: "/ua/articles/numerology-s-role-in-enhancing-your-tarot-readings-ua",
    status: 301,
  });
  assert.deepEqual(redirects.legacyRedirect("/en/articles/exploring-the-mystical-connection-between-tarot-and-numerology-fr"), {
    destination: "/en/articles/numerology-s-role-in-enhancing-your-tarot-readings-en",
    status: 301,
  });
  assert.deepEqual(redirects.legacyRedirect("/us/articles/exploring-the-mystical-connection-between-tarot-and-numerology-en"), {
    destination: "/en/articles/numerology-s-role-in-enhancing-your-tarot-readings-en",
    status: 301,
  });
  assert.deepEqual(redirects.legacyRedirect("/policy/privacy-policy-ru"), {
    destination: "/ru/policy/privacy-policy-ru",
    status: 308,
  });
  assert.deepEqual(redirects.legacyRedirect("/policy/privacy-policy-en"), {
    destination: "/en/policy/privacy-policy-en",
    status: 308,
  });
  assert.deepEqual(redirects.legacyRedirect("/en/articles/dfghjhgfdsasdf-en"), { destination: "/en/articles", status: 301 });
  assert.equal(redirects.legacyRedirect("/ru/unknown-page"), undefined);
});

test("every policy suffix is normalized to the URL locale", () => {
  for (const locale of ["en", "ru", "ua"]) {
    for (const key of policies.policyKeys) {
      assert.deepEqual(redirects.legacyRedirect(`/${locale}/policy/${key}-fr`), {
        destination: `/${locale}/policy/${key}-${locale}`,
        status: 308,
      });
      assert.deepEqual(redirects.legacyRedirect(`/${locale}/policy/${key}`), {
        destination: `/${locale}/policy/${key}-${locale}`,
        status: 308,
      });
      assert.deepEqual(redirects.legacyRedirect(`/${locale}/${key}-ru`), {
        destination: `/${locale}/policy/${key}-${locale}`,
        status: 308,
      });
    }
  }
  assert.equal(redirects.legacyRedirect("/ru/policy/content-policy-ru"), undefined);
});

test("tarot redirects only complete unique prefixes in their current category", () => {
  assert.deepEqual(redirects.legacyRedirect("/ru/tarot/mon"), { destination: "/ru/tarot/money", status: 308 });
  assert.deepEqual(redirects.legacyRedirect("/ru/tarot/money/busi"), { destination: "/ru/tarot/money/business", status: 308 });
  assert.equal(redirects.legacyRedirect("/ru/tarot/mo"), undefined);
  assert.equal(redirects.legacyRedirect("/ru/tarot/money/nope"), undefined);
  assert.equal(redirects.legacyRedirect("/ru/faq"), undefined);
});

test("the unlocalized job-change URL has one permanent English redirect", () => {
  assert.deepEqual(redirects.legacyRedirect("/tarot/work/job-change"), {
    destination: "/en/tarot/work/job-change",
    status: 308,
  });
});
