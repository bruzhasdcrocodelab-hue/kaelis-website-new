import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("reveal styles contain no BOM that becomes part of a selector in the bundled CSS", async () => {
  // A leading BOM in this CSS Module survived concatenation as U+FEFF.revealArea.
  // The browser treated it as a type selector, leaving the flex child at zero width.
  for (const path of [
    "../src/components/categories-page/CategoryTopBlock/RevealCardsStep/RevealCardsStep.module.css",
    "../src/components/categories-page/CategoryTopBlock/CategoryTopBlock.module.css",
    "../src/app/tokens.css",
  ]) {
    const css = await readFile(new URL(path, import.meta.url), "utf8");
    assert.equal(css.includes("\uFEFF"), false, `${path} must be UTF-8 without BOM`);
  }
});
