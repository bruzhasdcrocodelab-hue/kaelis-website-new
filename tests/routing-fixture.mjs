import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/routing.ts", import.meta.url), "utf8");
const policySource = await readFile(new URL("../src/lib/policies/catalog.ts", import.meta.url), "utf8");
const policyOutput = ts.transpileModule(policySource, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const policyUrl = `data:text/javascript;base64,${Buffer.from(policyOutput).toString("base64")}`;
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
});
export const routingUrl = `data:text/javascript;base64,${Buffer.from(outputText.replace('"./policies/catalog"', JSON.stringify(policyUrl))).toString("base64")}`;
export const routing = await import(routingUrl);
export const seoContent = JSON.parse(await readFile(new URL("../src/lib/seo/content.json", import.meta.url), "utf8"));
const seoSource = await readFile(new URL("../src/lib/seo/index.ts", import.meta.url), "utf8");
const seoOutput = ts.transpileModule(seoSource, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022, resolveJsonModule: true },
}).outputText;
const contentUrl = `data:text/javascript;base64,${Buffer.from(`export default ${JSON.stringify(seoContent)};`).toString("base64")}`;
const seoUrl = `data:text/javascript;base64,${Buffer.from(seoOutput
  .replace('"@/lib/routing"', JSON.stringify(routingUrl))
  .replace('"./content.json"', JSON.stringify(contentUrl))).toString("base64")}`;
export const seo = await import(seoUrl);
const faqSource = await readFile(new URL("../src/lib/faq/content.ts", import.meta.url), "utf8");
const faqOutput = ts.transpileModule(faqSource, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
export const faq = await import(`data:text/javascript;base64,${Buffer.from(faqOutput).toString("base64")}`);
