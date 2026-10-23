import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/consent.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
});
const exports = {};
const calls = [];
const storage = new Map();
const context = vm.createContext({ exports, window: { gtag: (...args) => calls.push(args) }, localStorage: {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
} });
vm.runInContext(outputText, context);

test("consent validates records and expires both choices", () => {
  for (const choice of ["granted", "denied"]) {
    assert.equal(exports.readConsent(JSON.stringify({ version: 1, choice, expiresAt: 101 }), 100), choice);
    assert.equal(exports.readConsent(JSON.stringify({ version: 1, choice, expiresAt: 100 }), 100), null);
  }
  for (const value of [null, "broken", "{}", '{"version":2,"choice":"granted","expiresAt":200}', '{"version":1,"choice":"other","expiresAt":200}']) {
    assert.equal(exports.readConsent(value, 100), null);
  }
});

test("stored consent restores before config without a page view", () => {
  calls.length = 0;
  exports.saveConsent("granted");
  assert.equal(JSON.parse(storage.get(exports.CONSENT_KEY)).choice, "granted");
  calls.length = 0;
  vm.runInContext(`window.gtag('consent', 'default', {analytics_storage:'denied'});${exports.consentBootstrap()}window.gtag('config', 'G-B6EK9NFKV5', {send_page_view:false});`, context);
  assert.deepEqual(calls.map(args => args.slice(0, 2)), [["consent", "default"], ["consent", "update"], ["config", "G-B6EK9NFKV5"]]);
  assert.equal(calls[1][2].analytics_storage, "granted");
});

test("storage failure does not prevent applying a choice", () => {
  const previous = context.localStorage;
  context.localStorage = { getItem() { throw Error("blocked"); }, setItem() { throw Error("blocked"); } };
  calls.length = 0;
  assert.doesNotThrow(() => vm.runInContext(exports.consentBootstrap(), context));
  exports.saveConsent("denied");
  assert.equal(calls.length, 1);
  assert.equal(calls[0][2].analytics_storage, "denied");
  context.localStorage = previous;
});
