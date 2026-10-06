import { constants } from "./env-fixture.mjs";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/tarot/useReading.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
const speakers = [{ id: "2", icon: "psychologist", name: "Psychologist" }];
const reading = { id: "10", chat_id: "20", question: "Old question", cards: [], reading: null };

// Exercise the hook's request lifetime without adding a React test renderer dependency.
function mount({ delayed = false } = {}) {
  const state = [], effects = [], pending = [], timers = new Set();
  let index = 0, flow, signal, finishCreate, socketClosed = 0;
  const react = {
    useState(initial) {
      const slot = index++;
      if (!(slot in state)) state[slot] = initial;
      return [state[slot], next => { state[slot] = typeof next === "function" ? next(state[slot]) : next; }];
    },
    useRef(initial) {
      const slot = index++;
      return state[slot] ??= { current: initial };
    },
    useCallback(callback) { return callback; },
    useEffect(callback, deps) {
      const slot = index++;
      const previous = effects[slot];
      if (!previous || deps.some((value, i) => !Object.is(value, previous.deps[i]))) {
        pending.push(() => {
          previous?.cleanup?.();
          effects[slot] = { deps, cleanup: callback() };
        });
      }
    },
  };
  const preference = { speakerId: "2", setSpeakerId() {}, getSpeakerId: () => "2" };
  const dependencies = {
    "../config/constants": constants,
    react,
    "@/components/TarotStyleProvider": { useTarotStyle: () => preference },
    "./styleStore": { resolveSpeakerId: (items, id) => items.some(item => item.id === id) ? id : "" },
    "./messages": { readingMessages: { en: { error: "Error", waiting: "Waiting", unavailable: "Unavailable" } } },
    "./reading": {
      loadSpeakers: async () => speakers,
      readingPayload: (...args) => args,
      createReading: async (_payload, _locale, requestSignal) => {
        signal = requestSignal;
        return delayed ? new Promise(resolve => { finishCreate = resolve; }) : reading;
      },
      TarotError: class extends Error {},
    },
    "./socket": {
      connectReadingSocket: async () => () => { socketClosed++; },
    },
  };
  const loaded = { exports: {} };
  new Function("require", "module", "exports", "setTimeout", "clearTimeout", outputText)(
    name => dependencies[name], loaded, loaded.exports,
    callback => { const timer = { callback }; timers.add(timer); return timer; },
    timer => timers.delete(timer),
  );
  const render = (enabled = true) => {
    index = 0;
    flow = loaded.exports.useReading("en", "1", "62", enabled);
    pending.splice(0).forEach(effect => effect());
    return flow;
  };
  return {
    render, timers,
    get signal() { return signal; }, get socketClosed() { return socketClosed; },
    finish() { finishCreate(reading); },
    unmount() { effects.forEach(effect => effect.cleanup?.()); },
  };
}

async function start(instance) {
  instance.render();
  await Promise.resolve();
  instance.render().setQuestion("Old question");
  const submission = instance.render().submit();
  await Promise.resolve();
  return { submission };
}

test("closing during creation aborts the socket and ignores the late response", async () => {
  const instance = mount({ delayed: true });
  const { submission } = await start(instance);
  instance.render(false);
  assert.equal(instance.signal.aborted, true);
  assert.equal(instance.socketClosed, 1);
  instance.finish();
  await submission;
  assert.equal(instance.render(false).reading, null);
  instance.unmount();
});

test("reset clears an existing reading and cancels its watchdog", async () => {
  const instance = mount();
  const { submission } = await start(instance);
  await submission;
  assert.equal(instance.render().reading.id, "10");
  assert.equal(instance.timers.size, 1);
  instance.render().reset();
  assert.equal(instance.signal.aborted, true);
  assert.equal(instance.socketClosed, 1);
  assert.equal(instance.timers.size, 0);
  assert.equal(instance.render().reading, null);
  instance.unmount();
});

test("a replacement session starts empty with the same global style, even for the same spread", async () => {
  const previous = mount({ delayed: true });
  const { submission } = await start(previous);
  previous.unmount();
  const next = mount();
  next.render();
  await Promise.resolve();
  const current = next.render();
  assert.equal(current.question, "");
  assert.equal(current.reading, null);
  assert.equal(current.speakerId, "2");
  previous.finish();
  await submission;
  assert.equal(next.render().reading, null);
  next.unmount();
});
