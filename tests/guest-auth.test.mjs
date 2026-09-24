import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { afterEach, beforeEach, test } from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/api.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
});
const key = "kaelis.guest-session";
const originalFetch = globalThis.fetch;
let api;
let storage;
let calls;

beforeEach(async () => {
  storage = new Map();
  calls = [];
  globalThis.window = {
    location: { origin: "http://localhost:3000" },
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
  };
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return Response.json({ data: { token_type: "Bearer", access_token: `guest-${calls.length}`, guest: { id: 1 } } }, { status: 201 });
  };
  api = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}#${Math.random()}`);
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  delete globalThis.window;
});

test("creates, persists and reuses a guest; concurrent calls share one request", async () => {
  const tokens = await Promise.all([api.getGuestToken(), api.getGuestToken(), api.getGuestToken()]);
  assert.deepEqual(tokens, ["guest-1", "guest-1", "guest-1"]);
  const saved = JSON.parse(storage.get(key));
  assert.equal(saved.token, "guest-1");
  assert.ok(Math.abs(saved.expiresAt - Date.now() - 86_400_000) < 1000);
  assert.equal(await api.getGuestToken(), "guest-1");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "/api/kaelis/user/anonymous");
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.body, undefined);
});

test("reads an existing valid token from localStorage without a request", async () => {
  storage.set(key, JSON.stringify({ token: "existing", expiresAt: Date.now() + 60_000 }));
  assert.equal(await api.getGuestToken(), "existing");
  assert.equal(calls.length, 0);
});

test("renews expired, missing and corrupt storage", async () => {
  for (const saved of [JSON.stringify({ token: "old", expiresAt: Date.now() - 1 }), null, "{", "null"]) {
    storage.delete(key);
    if (saved !== null) storage.set(key, saved);
    const previous = calls.length;
    await api.getGuestToken();
    assert.equal(calls.length, previous + 1);
  }
});

test("API requests carry the stored bearer token and preserve caller headers", async () => {
  storage.set(key, JSON.stringify({ token: "existing", expiresAt: Date.now() + 60_000 }));
  await api.apiFetch("/test?value=1", { headers: { "Accept-Language": "ru" } });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "/api/kaelis/test?value=1");
  assert.equal(calls[0].init.headers.get("Authorization"), "Bearer existing");
  assert.equal(calls[0].init.headers.get("Accept-Language"), "ru");
  await assert.rejects(api.apiFetch("https://example.com"));
  await assert.rejects(api.apiFetch("/../../outside"));
  assert.equal(calls.length, 1);
});

test("failed authorization is not cached and a later attempt succeeds", async () => {
  const success = globalThis.fetch;
  globalThis.fetch = async () => new Response(null, { status: 503 });
  await assert.rejects(api.getGuestToken(), /503/);
  assert.equal(storage.size, 0);
  globalThis.fetch = success;
  assert.equal(await api.getGuestToken(), "guest-1");
});

test("invalid success responses are not stored", async () => {
  globalThis.fetch = async () => Response.json({ data: { access_token: "" } });
  await assert.rejects(api.getGuestToken(), /invalid token/);
  assert.equal(storage.size, 0);
});

test("401 invalidates the token without replaying a mutation; next call renews", async () => {
  storage.set(key, JSON.stringify({ token: "revoked", expiresAt: Date.now() + 60_000 }));
  const success = globalThis.fetch;
  let rejectedCalls = 0;
  globalThis.fetch = async () => { rejectedCalls++; return new Response(null, { status: 401 }); };
  assert.equal((await api.apiFetch("/test", { method: "POST" })).status, 401);
  assert.equal(rejectedCalls, 1);
  assert.equal(storage.size, 0);
  globalThis.fetch = success;
  await api.apiFetch("/test");
  assert.equal(calls.length, 2);
  assert.equal(calls[1].init.headers.get("Authorization"), "Bearer guest-1");
});
