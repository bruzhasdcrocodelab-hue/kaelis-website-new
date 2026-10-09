import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { test } from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = await readFile(new URL("../src/components/reading/ReadingNavigationProvider.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
});

function mount() {
  const slots = [];
  let index = 0;
  const react = {
    createContext: () => ({ Provider: "Provider" }),
    useState(initial) {
      const key = index++;
      if (!(key in slots)) slots[key] = initial;
      return [slots[key], value => { slots[key] = value; }];
    },
    useRef(initial) { return slots[index++] ??= { current: initial }; },
    useCallback: fn => fn,
    useMemo: fn => fn(),
  };
  const loaded = { exports: {} };
  new Function("require", "module", "exports", outputText)(name => {
    if (name === "react") return react;
    if (name === "react/jsx-runtime") return require(name);
    return { default: "Modal" };
  }, loaded, loaded.exports);
  const dictionary = { title: "Confirm", message: "Switch", leaveMessage: "Leave", confirm: "Switch", leaveConfirm: "Leave", cancel: "Cancel" };
  const render = () => {
    index = 0;
    const tree = loaded.exports.default({ dictionary, children: null });
    return { navigation: tree.props.value, modal: tree.props.children[1].props };
  };
  return { render, navigation: render().navigation };
}

test("cancel preserves the session and discards navigation, including during modal exit", () => {
  const { navigation, render } = mount();
  const calls = [];
  navigation.register({ started: true, reset: () => calls.push("reset") });
  navigation.request(() => calls.push("navigate"));
  assert.equal(render().modal.open, true);
  render().modal.onCancel();
  navigation.request(() => calls.push("duplicate"));
  render().modal.onExitComplete();
  assert.deepEqual(calls, []);
  navigation.request(() => calls.push("retry"));
  assert.equal(render().modal.open, true);
});

test("confirm resets once before the original action and waits for modal exit", () => {
  const { navigation, render } = mount();
  const calls = [];
  navigation.register({ started: true, reset: () => calls.push("reset") });
  navigation.request(() => calls.push("first"));
  navigation.request(() => calls.push("second"));
  render().modal.onConfirm();
  assert.deepEqual(calls, []);
  render().modal.onExitComplete();
  render().modal.onExitComplete();
  assert.deepEqual(calls, ["reset", "first"]);
});

test("pending selection cancellation runs once after exit and never resets the active reading", () => {
  const { navigation, render } = mount();
  const calls = [];
  navigation.register({ started: true, reset: () => calls.push("reset") });
  navigation.request(() => calls.push("switch"), "switch", () => calls.push("cancel"));
  render().modal.onCancel();
  assert.deepEqual(calls, []);
  render().modal.onExitComplete();
  render().modal.onExitComplete();
  assert.deepEqual(calls, ["cancel"]);
  navigation.request(() => calls.push("switch"), "switch", () => calls.push("cancel"));
  render().modal.onConfirm();
  render().modal.onExitComplete();
  assert.deepEqual(calls, ["cancel", "reset", "switch"]);
});

test("empty sessions navigate immediately; old registration cleanup cannot remove the new session", () => {
  const { navigation, render } = mount();
  const calls = [];
  const cleanup = navigation.register({ started: true, reset: () => calls.push("old") });
  navigation.register({ started: false, reset: () => calls.push("reset") });
  cleanup();
  navigation.request(() => calls.push("navigate"));
  assert.equal(render().modal.open, false);
  assert.deepEqual(calls, ["reset", "navigate"]);
});

test("Our App hands scrolling to the start of panel closing and keeps the desktop session", () => {
  const { navigation, render } = mount();
  const calls = [];
  let closeStart;
  navigation.register({ started: true, reset: () => calls.push("reset") });
  navigation.returnHome(() => calls.push("desktop-scroll"));
  assert.equal(render().modal.open, false);
  navigation.registerHomeReturn(proceed => { calls.push("close"); closeStart = proceed; });
  navigation.returnHome(() => calls.push("mobile-scroll"));
  render().modal.onConfirm();
  render().modal.onExitComplete();
  assert.deepEqual(calls, ["desktop-scroll", "reset", "close"]);
  closeStart();
  assert.deepEqual(calls, ["desktop-scroll", "reset", "close", "mobile-scroll"]);
});
