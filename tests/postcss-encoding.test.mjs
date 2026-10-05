import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import postcss from "postcss";
import config from "../postcss.config.mjs";

const require = createRequire(import.meta.url);
const [pluginPath, options] = Object.entries(config.plugins)[0];
const plugin = require(pluginPath)(options);
const source = readFileSync(new URL("../src/components/categories-page/CategoryTopBlock/RevealCardsStep/RevealCardsStep.module.css", import.meta.url), "utf8").replace(/^\uFEFF/, "");

for (const prefix of ["", "\uFEFF"]) {
  test(`Reveal CSS survives saving ${prefix ? "with" : "without"} BOM`, async () => {
    const result = await postcss([plugin]).process(prefix + source, { from: undefined });
    assert.equal(result.css, source);
    assert.equal(postcss.parse(result.css).first.selector, ".revealArea");
    const repeated = await postcss([plugin]).process("\uFEFF" + result.css, { from: undefined });
    assert.equal(repeated.css, source);
  });
}
