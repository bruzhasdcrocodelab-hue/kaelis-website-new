import { bindEnv } from "./env-fixture.mjs";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const sockets = [];
class FakeEcho {
  constructor(options) {
    sockets.push(this); this.options = options; this.connectionEvents = {};
    this.connector = { pusher: { connection: { bind: (name, fn) => { this.connectionEvents[name] = fn; } } } };
  }
  private(name) { this.channel = name; return this; }
  listen(name, fn) { this.event = name; this.answer = fn; return this; }
  subscribed(fn) { this.ready = fn; return this; }
  error(fn) { this.failed = fn; return this; }
  disconnect() { this.closed = true; }
}
globalThis.__Echo = FakeEcho;
globalThis.__configuration = { web_socket: { key: "test-key", host: "socket.example.test", port: 443, force_tls: true, auth: "https://stagtest.kaelisai.com/broadcasting/auth" } };
let source = await readFile(new URL("../src/lib/tarot/socket.ts", import.meta.url), "utf8");
source = source.replace('import Echo from "laravel-echo";', 'const Echo = globalThis.__Echo;')
  .replace('import Pusher from "pusher-js";', 'const Pusher = {};')
  .replace('import { getGuestSession } from "../api";', 'const getGuestSession = async () => ({ guestId: "guest-test", token: "test-token" });')
  .replace('import { record, tarotRequest, TarotError } from "./reading";', 'const record = v => v; const tarotRequest = async () => globalThis.__configuration; class TarotError extends Error {}');
const js = ts.transpileModule(bindEnv(source), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { connectReadingSocket } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);

test("waits for private subscription, forwards answer events, resyncs and disconnects on abort", async () => {
  const controller = new AbortController(); let reconnects = 0, disconnects = 0, resolved = false; const events = [];
  const pending = connectReadingSocket("uk", controller.signal, e => events.push(e), () => reconnects++, () => disconnects++).then(close => { resolved = true; return close; });
  await new Promise(r => setImmediate(r));
  const socket = sockets.at(-1);
  assert.equal(resolved, false);
  assert.equal(socket.channel, "guest.guest-test");
  assert.equal(socket.options.authEndpoint, "/api/kaelis/broadcasting/auth");
  assert.equal(socket.options.auth.headers.Authorization, "Bearer test-token");
  assert.equal(socket.options.auth.headers["Accept-Language"], "uk");
  socket.ready(); await pending; socket.ready();
  assert.equal(reconnects, 1);
  socket.answer({ sender_type: "tarot", url_message: "/chat/1/message/2" });
  assert.equal(events.length, 1);
  socket.connectionEvents.disconnected(); assert.equal(disconnects, 1);
  controller.abort(); assert.equal(socket.closed, true);
  socket.answer({ sender_type: "tarot" }); assert.equal(events.length, 1);
});
test("subscription failure closes the socket and rejects before creating a reading", async () => {
  const controller = new AbortController();
  const pending = connectReadingSocket("en", controller.signal, () => {}, () => {}, () => {});
  await new Promise(r => setImmediate(r));
  const socket = sockets.at(-1); socket.failed();
  await assert.rejects(pending, /authorization failed/);
  assert.equal(socket.closed, true);
});
test("null staging configuration is a recoverable transport failure", async () => {
  globalThis.__configuration.web_socket.key = null;
  await assert.rejects(connectReadingSocket("en", new AbortController().signal, () => {}, () => {}, () => {}), /configuration unavailable/);
});
