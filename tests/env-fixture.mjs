import { readFile } from "node:fs/promises";
import ts from "typescript";

process.env.NEXT_PUBLIC_BACKEND_ORIGIN = "https://stagtest.kaelisai.com";
const urls = {};
for (const name of ["env", "constants"]) {
  const source = await readFile(new URL(`../src/lib/config/${name}.ts`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  });
  urls[name] = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
}
export const constants = await import(urls.constants);
export const bindEnv = source => source.replace(/(["'])\.\.?\/config\/(env|constants)\1/g, (_, quote, name) => JSON.stringify(urls[name]));
