import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { victory, cardText } from "./card-description-fixtures.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require(process.argv[2] || "playwright");
const baseURL = process.env.TEST_BASE_URL || "http://localhost:3000";

async function record(page, action, duration = 650) {
  await page.evaluate(duration => {
    window.motionSamples = [];
    const start = performance.now();
    const sample = () => {
      const dialog = document.querySelector('[role="dialog"]');
      const panel = document.querySelector('#category-top-block');
      const video = [...document.querySelectorAll('#cards button[aria-pressed="true"]')].find(node => node.getClientRects().length)?.querySelector('video');
      window.motionSamples.push({
        t: performance.now() - start,
        y: dialog?.getBoundingClientRect().y,
        dialogHeight: dialog?.offsetHeight,
        lock: document.body.style.overflow,
        title: dialog?.querySelector('h2')?.textContent,
        text: panel?.textContent,
        opacity: panel ? Number(getComputedStyle(panel.parentElement.parentElement).opacity) : null,
        videoTime: video?.currentTime,
        videoVisible: video?.style.visibility,
        frontVisible: video?.parentElement.style.opacity,
      });
      if (performance.now() - start < duration) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  }, duration);
  await action();
  await page.waitForTimeout(duration + 80);
  return page.evaluate(() => window.motionSamples);
}

async function checkSheet(page, open, reduced) {
  await open();
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  await page.waitForTimeout(reduced ? 30 : 450);
  const title = await dialog.locator('h2').textContent();
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
  assert.ok(await dialog.evaluate(node => node.contains(document.activeElement)));
  const resting = await dialog.evaluate(node => node.getBoundingClientRect().y);
  const shortHandle = await page.locator('[data-sheet-handle]').boundingBox();
  await page.mouse.move(shortHandle.x + shortHandle.width / 2, shortHandle.y + 25);
  await page.mouse.down();
  await page.mouse.move(shortHandle.x + shortHandle.width / 2, shortHandle.y + 60, { steps: 8 });
  await page.waitForTimeout(100);
  await page.mouse.up();
  await page.waitForTimeout(reduced ? 30 : 450);
  assert.ok(Math.abs(await dialog.evaluate(node => node.getBoundingClientRect().y) - resting) < 1);
  const handle = await page.locator('[data-sheet-handle]').boundingBox();
  await page.mouse.move(handle.x + handle.width / 2, handle.y + 25);
  await page.mouse.down();
  await page.mouse.move(handle.x + handle.width / 2, handle.y + 145, { steps: 12 });
  const dragged = await dialog.evaluate(node => node.getBoundingClientRect().y);
  const samples = await record(page, () => page.mouse.up());
  const visible = samples.filter(sample => sample.y !== undefined);
  assert.ok(visible.every(sample => sample.lock === 'hidden' && sample.title === title));
  assert.ok(visible.every(sample => sample.y >= dragged - 1), 'dismissal must not bounce back');
  assert.ok(visible.every((sample, i) => !i || sample.y >= visible[i - 1].y - 1));
  assert.equal(await dialog.count(), 0);
  assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  await open();
  await dialog.waitFor();
  await page.waitForTimeout(reduced ? 30 : 450);
  const escape = await record(page, () => page.keyboard.press('Escape'));
  assert.ok(escape.filter(sample => sample.y !== undefined).every(sample => sample.lock === 'hidden'));
  assert.equal(await dialog.count(), 0);
  assert.ok(await page.evaluate(() => [...document.body.children].every(node => !node.inert)));
  await open();
  await dialog.waitFor();
  await page.waitForTimeout(reduced ? 30 : 450);
  await page.locator('[data-sheet-backdrop]').click({ position: { x: 5, y: 5 } });
  await dialog.waitFor({ state: 'detached' });
}

const browser = await chromium.launch({ channel: process.env.TEST_BROWSER_CHANNEL || "chrome", headless: true });
try {
  for (const scenario of [
    { width: 1440, height: 1000, locale: 'en', route: '/' },
    { width: 390, height: 844, locale: 'en', route: '/' },
    { width: 320, height: 640, locale: 'ru', route: '/', reduced: true },
    { width: 390, height: 844, locale: 'uk', route: '/categories/family' },
    { width: 768, height: 1024, locale: 'en', route: '/' },
    { width: 769, height: 1024, locale: 'en', route: '/' },
  ]) {
    const context = await browser.newContext({ viewport: { width: scenario.width, height: scenario.height },
      hasTouch: scenario.width <= 768, isMobile: scenario.width <= 768, reducedMotion: scenario.reduced ? 'reduce' : 'no-preference' });
    await context.addCookies([{ name: 'locale', value: scenario.locale, url: baseURL }]);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let submissions = 0;
    await page.route('**/api/kaelis/**', async route => {
      const path = new URL(route.request().url()).pathname;
      const base = { id: 4, slug: 'answer', name: 'Answer', site_description: 'Reading', image: null, need_new_plan: false };
      let body;
      if (path.endsWith('/user/anonymous')) body = { data: { token_type: 'Bearer', access_token: 'test-only', guest: { id: 1 } } };
      else if (path.endsWith('/tarot/category')) body = { data: [base, { ...base, id: 5, slug: 'family', name: 'Family' }], meta: { current_page: 1, last_page: 1 } };
      else if (path.endsWith('/tarot/speaker')) body = { data: [{ id: 1, name: 'Analyst', icon: 'analyst' }] };
      else if (path.endsWith('/configuration')) body = { data: { web_socket: {} } };
      else if (path.endsWith('/tarot') && route.request().method() === 'POST') {
        submissions++;
        body = { data: { id: 9000 + submissions, chat_id: 1, question: 'Animation regression', tarot: { id: 62, matrix: { S: [0, 0] } },
          cards: [{ position: 'S', name: 'The Moon', image: 'Moon.png', orientation: true, description: cardText(victory[scenario.locale]) }],
          reading: { interpretation: [{ title: 'Result', text: 'Interpretation. '.repeat(80) }], cards: [] } } };
      } else if (path.endsWith('/tarot')) body = { data: [{ ...base, id: 62, slug: 'celtic-cross', name: 'Celtic Cross', description: 'Spread', matrix: { S: [0, 0] } }], meta: { current_page: 1, last_page: 1 } };
      else body = { data: {} };
      await route.fulfill({ json: body });
    });
    await page.goto(baseURL + scenario.route);
    if (scenario.route === '/') {
      const cards = page.locator('#cards button:visible');
      await cards.first().waitFor();
      await page.waitForTimeout(1000);
      await cards.nth(5).evaluate(node => node.click());
      await page.locator('textarea').waitFor();
      await page.waitForTimeout(750);
      const previous = await page.locator('#category-top-block').textContent();
      const switched = await record(page, () => cards.nth(6).evaluate(node => node.click()));
      assert.notEqual(await page.locator('#category-top-block').textContent(), previous);
      if (!scenario.reduced) {
        assert.ok(switched.some(sample => sample.text === previous && sample.opacity < .95));
        assert.ok(switched.some(sample => sample.text !== previous && sample.opacity > 0 && sample.opacity < .95));
      }
      assert.equal(submissions, 0);
      await cards.nth(5).evaluate(node => node.click());
      await page.waitForTimeout(35);
      await cards.nth(6).evaluate(node => node.click());
      await page.waitForTimeout(500);
      assert.equal(await page.locator('#category-top-block').count(), 1);
      assert.equal(await cards.nth(6).getAttribute('aria-pressed'), 'true');
      if (!scenario.reduced) {
        await page.waitForFunction(() => [...document.querySelectorAll('#cards button[aria-pressed="true"]')]
          .find(node => node.getClientRects().length)?.querySelector('video')?.currentTime > 1);
      }
      await cards.nth(6).evaluate(node => node.click());
      await page.waitForTimeout(600);
      const reopened = await record(page, () => cards.nth(6).evaluate(node => node.click()), 850);
      assert.ok(reopened.every(sample => sample.frontVisible !== '1' || sample.videoVisible !== 'visible' || sample.videoTime < 1));
      await cards.nth(6).evaluate(node => node.click());
      await page.waitForTimeout(50);
      await cards.nth(6).evaluate(node => node.click());
      await page.waitForTimeout(1100);
      assert.equal(await page.locator('#category-top-block').count(), 1);
      assert.equal(await page.locator('#category-top-block').evaluate(node => Boolean(node.closest('[inert]'))), false);
    }
    await page.locator('textarea').fill('Animation regression');
    await page.locator('textarea').locator('..').getByRole('button').click();
    await page.locator('[data-reveal-phase="ready"]').waitFor({ timeout: 30000 });
    assert.equal(submissions, 1);
    if (scenario.width <= 768) {
      await checkSheet(page, () => page.locator('[data-card-position] button').first().click(), scenario.reduced);
      await checkSheet(page, () => page.locator('[data-reveal-controls] button').first().click(), scenario.reduced);
    } else {
      assert.equal(await page.locator('[data-ai-detail]').count(), 1);
      assert.equal(await page.locator('[data-selected-detail]').count(), 1);
    }
    if (scenario.route === '/') {
      const exit = await page.evaluate(() => {
        [...document.querySelectorAll('#cards button[aria-pressed="true"]')].find(node => node.getClientRects().length).click();
        return new Promise(resolve => requestAnimationFrame(() => {
          const controls = document.querySelector('[data-reveal-controls]');
          resolve({ controlsInert: !controls || controls.inert });
        }));
      });
      assert.ok(exit.controlsInert);
      await page.locator('#category-top-block').waitFor({ state: 'detached' });
      await page.locator('#cards button:visible').nth(6).evaluate(node => node.click());
      await page.locator('textarea').waitFor();
      assert.equal(await page.locator('textarea').inputValue(), '');
      assert.equal(await page.locator('[data-reveal-phase]').count(), 0);
      assert.equal(submissions, 1);
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ...scenario, result: 'passed', submissions }));
    await context.close();
  }
} finally {
  await browser.close();
}
