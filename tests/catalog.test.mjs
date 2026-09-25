import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { afterEach, beforeEach, test } from "node:test";
import ts from "typescript";

const transpile = (source) => ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const apiSource = transpile(await readFile(new URL("../src/lib/api.ts", import.meta.url), "utf8"));
const catalogSource = transpile(await readFile(new URL("../src/lib/categories/catalog.ts", import.meta.url), "utf8"));
const selectionSource = transpile(await readFile(new URL("../src/lib/categories/selectionFan.ts", import.meta.url), "utf8"));
const dataUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const originalFetch = globalThis.fetch;
const item = (id, slug = `category-${id}`) => ({ id, slug, name: slug, site_description: "", image: null, need_new_plan: false });
const spread = (id, slug = `spread-${id}`) => ({ ...item(id, slug), description: "Description", matrix: { 1: [0, 1], S: [1, 1] } });
const response = (data, current = 1, last = 1) => Response.json({ data, meta: { current_page: current, last_page: last } });
let catalog, storage, calls;

beforeEach(async () => {
  calls = [];
  storage = new Map([["kaelis.guest-session", JSON.stringify({ token: "existing", guestId: "1", expiresAt: Date.now() + 60000 })]]);
  globalThis.window = {
    location: { origin: "http://localhost:3000" },
    localStorage: { getItem: (k) => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: (k) => storage.delete(k) },
  };
  globalThis.fetch = async (url, init) => { calls.push({ url, init }); return response([item(1)]); };
  const apiUrl = `${dataUrl(apiSource)}#${Math.random()}`;
  catalog = await import(dataUrl(catalogSource.replace('"../api"', JSON.stringify(apiUrl))));
});
afterEach(() => { globalThis.fetch = originalFetch; delete globalThis.window; });

test("loads every category page in API order, normalizes IDs and reuses the token", async () => {
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    const page = Number(new URL(url, window.location.origin).searchParams.get("page"));
    return response([item(page)], page, 3);
  };
  assert.deepEqual((await catalog.loadCatalog("uk")).map((x) => x.id), ["1", "2", "3"]);
  assert.equal(calls.length, 3);
  for (const { url, init } of calls) {
    assert.match(url, /^\/api\/kaelis\/tarot\/category\?page=\d&per_page=50$/);
    assert.equal(init.headers.get("Authorization"), "Bearer existing");
    assert.equal(init.headers.get("Accept-Language"), "uk");
    assert.equal(init.headers.get("X-Platform"), "site");
  }
});

test("requests spreads with category_id on every page", async () => {
  globalThis.fetch = async (url) => {
    const query = new URL(url, window.location.origin);
    assert.equal(query.pathname, "/api/kaelis/tarot");
    assert.equal(query.searchParams.get("category_id"), "4");
    const page = Number(query.searchParams.get("page"));
    return response([spread(page)], page, 2);
  };
  assert.equal((await catalog.loadCatalog("ru", "4")).length, 2);
});

test("concurrent page and menu consumers share a request; category spread caches are separate", async () => {
  const store = catalog.createCatalogStore("en");
  await Promise.all([store.load(), store.load(), store.load()]);
  await store.load();
  assert.equal(calls.length, 1);
  assert.equal(store.getSnapshot().status, "success");
  globalThis.fetch = async (url, init) => { calls.push({ url, init }); return response([spread(3)]); };
  await Promise.all([store.load("4"), store.load("4"), store.load("5")]);
  assert.equal(calls.length, 3);
});

test("a late response in the previous locale cannot replace the active locale", async () => {
  let finishEnglish;
  globalThis.fetch = async (_url, init) => init.headers.get("Accept-Language") === "en"
    ? new Promise((resolve) => { finishEnglish = () => resolve(response([item(1, "English")])); })
    : response([item(1, "Русский")]);
  const en = catalog.createCatalogStore("en"), ru = catalog.createCatalogStore("ru");
  const oldRequest = en.load();
  await ru.load();
  finishEnglish();
  await oldRequest;
  assert.equal(ru.getSnapshot().data[0].name, "Русский");
});

test("errors are distinct from empty responses and explicit retry reloads", async () => {
  const store = catalog.createCatalogStore("en");
  globalThis.fetch = async () => new Response(null, { status: 503 });
  await store.load();
  assert.equal(store.getSnapshot().status, "error");
  globalThis.fetch = async () => response([]);
  await store.load(undefined, true);
  assert.deepEqual(store.getSnapshot(), { status: "success", data: [] });
});

test("401 clears the existing session; retry obtains one guest before fetching again", async () => {
  const store = catalog.createCatalogStore("en");
  globalThis.fetch = async () => new Response(null, { status: 401 });
  await store.load();
  assert.equal(storage.has("kaelis.guest-session"), false);
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    if (url.endsWith("/user/anonymous")) return Response.json({ data: { token_type: "Bearer", access_token: "renewed", guest: { id: 2 } } });
    assert.equal(init.headers.get("Authorization"), "Bearer renewed");
    return response([item(1)]);
  };
  await Promise.all([store.load(undefined, true), store.load(undefined, true)]);
  assert.equal(calls.length, 2);
  assert.equal(store.getSnapshot().status, "success");
});

test("malformed payloads and invalid pagination are errors, not empty lists", async () => {
  for (const body of [{}, { data: {} }, { data: [item(null)], meta: { current_page: 1, last_page: 1 } }, { data: [], meta: { current_page: 1, last_page: 0 } }]) {
    globalThis.fetch = async () => Response.json(body);
    await assert.rejects(catalog.loadCatalog("en"), /Invalid catalog/);
  }
});

test("routing selects the first spread for a category and validates nested slugs", () => {
  const categories = [item("4", "family")], spreads = [spread("11", "my-family"), spread("12", "children")];
  assert.equal(catalog.resolveCatalogPath(categories, spreads, ["family"]).spread.id, "11");
  assert.equal(catalog.resolveCatalogPath(categories, spreads, ["family", "children"]).spread.id, "12");
  assert.equal(catalog.resolveCatalogPath(categories, [], ["family"]).spread, undefined);
  for (const path of [["missing"], ["family", "missing"], ["family", "children", "extra"]]) {
    assert.equal(catalog.resolveCatalogPath(categories, spreads, path), null);
  }
});

test("matrix count includes the significator and rejects invalid or empty layouts", () => {
  assert.equal(catalog.cardCount(spread(1)), 2);
  for (const matrix of [null, [], {}, { 1: [1] }, { 1: [NaN, 2] }]) {
    assert.equal(catalog.cardCount({ ...spread(1), matrix }), null);
  }
});

test("large spreads retain every API position and fit within the existing fan outline", async () => {
  const { fitSelectionFan } = await import(dataUrl(selectionSource));
  const matrix = Object.fromEntries(Array.from({ length: 33 }, (_, index) => [String(index), [index, 0]]));
  assert.equal(catalog.cardCount({ ...spread(1), matrix }), 33);
  const slots = [
    { id: "1", left: 10, top: 0, width: 97, height: 176, rotate: 175 },
    { id: "2", left: 100, top: 50, width: 97, height: 176, rotate: -175 },
  ];
  const cards = fitSelectionFan(slots, 33);
  assert.equal(cards.length, 33);
  assert.equal(new Set(cards.map(card => card.id)).size, 33);
  assert.ok(cards.every(card => card.left >= 10 && card.left <= 100 && card.top >= 0 && card.top <= 50));
  assert.equal(cards[16].rotate, 180);
  assert.deepEqual(slots.map(slot => slot.id), ["1", "2"]);
});
