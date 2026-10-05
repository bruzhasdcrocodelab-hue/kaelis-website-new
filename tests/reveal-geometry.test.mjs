import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/components/categories-page/CategoryTopBlock/RevealCardsStep/revealGeometry.ts", import.meta.url), "utf8");
const moduleUrl = `data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText).toString("base64")}`;
const { spreadGeometry, clampPan, focusTransform, zoomBounds } = await import(moduleUrl);
const metrics = { cardWidth: 120, cardHeight: 215, labelHeight: 44, gap: 8, padding: 64, column: 160, row: 280 };

test("maximum zoom keeps the design card size independently of spread size", () => {
  const layoutMetrics = { ...metrics, labelHeight: 0, gap: 0, padding: 8, column: 136.8, row: 232.2 };
  for (const [vw, vh, overview, maximum] of [[500, 494, 85.662, 169.589], [358, 456, 79.9, 111.189]]) {
    for (const count of [1, 4, 7, 12, 30, 78]) {
      const layout = spreadGeometry(Array.from({ length: count }, (_, i) => ({ x: i % 4, y: Math.floor(i / 4) })), layoutMetrics);
      const bounds = zoomBounds(layout.width, layout.height, vw, vh, layoutMetrics, overview, maximum);
      assert.ok(layout.width * bounds.fit <= vw + 0.001);
      assert.ok(layout.height * bounds.fit <= vh + 0.001);
      assert.ok(Math.abs(bounds.max * metrics.cardWidth - maximum) < 0.001);
      if (count === 12) assert.ok(bounds.fit * metrics.cardWidth > overview * 0.97);
    }
  }
});

test("arbitrary reading order and asymmetric coordinates survive layout without a fixed card count", () => {
  for (const count of [1, 3, 7, 12, 21]) {
    const cards = Array.from({ length: count }, (_, i) => ({ x: (count - i) * .5, y: i % 3 }));
    const layout = spreadGeometry(cards, metrics);
    assert.equal(layout.positions.length, count);
    layout.positions.forEach((point, i) => {
      assert.equal(point.x, metrics.padding + cards[i].x * metrics.column);
      assert.equal(point.y, metrics.padding + cards[i].y * metrics.row);
      assert.ok(point.x + metrics.cardWidth < layout.width);
      assert.ok(point.y + metrics.cardHeight + metrics.labelHeight + metrics.gap < layout.height);
    });
  }
});

test("initial fit keeps every card and its label inside desktop and mobile bounds", () => {
  const layout = spreadGeometry([{ x: 0, y: 4 }, { x: 3, y: 0 }, { x: 1.5, y: 2 }], metrics);
  for (const [width, height] of [[1280, 494], [288, 260], [358, 360]]) {
    const fit = Math.min(1, width / layout.width, height / layout.height);
    const x = clampPan(0, layout.width * fit, width), y = clampPan(0, layout.height * fit, height);
    for (const point of layout.positions) {
      assert.ok(x + point.x * fit >= 0);
      assert.ok(y + point.y * fit >= 0);
      assert.ok(x + (point.x + metrics.cardWidth) * fit <= width);
      assert.ok(y + (point.y + metrics.cardHeight + metrics.labelHeight + metrics.gap) * fit <= height);
    }
  }
});

test("bounded zoom gutters can center an edge card without changing its real position", () => {
  const point = { x: 124, y: 224 };
  const view = focusTransform(point, 1.4, 1900, 1200, 1280, 494, true);
  assert.equal(view.x + point.x * view.scale, 640);
  assert.equal(view.y + point.y * view.scale, 247);
  assert.equal(clampPan(10000, 2000, 1000, 500), 500);
  assert.equal(clampPan(-10000, 2000, 1000, 500), -1500);
  assert.equal(clampPan(10000, 200, 1000), 400);
});
