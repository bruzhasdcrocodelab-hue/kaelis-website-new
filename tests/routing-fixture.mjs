import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/routing.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
});
export const routingUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
export const routing = await import(routingUrl);
export const seoContent = JSON.parse(await readFile(new URL("../src/lib/seo/content.json", import.meta.url), "utf8"));
