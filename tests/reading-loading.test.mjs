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
    retry() {}, setQuestion(value) { this.question = value; },
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
  assert.ok(find(app.render(), "AskQuestionStep"));
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
  assert.equal(find(app.render(), "AnswerStep"), null);
  find(app.render(), "RevealCardsStep").props.onStartOver();
  assert.equal(app.flow.question, "");
  assert.equal(app.flow.reading, null);
  assert.ok(find(app.render(), "AskQuestionStep"));
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

for (const mobile of [false, true]) for (const reduced of [false, true]) {
  test(`clock completes its first ${mobile ? 3700 : 3600} ms cycle once, reduced motion=${reduced}`, async () => {
    const app = await mountLoading(mobile, reduced);
    try {
      app.frame(5000);
      assert.equal(app.completed(), 0, "downloads must not consume the first cycle");
      await app.finishDownloads();
      const duration = mobile ? 3700 : 3600;
      app.frame(6000); app.frame(6000 + duration - 1);
      assert.equal(app.completed(), 0);
      app.frame(6000 + duration);
      assert.equal(app.completed(), 1);
      app.frame(6000 + duration * 2 + 100);
      assert.equal(app.completed(), 1);
      assert.ok(Math.abs(app.progress() - (reduced ? mobile ? 0.2584 : 0.2656 : 100 / duration)) < 1e-8);
    } finally { app.cleanup(); }
  });
}

async function mountLoading(mobile, reduced = false) {
  const state = hooks();
  let frame, completed = 0, listener, downloads = [];
  const priorWindow = globalThis.window;
  const query = { matches: mobile, addEventListener(_, fn) { listener = fn; }, removeEventListener() {} };
  globalThis.window = {
    matchMedia: () => query,
    Image: class { set src(_) { downloads.push(() => this.onload()); } },
  };
  const desktop = await load(base + "ChooseCardsStep/loadingMotion.ts", require);
  const mobileData = await load(base + "ChooseCardsStep/mobileLoadingMotion.ts", require);
  const { default: Loading } = await load(base + "ChooseCardsStep/ChooseCardsStep.tsx", name => {
    if (name === "react") return state.react;
    if (name === "react/jsx-runtime") return require(name);
    if (name === "motion/react") return {
      useMotionValue: value => state.react.useRef({ value, set(next) { this.value = next; } }).current,
      useReducedMotion: () => reduced,
      useTransform: (value, fn) => ({ get: () => fn(value.value) }),
      useAnimationFrame: callback => { frame = callback; },
    };
    if (name === "./loadingMotion") return desktop;
    if (name === "./mobileLoadingMotion") return mobileData;
    if (name === "@/lib/tarot/messages") return { readingMessages: { en: {} } };
    if (name.endsWith(".css")) return {};
    return "Image";
  });
  const render = () => { state.begin(); return Loading({ dictionary: { loadingMessages: [] }, locale: "en", onFirstCycleComplete: () => completed++ }); };
  let tree = render(); state.flush(); tree = render();
  return {
    frame: time => frame(time),
    completed: () => completed,
    progress: () => tree.props.children[0].props.children.props.children.props.progress.get(),
    resize(value) { query.matches = value; listener(); tree = render(); },
    async finishDownloads() { downloads.forEach(finish => finish()); await new Promise(resolve => setImmediate(resolve)); },
    cleanup() { globalThis.window = priorWindow; },
  };
}

test("breakpoint changes preserve the completed fraction and do not restart the first cycle", async () => {
  const app = await mountLoading(true);
  try {
    await app.finishDownloads();
    app.frame(0); app.frame(1850);
    assert.ok(Math.abs(app.progress() - 0.5) < 1e-8);
    app.resize(false);
    app.frame(3649);
    assert.equal(app.completed(), 0);
    app.frame(3650);
    assert.equal(app.completed(), 1);
    app.resize(true); app.frame(3700);
    assert.equal(app.completed(), 1);
  } finally { app.cleanup(); }
});

test("mobile Figma scene has 21 smaller cards with its own fan, text and progress timeline", async () => {
  const mobile = await load(base + "ChooseCardsStep/mobileLoadingMotion.ts", require);
  assert.equal(mobile.MOBILE_CYCLE_MS, 3700);
  assert.equal(mobile.mobileLoadingCards.length, 21);
  assert.equal(mobile.MOBILE_CARD_WIDTH, 49.612);
  assert.equal(mobile.MOBILE_CARD_HEIGHT, 88.594);
  const centre = mobile.mobileLoadingCards.find(card => card.cardId === "13");
  assert.ok(Math.abs(centre.top + mobile.MOBILE_CARD_HEIGHT - 377.975) < 0.1);
  for (const card of mobile.mobileLoadingCards) {
    for (const axis of ["x", "y"]) {
      const track = card.tracks[axis];
      assert.equal(track.values[1], 0);
      const index = track.values.length - 3; // Gathered pose before the hidden reset.
      const position = axis === "x" ? card.left : card.top;
      const target = axis === "x" ? centre.left : centre.top;
      assert.ok(Math.abs(position + track.values[index] - target) < 0.02, "cards gather at the centre card");
    }
    for (const track of Object.values(card.tracks)) {
      assert.equal(track.values.length, track.timing.times.length);
      assert.equal(track.timing.ease.length, track.values.length - 1);
      assert.ok(track.values.every(Number.isFinite));
    }
  }
  assert.deepEqual(mobile.mobileTextTracks.map(track => track.opacity.timing.times[1]), [0.0426, 0.2703, 0.5676]);
  assert.equal(Math.max(...mobile.mobileProgressTracks.width.values), 193.67);
  assert.equal(Math.max(...mobile.mobileFanTracks.scaleX.values), 2.98);
});
