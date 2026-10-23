import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

test("route tracker ignores repeats and stale routes but counts return visits", async () => {
  const source = await readFile(new URL("../src/components/RouteAnalytics.tsx", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  });
  let pathname = "/en";
  const calls = [];
  const exports = {};
  const window = { location: { pathname } };
  vm.runInNewContext(outputText, { exports, window, require: name => ({
    react: { useEffect: callback => callback() },
    "next/navigation": { usePathname: () => pathname },
    "@/lib/analytics": { trackRoute: (...args) => calls.push(args) },
  })[name] });
  const render = (path, title) => exports.default({ pathname: path, pageTitle: title });
  render("/en", "Home");
  render("/en", "Home");
  render("/en", "Updated title");
  pathname = window.location.pathname = "/en/tarot";
  render("/en", "Home");
  render("/en/tarot", "Catalog");
  pathname = window.location.pathname = "/en";
  render("/en", "Home");
  assert.deepEqual(calls, [["/en", "Home"], ["/en/tarot", "Catalog"], ["/en", "Home"]]);
});
