import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/categories/subcategoryLayout.ts", import.meta.url), "utf8");
const moduleUrl = `data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText).toString("base64")}`;
const { computeSubcategoryPositions, computeSubcategoryMobileRows, subcategoryBounds } = await import(moduleUrl);

const size = { width: 88, height: 102, iconWidth: 40, iconHeight: 49, gap: 8 };
const overlaps = (a, b) => a.left < b.right + 7.99 && a.right + 7.99 > b.left && a.top < b.bottom + 7.99 && a.bottom + 7.99 > b.top;

function verify(input, positions) {
  assert.ok(positions, `No layout for ${input.nodes.length} nodes at ${input.width}px`);
  assert.equal(positions.length, input.nodes.length);
  const occupied = [];
  positions.forEach((position, index) => {
    assert.equal(position.side, index % 2 === 0 ? "right" : "left");
    assert.equal(position.slotIndex, Math.floor(index / 2));
    for (const box of subcategoryBounds(input.nodes[index], position)) {
      assert.ok(box.left >= 16 && box.right <= input.width - 16 && box.top >= 8);
      assert.ok(input.obstacles.every(obstacle => !overlaps(box, obstacle)));
      assert.ok(occupied.every(other => !overlaps(box, other)));
    }
    occupied.push(...subcategoryBounds(input.nodes[index], position));
    if (index >= 2) assert.ok(position.y > positions[index - 2].y);
  });
}

test("different counts stay on one arc without overlaps or extrapolated offscreen slots", () => {
  for (const count of [0, 1, 3, 4, 12, 13, 14]) {
    const input = { width: 1420, patternWidth: 1580, nodes: Array.from({ length: count }, () => ({ ...size })), obstacles: [] };
    const positions = computeSubcategoryPositions(input);
    verify(input, positions);
    for (const position of positions) {
      const normalizedX = (position.x - input.width / 2) / 638;
      const normalizedY = (676 - position.y - size.iconHeight / 2) / 644;
      assert.ok(Math.abs(normalizedX ** 2 + normalizedY ** 2 - 1) < 1e-9);
    }
  }
});

test("translated labels, central copy and return button retain animation clearance", () => {
  for (const width of [1260, 1346, 1420, 1900]) {
    const input = {
      width,
      patternWidth: Math.min(1580, (width + 20) * 1580 / 1440),
      nodes: Array.from({ length: 12 }, (_, index) => ({ ...size, height: index % 3 === 0 ? 98 : 84 })),
      obstacles: [
        { left: width / 2 - 100, right: width / 2 + 100, top: 60, bottom: 104 },
        { left: width / 2 - 250, right: width / 2 + 250, top: 150, bottom: 290 },
        { left: width / 2 - 150, right: width / 2 + 150, top: 300, bottom: 345 },
        { left: width / 2 - 110, right: width / 2 + 110, top: 370, bottom: 422 },
      ],
    };
    verify(input, computeSubcategoryPositions(input));
  }
});

test("unplaceable content returns an explicit fallback instead of overlapping", () => {
  assert.equal(computeSubcategoryPositions({ width: 1420, patternWidth: 1580, nodes: Array(40).fill(size), obstacles: [] }), null);
  assert.equal(computeSubcategoryPositions({ width: 1420, patternWidth: 1580, nodes: [{ ...size, width: 1500 }], obstacles: [] }), null);
  assert.equal(computeSubcategoryPositions({ width: 0, patternWidth: 1580, nodes: [size], obstacles: [] }), null);
});

test("motion bounds include the icon pulse, floating label and outline", () => {
  const boxes = subcategoryBounds(size, { x: 100, y: 20, side: "right", slotIndex: 0 });
  assert.equal(boxes[0].left, 100 - 40 * 1.08 / 2 - 5);
  assert.equal(boxes[0].top, 20 - 49 * 0.04);
  assert.equal(boxes[1].right, 100 + 88 / 2 + 10 + 2);
  assert.equal(boxes[1].bottom, 20 + 102 + 10 + 2);
});

test("mobile row distribution remains balanced and preserves every node", () => {
  assert.deepEqual(computeSubcategoryMobileRows(0), []);
  assert.deepEqual(computeSubcategoryMobileRows(1), [1]);
  assert.deepEqual(computeSubcategoryMobileRows(12), [4, 4, 4]);
  assert.deepEqual(computeSubcategoryMobileRows(13), [4, 4, 3, 2]);
  for (let count = 2; count <= 40; count++) {
    const rows = computeSubcategoryMobileRows(count);
    assert.equal(rows.reduce((sum, row) => sum + row, 0), count);
    assert.ok(rows.every(row => row >= 2 && row <= 4));
  }
});
