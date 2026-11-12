import assert from "node:assert/strict";
import { test } from "node:test";
import { verifyPublicCatalog } from "../scripts/verify-public-catalog.mjs";

const category = { id: 1, slug: "dreams", name: "Dreams", site_description: "", image: null, need_new_plan: false };
const spread = { ...category, description: "Dream interpretation", matrix: { 1: [0, 0] } };

function response(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

test("public catalog verifier checks every locale and category spread endpoint", async () => {
  const calls = [];
  await verifyPublicCatalog({
    origin: "https://api.example.test",
    fetchImpl: async (url, options) => {
      const target = new URL(url);
      calls.push({ target, options });
      if (target.pathname === "/api/user/anonymous") return response(200, { data: { token_type: "Bearer", access_token: "token" } });
      if (target.pathname === "/api/tarot/category") return response(200, { data: [category], meta: { current_page: 1, last_page: 1 } });
      return response(200, { data: [spread], meta: { current_page: 1, last_page: 1 } });
    },
  });
  assert.equal(calls.filter(({ target }) => target.pathname === "/api/user/anonymous").length, 1);
  const authorization = calls.find(({ target }) => target.pathname === "/api/user/anonymous").options;
  assert.equal(authorization.headers["Accept-Language"], "en");
  assert.equal(authorization.headers["X-Platform"], "site");
  assert.equal(calls.filter(({ target }) => target.pathname === "/api/tarot/category").length, 3);
  assert.equal(calls.filter(({ target }) => target.searchParams.has("category_id")).length, 3);
  assert.ok(calls.filter(({ target }) => target.pathname === "/api/tarot").every(({ options }) => options.headers.Authorization === "Bearer token"));
});

test("public catalog verifier fails on authorization errors", async () => {
  await assert.rejects(
    verifyPublicCatalog({
      origin: "https://api.example.test",
      fetchImpl: async () => response(429, { data: {} }),
    }),
    /Public catalog authorization failed \(429\)/,
  );
});
