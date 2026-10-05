// Run against a local dev server: node tests/reveal-cards.browser.mjs <path-to-playwright>
// All API requests are intercepted; this test never creates a backend reading.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { victory, balance, cardText } from "./card-description-fixtures.mjs";
import { interpretations, interpretationText } from "./interpretation-fixtures.mjs";
const loadPackage = createRequire(import.meta.url);
const { chromium } = loadPackage(process.argv[2] || "playwright");
const artifacts = ".next/reveal-checks";
mkdirSync(artifacts, { recursive: true });

async function checkAccordion(page, container, reduced) {
  const section = page.locator(`${container} [data-section="why"]`);
  const toggle = section.locator('button');
  const body = section.locator('[data-open]');
  const icon = toggle.locator('[aria-hidden]');
  assert.equal(await icon.evaluate(node => node.getBoundingClientRect().width), 16);
  assert.equal(await body.evaluate(node => node.getBoundingClientRect().height), 0);
  await toggle.click();
  if (!reduced) {
    assert.ok(await body.evaluate(node => node.getAnimations().length > 0));
    assert.ok(await icon.evaluate(node => node.getAnimations().length > 0));
  }
  await page.waitForTimeout(400);
  assert.ok(await body.evaluate(node => node.getBoundingClientRect().height > 0));
  await toggle.click();
  await page.waitForTimeout(400);
  assert.equal(await body.evaluate(node => node.getBoundingClientRect().height), 0);
  assert.equal(await body.getAttribute('aria-hidden'), 'true');
}

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    for (const scenario of [
      { name: "desktop", width: 1440, height: 1000, count: 4, locale: "en" },
      { name: "mobile", width: 390, height: 844, count: 7, locale: "uk" },
      { name: "narrow-reduced", width: 320, height: 640, count: 1, locale: "ru", reduced: true, rawAnswer: 0 },
      { name: "desktop-ru", width: 1440, height: 1000, count: 7, locale: "ru", reduced: true, rawAnswer: 0 },
      { name: "desktop-twelve", width: 1440, height: 1000, count: 12, locale: "en", rawAnswer: 1 },
      { name: "mobile-twelve", width: 390, height: 844, count: 12, locale: "en", rawAnswer: 2 },
      { name: "mobile-large", width: 390, height: 844, count: 30, locale: "uk", reduced: true },
    ].filter(scenario => !process.argv[3] || scenario.name === process.argv[3])) {
      const context = await browser.newContext({
        viewport: { width: scenario.width, height: scenario.height },
        reducedMotion: scenario.reduced ? "reduce" : "no-preference",
        hasTouch: scenario.width < 768,
      });
      await context.addCookies([{ name: "locale", value: scenario.locale, url: "http://localhost:3000" }]);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      let submissions = 0;
      const keys = Array.from({ length: scenario.count }, (_, i) => i === 0 ? "S" : String(i));
      const matrix = Object.fromEntries(keys.map((key, i) => [key, [i % 4 - 2, Math.floor(i / 4) - 1]]));
      // Array order deliberately disagrees with object/numeric/spatial ordering.
      const order = [...keys].reverse();
      const cardNames = ["Knight of Wands", "The Moon", "The Star", "The Sun"];
      const headings = { en: ["Result", "Why these cards", "Risks", "Advice"], uk: ["Результат", "Чому ці карти", "Ризики", "Поради"], ru: ["Итог", "Почему эти карты", "Риски", "Советы"] }[scenario.locale];
      await page.route("**/api/kaelis/**", async route => {
        const url = new URL(route.request().url());
        const base = { id: 4, slug: "family", name: "Family", site_description: "Family reading", image: null, need_new_plan: false };
        let body;
        if (url.pathname.endsWith("/user/anonymous")) body = { data: { token_type: "Bearer", access_token: "test-only", guest: { id: 1 } } };
        else if (url.pathname.endsWith("/tarot/category")) body = { data: [base], meta: { current_page: 1, last_page: 1 } };
        else if (url.pathname.endsWith("/tarot/speaker")) body = { data: [{ id: 1, name: "Analyst", icon: "analyst" }] };
        else if (url.pathname.endsWith("/configuration")) body = { data: { web_socket: {} } };
        else if (url.pathname.endsWith("/tarot") && route.request().method() === "POST") {
          submissions++;
          body = { data: {
            id: 100 + submissions, chat_id: 1, question: JSON.parse(route.request().postData()).question, tarot: { id: 62, matrix },
            cards: order.map((position, i) => ({
              position, name: cardNames[i % 4], description: cardText(i % 2 ? balance : victory[scenario.locale]),
              image: ["Wands12.png", "Moon.png", "Star.png", "Sun.png"][i % 4], orientation: i % 2 === 0,
            })),
            reading: { interpretation: scenario.rawAnswer != null ? [{ title: "", text: interpretationText(interpretations[scenario.rawAnswer]) }] : scenario.partial ? [{ title: "", text: `${headings[0]}\n\nAI reading ${submissions}. ${"Existing result from the reading. ".repeat(60)}\n\n${headings[3]}\n\nWrite a one-page concept and obtain actual quotes for rent, equipment, suppliers, and staffing.\nRun a small-scale demand and margin test before signing a lease.` }] : [
              { title: headings[0], text: "AI reading " + submissions + " — відповідь, ответ." },
              { title: headings[1], text: "Card reasoning. ".repeat(50) },
              { title: headings[2], text: "Risks and possibilities. ".repeat(10) },
              { title: headings[3], text: "1. First action\n2. Second action\n3. Third action" },
            ], cards: order.map(position => ({ position, text: "" })) },
          } };
        } else if (url.pathname.endsWith("/tarot")) body = {
          data: [{ ...base, id: 62, slug: "celtic-cross", name: "Celtic Cross", description: "Spread", matrix }],
          meta: { current_page: 1, last_page: 1 },
        };
        else body = { data: {} };
        await route.fulfill({ json: body });
      });
      await page.goto("http://localhost:3000/categories/family");
      await page.locator("textarea").waitFor();
      await page.evaluate(() => {
        window.revealPhases = []; window.anchorCalls = 0; window.phaseSamples = [];
        const original = Element.prototype.scrollIntoView;
        Element.prototype.scrollIntoView = function (...args) {
          if (this.id === "category-top-block") window.anchorCalls++;
          return original.apply(this, args);
        };
        new MutationObserver(() => {
          const phase = document.querySelector("[data-reveal-phase]")?.dataset.revealPhase;
          if (!phase || window.revealPhases.at(-1) === phase) return;
          window.revealPhases.push(phase);
          window.phaseSamples.push({
            phase,
            selected: document.querySelectorAll("[data-card-position] [aria-pressed=true]").length,
            landed: [...document.querySelectorAll("[data-card-position]")].every(el => {
              const matrix = new DOMMatrix(getComputedStyle(el).transform);
              return Math.abs(matrix.e) < .1 && Math.abs(matrix.f) < .1;
            }),
          });
        }).observe(document.body, { subtree: true, attributes: true, childList: true });
      });
      const continueLabel = { en: "Continue", uk: "Продовжити", ru: "Продолжить" }[scenario.locale];
      const startLabel = { en: scenario.width < 768 ? "Restart" : "Start Over", uk: "Почати спочатку", ru: "Начать заново" }[scenario.locale];
      await page.locator("textarea").fill("How will my plans develop? Довге запитання про майбутнє та можливості. Длинный вопрос о планах и новых возможностях.");
      await page.getByRole("button", { name: continueLabel, exact: true }).click();
      await page.locator("[data-reveal-phase=ready]").waitFor({ timeout: 30000 });
      await page.waitForTimeout(scenario.reduced ? 50 : 500);
      assert.equal(await page.locator('#category-top-block').evaluate(node => getComputedStyle(node).scrollMarginTop), '16px');
      const focusedWidth = await page.locator('[data-card-position] button').first().evaluate(node => {
        const transform = new DOMMatrixReadOnly(node.closest('[data-spread-viewport]').firstElementChild.style.transform);
        return node.offsetWidth * transform.a;
      });
      assert.ok(Math.abs(focusedWidth - (scenario.width < 768 ? 111.189 : 169.589)) < 1, 'auto focus reaches the design maximum');

      assert.deepEqual(await page.evaluate(() => window.revealPhases), ["preparing", "dealing", "flipping", "focusing", "ready"]);
      assert.equal(await page.evaluate(() => window.anchorCalls), 1);
      if (scenario.width > 768) assert.equal(await page.locator("[data-card-position] button[aria-pressed=true]").locator("..").locator("..").getAttribute("data-card-position"), order[0]);
      else {
        assert.equal(await page.locator("[data-card-position] button[aria-pressed=true]").count(), 0);
        assert.equal(await page.getByRole("dialog").count(), 0);
      }
      assert.equal(await page.locator("[data-card-position]").count(), scenario.count);
      assert.ok(await page.evaluate(() => window.phaseSamples.filter(sample => ["flipping", "focusing"].includes(sample.phase)).every(sample => sample.landed && !sample.selected)));
      assert.deepEqual(await page.locator("[data-card-position]").evaluateAll(nodes => nodes.map(node => node.dataset.cardPosition)), order);
      const coordinates = await page.locator("[data-card-position]").evaluateAll(nodes => nodes.map(node => ({ x: parseFloat(node.style.left), y: parseFloat(node.style.top) })));
      const minX = Math.min(...Object.values(matrix).map(point => point[0])), minY = Math.min(...Object.values(matrix).map(point => point[1]));
      const tokens = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        return Object.fromEntries(["padding", "column", "row"].map(key => [key, parseFloat(style.getPropertyValue("--reveal-" + key))]));
      });
      coordinates.forEach((point, index) => {
        assert.ok(Math.abs(point.x - (tokens.padding + (matrix[order[index]][0] - minX) * tokens.column)) < 0.001);
        assert.ok(Math.abs(point.y - (tokens.padding + (matrix[order[index]][1] - minY) * tokens.row)) < 0.001);
      });
      assert.equal(await page.locator("[data-ai-detail]").count(), scenario.width > 768 ? 1 : 0);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.locator("[data-reading-panel]").screenshot({ path: artifacts + "/reveal-" + scenario.name + ".png" });

      if (scenario.width > 768) {
      assert.deepEqual(await page.locator('[data-selected-detail] [data-section]').evaluateAll(nodes => nodes.map(node => node.dataset.section)), ['quickRead', 'impact', 'recognition', 'focus']);
      await page.locator('[data-selected-detail] [data-reading-scroll]').evaluate(node => { node.scrollTop = node.scrollHeight; });
      await page.waitForTimeout(100);
      assert.equal(await page.locator('[data-selected-detail] [data-reading-scroll]').getAttribute('data-at-end'), 'true');
      assert.equal(await page.locator('[data-selected-detail]').evaluate(node => getComputedStyle(node, '::after').display), 'none');
      await page.locator('[data-selected-detail]').screenshot({ path: artifacts + '/card-bottom-' + scenario.name + '.png' });
      await page.locator('[data-selected-detail] [data-reading-scroll]').evaluate(node => { node.scrollTop = 0; });
      assert.ok((await page.locator("[data-ai-detail]").innerText()).includes(scenario.rawAnswer != null ? interpretations[scenario.rawAnswer].result : "AI reading 1"));
      if (scenario.partial) {
        assert.equal(await page.locator('[data-ai-detail] [data-section="why"], [data-ai-detail] [data-section="risks"]').count(), 0);
        assert.equal(await page.locator('[data-ai-detail] ol li').count(), 2);
      } else {
      await checkAccordion(page, '[data-ai-detail]', scenario.reduced);
      await page.locator('[data-ai-detail] [data-section="why"] button').click();
      await page.locator('[data-ai-detail] [data-section="risks"] button').click();
      assert.equal(await page.locator('[data-ai-detail] [aria-expanded="true"]').count(), 2);
      if (scenario.rawAnswer != null) {
        for (const key of ['result', 'why', 'risks']) assert.equal(await page.locator(`[data-ai-detail] [data-section="${key}"] p`).innerText(), interpretations[scenario.rawAnswer][key]);
        assert.deepEqual(await page.locator('[data-ai-detail] ol li').allTextContents(), interpretations[scenario.rawAnswer].advice);
      }
      }
      await page.locator("[data-reading-panel]").screenshot({ path: artifacts + "/expanded-" + scenario.name + ".png" });
      // Following page scroll must keep the two information cards aligned and panel-bounded.
      const detailOffset = await page.locator('[data-reading-details]').evaluate(node => node.getBoundingClientRect().top - node.closest('[data-reading-panel]').getBoundingClientRect().top);
      await page.evaluate(() => window.scrollBy(0, 80));
      await page.waitForTimeout(100);
      const bounds = await page.evaluate(() => {
        const panel = document.querySelector('[data-reading-panel]').getBoundingClientRect();
        return [...document.querySelectorAll('[data-selected-detail], [data-ai-detail]')].map(node => {
          const rect = node.getBoundingClientRect();
          return { top: rect.top, within: rect.top >= panel.top && rect.bottom <= panel.bottom };
        });
      });
      assert.ok(bounds.every(bound => bound.within));
      assert.ok(Math.abs(bounds[0].top - bounds[1].top) < 1);
      assert.equal(await page.locator('[data-reading-details]').evaluate(node => node.getBoundingClientRect().top - node.closest('[data-reading-panel]').getBoundingClientRect().top), detailOffset);

      await page.locator('[data-ai-detail] [data-reading-scroll]').evaluate(node => { node.scrollTop = node.scrollHeight; });
      await page.waitForTimeout(100);
      assert.equal(await page.locator('[data-ai-detail]').evaluate(node => getComputedStyle(node, '::after').display), 'none');
      assert.ok(await page.locator('[data-ai-detail] ol li').last().evaluate(node => {
        const scroll = node.closest('[data-reading-scroll]').getBoundingClientRect();
        return node.getBoundingClientRect().bottom <= scroll.bottom;
      }));
      await page.locator("[data-ai-detail]").evaluate(node => { window.answerNode = node; node.querySelector('[tabindex="0"]').scrollTop = 50; });
      await page.locator("[data-card-position] button[aria-pressed=true]").click();
      await page.locator("[data-selected-detail]").waitFor({ state: "detached" });
      assert.ok(await page.evaluate(() => window.answerNode === document.querySelector("[data-ai-detail]")));
      assert.equal(await page.locator("[data-ai-detail] [tabindex]").evaluate(node => node.scrollTop), 50);

      const target = page.locator("[data-card-position] button").nth(scenario.count > 1 ? 1 : 0);
      await target.evaluate(node => node.focus({ preventScroll: true }));
      await page.keyboard.press("Enter");
      await page.locator("[data-selected-detail]").waitFor();
      assert.ok(await page.evaluate(() => window.answerNode === document.querySelector("[data-ai-detail]")));
      await page.locator("[data-selected-detail]").click({ position: { x: 20, y: 20 } });
      await page.locator("[data-selected-detail]").waitFor({ state: "detached" });

      } else {
        assert.equal(await page.locator('[data-reveal-controls]').evaluate(node => getComputedStyle(node).position), 'fixed');
        await page.locator('[data-reveal-controls]').screenshot({ path: artifacts + '/controls-' + scenario.name + '.png' });
        const controls = await page.locator('[data-reveal-controls] button').evaluateAll(nodes => nodes.map(node => ({ scroll: node.scrollWidth, width: node.clientWidth, height: node.getBoundingClientRect().height, text: node.innerText })));
        assert.ok(controls.every(node => node.scroll <= node.width && node.height <= 60), JSON.stringify(controls));
        await page.locator('[data-card-position] button').first().click();
        await page.getByRole('dialog').waitFor();
        assert.ok(await page.getByRole('dialog').evaluate(node => node.contains(document.activeElement)));
        assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
        assert.equal(await page.locator('[data-card-position] button[aria-pressed=true]').count(), 1);
        assert.deepEqual(await page.locator('[role="dialog"] [data-section]').evaluateAll(nodes => nodes.map(node => node.dataset.section)), ['quickRead', 'impact', 'recognition', 'focus']);
        await page.getByRole('dialog').screenshot({ path: artifacts + '/card-modal-' + scenario.name + '.png' });
        await page.locator('[data-sheet-backdrop]').click({ position: { x: 5, y: 5 } });
        await page.getByRole('dialog').waitFor({ state: 'detached' });
        await page.locator('[data-reveal-controls] button').first().click();
        await page.getByRole('dialog').waitFor();
        assert.ok((await page.getByRole('dialog').innerText()).includes(scenario.rawAnswer != null ? interpretations[scenario.rawAnswer].result : 'AI reading 1'));
        await page.getByRole('dialog').screenshot({ path: artifacts + '/answer-collapsed-' + scenario.name + '.png' });
        if (scenario.partial) {
          assert.equal(await page.locator('[role="dialog"] [data-section="why"], [role="dialog"] [data-section="risks"]').count(), 0);
          assert.equal(await page.locator('[role="dialog"] ol li').count(), 2);
        } else {
        await checkAccordion(page, '[role="dialog"]', scenario.reduced);
        await page.locator('[role="dialog"] [data-section="why"] button').click();
        await page.locator('[role="dialog"] [data-section="risks"] button').click();
        assert.equal(await page.locator('[role="dialog"] [aria-expanded="true"]').count(), 2);
        assert.equal(await page.locator('[role="dialog"] ol li').count(), scenario.rawAnswer != null ? 2 : 3);
        if (scenario.rawAnswer != null) {
          for (const key of ['result', 'why', 'risks']) assert.equal(await page.locator(`[role="dialog"] [data-section="${key}"] p`).innerText(), interpretations[scenario.rawAnswer][key]);
          assert.deepEqual(await page.locator('[role="dialog"] ol li').allTextContents(), interpretations[scenario.rawAnswer].advice);
        }
        }
        await page.waitForTimeout(400);
        await page.locator('[role="dialog"] [tabindex="0"]').evaluate(node => { node.scrollTop = 80; });
        assert.ok(await page.locator('[role="dialog"] [tabindex="0"]').evaluate(node => node.scrollTop > 0));
        await page.locator('[role="dialog"] [tabindex="0"]').evaluate(node => { node.scrollTop = 0; });
        await page.getByRole('dialog').screenshot({ path: artifacts + '/answer-modal-' + scenario.name + '.png' });
        const handle = await page.locator('[data-sheet-handle]').boundingBox();
        await page.mouse.move(handle.x + handle.width / 2, handle.y + 12);
        await page.mouse.down();
        await page.mouse.move(handle.x + handle.width / 2, handle.y + 150, { steps: 12 });
        await page.mouse.up();
        await page.getByRole('dialog').waitFor({ state: 'detached' });
        assert.equal(await page.evaluate(() => document.body.style.overflow), '');
        assert.equal(await page.locator('[data-card-position] button[aria-pressed=true]').count(), 0);
        await page.locator('[data-reveal-controls] button').first().click();
        await page.keyboard.press('Escape');
        await page.getByRole('dialog').waitFor({ state: 'detached' });
      }

      const viewport = page.locator("[data-spread-viewport]");
      await viewport.scrollIntoViewIfNeeded();
      const rect = await viewport.boundingBox();
      const cx = rect.x + rect.width / 2, cy = rect.y + rect.height / 2;
      const beforeZoom = await viewport.locator(":scope > div").getAttribute("style");
      await page.mouse.move(cx, cy); await page.mouse.wheel(0, -200);
      await page.waitForTimeout(100);
      assert.equal(await viewport.locator(":scope > div").getAttribute("style"), beforeZoom, 'auto focus already uses maximum zoom');
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(100);
      assert.notEqual(await viewport.locator(":scope > div").getAttribute("style"), beforeZoom);
      const beforePan = await viewport.locator(":scope > div").getAttribute("style");
      await page.mouse.move(cx, cy); await page.mouse.down(); await page.mouse.move(cx + 35, cy + 25, { steps: 5 }); await page.mouse.up();
      assert.notEqual(await viewport.locator(":scope > div").getAttribute("style"), beforePan);
      assert.equal(await page.locator("[data-selected-detail]").count(), 0, "drag must not select a card");

      if (scenario.width < 768) {
        const client = await context.newCDPSession(page);
        const beforePinch = await viewport.locator(":scope > div").getAttribute("style");
        await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: cx - 20, y: cy, id: 0 }, { x: cx + 20, y: cy, id: 1 }] });
        await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: cx - 40, y: cy, id: 0 }, { x: cx + 40, y: cy, id: 1 }] });
        await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        assert.notEqual(await viewport.locator(":scope > div").getAttribute("style"), beforePinch);
      }
      await page.setViewportSize({ width: scenario.width + 20, height: scenario.height });
      await page.waitForTimeout(100);
      assert.equal(await page.locator("[data-reveal-phase]").getAttribute("data-reveal-phase"), "ready");
      assert.equal(await page.evaluate(() => window.anchorCalls), 1);
      await page.getByRole("button", { name: startLabel, exact: true }).click();
      assert.equal(await page.locator("textarea").inputValue(), "");
      assert.equal(await page.locator("[data-ai-detail]").count(), 0);
      if (scenario.name === "desktop") {
        await page.locator("textarea").fill("A new reading");
        await page.getByRole("button", { name: continueLabel, exact: true }).click();
        await page.locator("[data-reveal-phase=ready]").waitFor({ timeout: 30000 });
        assert.equal(submissions, 2);
        assert.ok((await page.locator("[data-ai-detail]").innerText()).includes("AI reading 2"));
        assert.equal(await page.evaluate(() => window.anchorCalls), 2);
        await page.getByRole("button", { name: startLabel, exact: true }).click();
        await page.locator("textarea").fill("Cancel during animation");
        await page.getByRole("button", { name: continueLabel, exact: true }).click();
        await page.locator("[data-reveal-phase=dealing]").waitFor({ timeout: 30000 });
        await page.getByRole("button", { name: startLabel, exact: true }).click();
        await page.waitForTimeout(1200);
        assert.equal(await page.locator("textarea").inputValue(), "");
        assert.equal(await page.locator("[data-reveal-phase]").count(), 0);
      }
      assert.deepEqual(errors, []);
      console.log("PASS", scenario.name, scenario.locale, scenario.count, "cards: phases, positions, selection, persistent answer, wheel/drag/pinch, resize, scroll, reset");
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

