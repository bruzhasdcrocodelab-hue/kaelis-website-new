import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { test } from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const base = "../src/components/categories-page/CategoryTopBlock/";
async function load(path, resolve) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  });
  const loaded = { exports: {} };
  new Function("require", "module", "exports", outputText)(resolve, loaded, loaded.exports);
  return loaded.exports;
}

function hooks() {
  const slots = [], effects = [];
  let index = 0;
  return {
    begin() { index = 0; },
    flush() { effects.splice(0).forEach(effect => effect()); },
    react: {
      useState(initial) { const key = index++; if (!(key in slots)) slots[key] = initial; return [slots[key], value => { slots[key] = value; }]; },
      useRef(initial) { return slots[index++] ??= { current: initial }; },
      useCallback: fn => fn,
      useMemo: fn => fn(),
      useLayoutEffect() {},
      useEffect: effect => effects.push(effect),
    },
  };
}
function find(node, type) {
  if (!node || typeof node !== "object") return null;
  if (node.type === type) return node;
  const children = Array.isArray(node) ? node : [node.props?.children];
  for (const child of children) { const result = find(child, type); if (result) return result; }
  return null;
}

async function mountParent() {
  const state = hooks();
  const flow = {
    reading: null, busy: false, error: "", speakers: [{ id: "1" }], speakerId: "1", question: "Question",
    submit() { this.busy = true; this.error = ""; },
    reset() { this.reading = null; this.busy = false; this.error = ""; },
    retry() {}, setQuestion() {},
  };
  const marker = name => name.split("/").at(-1);
  const { default: Parent } = await load(base + "CategoryTopBlock.tsx", name => {
    if (name === "react") return { ...state.react, useEffect() {} };
    if (name === "react/jsx-runtime") return require(name);
    if (name === "@/lib/tarot/useReading") return { useReading: () => flow };
    if (name === "@/lib/tarot/messages") return { readingMessages: { en: {} } };
    if (name.endsWith(".css")) return {};
    if (name.endsWith("TriggerButton")) return { default: marker(name), GUIDE_ICON: {} };
    return marker(name);
  });
  const props = { dictionary: { guideDescriptions: {} }, locale: "en", categoryLabel: "Family", categoryId: "1", spreadId: "1", maxSelectableCards: 3 };
  const render = () => { state.begin(); return Parent(props); };
  const start = () => { find(render(), "AskQuestionStep").props.onContinue(); return render(); };
  return { flow, render, start, props };
}
const ready = { id: "10", question: "Question", cards: [{ position: "0" }], reading: { sections: [{ text: "Interpretation" }] } };

test("an immediate interpretation waits for the first complete cycle and passes the original reading to Reveal", async () => {
  const app = await mountParent();
  assert.ok(find(app.render(), "DecorativeCardFan"));
  const loading = find(app.start(), "ChooseCardsStep");
  assert.ok(loading);
  app.flow.reading = ready; app.flow.busy = false;
  assert.equal(find(app.render(), "RevealCardsStep"), null);
  loading.props.onFirstCycleComplete();
  assert.equal(find(app.render(), "RevealCardsStep").props.reading, ready);
});

test("cards without interpretation keep loading; a later interpretation transitions without another cycle", async () => {
  const app = await mountParent();
  find(app.start(), "ChooseCardsStep").props.onFirstCycleComplete();
  app.flow.busy = false; app.flow.reading = { ...ready, reading: null };
  assert.ok(find(app.render(), "ChooseCardsStep"));
  app.flow.reading = ready;
  assert.ok(find(app.render(), "RevealCardsStep"));
});

test("creation error restores the form; interpretation error uses the existing retry", async () => {
  const app = await mountParent();
  app.start();
  app.flow.busy = false; app.flow.error = "Create failed";
  assert.equal(find(app.render(), "AskQuestionStep").props.error, "Create failed");
  app.start();
  app.flow.busy = false; app.flow.reading = { ...ready, reading: null }; app.flow.error = "Waiting";
  const loading = find(app.render(), "ChooseCardsStep");
  assert.equal(loading.props.error, "Waiting");
  assert.equal(loading.props.onRetry, app.flow.retry);
});

test("a new question requires its own full cycle, and an inactive session ignores completion", async () => {
  const app = await mountParent();
  find(app.start(), "ChooseCardsStep").props.onFirstCycleComplete();
  app.flow.reading = ready; app.flow.busy = false;
  find(app.render(), "MainButton").props.onClick();
  const loading = find(app.start(), "ChooseCardsStep");
  app.flow.reading = ready; app.flow.busy = false;
  assert.equal(find(app.render(), "RevealCardsStep"), null);
  app.props.sessionActive = false;
  find(app.render(), "ChooseCardsStep").props.onFirstCycleComplete();
  assert.equal(find(app.render(), "RevealCardsStep"), null);
  app.props.sessionActive = true;
  loading.props.onFirstCycleComplete();
  assert.ok(find(app.render(), "RevealCardsStep"));
});

for (const reduced of [false, true]) test("shared clock completes once at 3600 ms after artwork is ready, reduced motion=" + reduced, async () => {
  const state = hooks();
  let frame, completed = 0, downloads = [];
  const priorWindow = globalThis.window;
  globalThis.window = { Image: class { set src(_) { downloads.push(() => this.onload()); } } };
  try {
    const motionData = await load(base + "ChooseCardsStep/loadingMotion.ts", require);
    const { default: Loading } = await load(base + "ChooseCardsStep/ChooseCardsStep.tsx", name => {
      if (name === "react") return state.react;
      if (name === "react/jsx-runtime") return require(name);
      if (name === "motion/react") return {
        useMotionValue: value => ({ value, set(next) { this.value = next; } }),
        useReducedMotion: () => reduced,
        useTransform: (value, fn) => ({ get: () => fn(value.value) }),
        useAnimationFrame: callback => { frame = callback; },
      };
      if (name === "./loadingMotion") return motionData;
      if (name === "./mobileLoadingMotion") return { mobileLoadingCards: [] };
      if (name === "../cardFanMobile") return {};
      if (name === "@/lib/tarot/messages") return { readingMessages: { en: {} } };
      if (name.endsWith(".css")) return {};
      return "Image";
    });
    const tree = Loading({ dictionary: { loadingMessages: [] }, locale: "en", onFirstCycleComplete: () => completed++ });
    state.flush();
    frame(5000);
    assert.equal(completed, 0, "network delay must not consume the first cycle");
    downloads.forEach(finish => finish());
    await new Promise(resolve => setImmediate(resolve));
    frame(6000); frame(9599);
    assert.equal(completed, 0);
    frame(9600);
    assert.equal(completed, 1);
    frame(11000); frame(13200);
    assert.equal(completed, 1);
    const layer = tree.props.children[0].props.children.props.children;
    assert.equal(layer.props.progress.get(), reduced ? 0.2656 : 0);
  } finally { globalThis.window = priorWindow; }
});

test("mobile motion preserves the old spread geometry and gathers every card into the same pile", async () => {
  const fan = await load(base + "cardFanMobile.ts", require);
  const desktop = await load(base + "ChooseCardsStep/loadingMotion.ts", require);
  const mobile = await load(base + "ChooseCardsStep/mobileLoadingMotion.ts", name =>
    name === "../cardFanMobile" ? fan : desktop);
  const centre = fan.cardFanMobile.find(card => card.id === "13");
  const pile = { x: centre.left + 30, y: centre.top + 55 };
  for (const card of mobile.mobileLoadingCards) {
    const original = fan.cardFanMobile.find(item => item.id === card.id);
    assert.equal(card.left, original.left);
    assert.equal(card.top, original.top);
    assert.equal(card.flipY, original.flipY);
    assert.ok(Math.abs(card.tracks.rotate.values[1] - original.rotate) < 0.001);
    for (const axis of ["x", "y"]) {
      const track = card.tracks[axis];
      const position = axis === "x" ? card.left + 30 : card.top + 55;
      assert.ok(Math.abs(track.values[1]) < 0.001, "spread pose must stay at the old card position");
      const final = track.values[track.timing.times.findIndex(time => time >= 0.8561)];
      assert.ok(Math.abs(position + final - pile[axis]) < 0.001, "all cards must meet at the pile");
      assert.ok(track.values.every(Number.isFinite));
    }
  }
});
