import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

async function load(path, window) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
  const loaded = { exports: {} };
  new Function("module", "exports", "window", outputText)(loaded, loaded.exports, window);
  return loaded.exports;
}

function browser(initial = null, blocked = false) {
  let stored = initial;
  const listeners = new Set();
  return {
    localStorage: {
      getItem() { if (blocked) throw Error("blocked"); return stored; },
      setItem(_key, value) { if (blocked) throw Error("blocked"); stored = value; },
    },
    addEventListener(_type, callback) { listeners.add(callback); },
    removeEventListener(_type, callback) { listeners.delete(callback); },
    dispatch(event) { listeners.forEach(callback => callback(event)); },
  };
}

test("home cards preserve every API mapping and use dictionary keys for labels", async () => {
  const { HOME_CARDS } = await load("../src/lib/tarot/homeCards.ts");
  assert.deepEqual(Object.values(HOME_CARDS).map(card => [card.label, card.category, card.spread]), [
    ["love", "answer", "celtic-cross"], ["yesNo", "decision", "yesno"],
    ["oneCard", "answer", "triplet"], ["threeCards", "answer", "triplet"],
    ["work", "work", "my-job"], ["family", "answer", "celtic-cross"], ["money", "answer", "celtic-cross"],
  ]);
});

test("preference hydrates safely, notifies all consumers and survives provider recreation", async () => {
  const window = browser("4");
  const { createStyleStore, STYLE_STORAGE_KEY } = await load("../src/lib/tarot/styleStore.ts", window);
  const store = createStyleStore();
  assert.equal(store.getServerSnapshot(), "");
  let updates = 0;
  const stop = store.subscribe(() => updates++);
  const stopSecond = store.subscribe(() => updates++);
  assert.equal(store.getSnapshot(), "4");
  store.set("2");
  assert.equal(updates, 2);
  assert.equal(window.localStorage.getItem(STYLE_STORAGE_KEY), "2");
  stop(); stopSecond();
  const restored = createStyleStore();
  const cleanup = restored.subscribe(() => {});
  assert.equal(restored.getSnapshot(), "2");
  cleanup();
});

test("language changes resolve the same ID, and missing IDs use the analyst fallback", async () => {
  const { resolveSpeakerId } = await load("../src/lib/tarot/styleStore.ts");
  for (const name of ["Witch", "Ведьма", "Відьма"]) {
    assert.equal(resolveSpeakerId([{ id: "1", icon: "analyst" }, { id: "4", icon: "witch", name }], "4"), "4");
  }
  assert.equal(resolveSpeakerId([{ id: "4", icon: "witch" }, { id: "1", icon: "analyst" }], "99"), "1");
  assert.equal(resolveSpeakerId([{ id: "4", icon: "witch" }], "99"), "4");
  assert.equal(resolveSpeakerId([], "4"), "");
});

test("corrupt storage and denied storage do not break the preference", async () => {
  for (const window of [browser('{"invalid":true}'), browser(null, true)]) {
    const { createStyleStore } = await load("../src/lib/tarot/styleStore.ts", window);
    const store = createStyleStore();
    const stop = store.subscribe(() => {});
    assert.equal(store.getSnapshot(), "");
    store.set("3");
    store.set("invalid");
    assert.equal(store.getSnapshot(), "3");
    stop();
    const stopAgain = store.subscribe(() => {});
    assert.equal(store.getSnapshot(), "3");
    stopAgain();
  }
});

test("storage events update mounted consumers and unrelated keys are ignored", async () => {
  const window = browser("1");
  const { createStyleStore, STYLE_STORAGE_KEY } = await load("../src/lib/tarot/styleStore.ts", window);
  const store = createStyleStore();
  const stop = store.subscribe(() => {});
  window.dispatch({ key: STYLE_STORAGE_KEY, newValue: "4" });
  assert.equal(store.getSnapshot(), "4");
  window.dispatch({ key: "locale", newValue: "uk" });
  assert.equal(store.getSnapshot(), "4");
  stop();
});
