export interface LayoutRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface SubcategorySize {
  width: number;
  height: number;
  iconWidth: number;
  iconHeight: number;
  gap: number;
}

export interface SubcategoryPosition {
  x: number;
  y: number;
  side: "left" | "right";
  slotIndex: number;
}

export interface SubcategoryLayoutInput {
  width: number;
  patternWidth: number;
  nodes: SubcategorySize[];
  obstacles: LayoutRect[];
  sweep?: number;
}

export function subcategoryBounds(node: SubcategorySize, position: SubcategoryPosition): LayoutRect[] {
  const { x, y } = position;
  return [
    {
      left: x - node.iconWidth * 0.54 - 5,
      right: x + node.iconWidth * 0.54 + 10,
      top: y - node.iconHeight * 0.04,
      bottom: y + node.iconHeight * 1.04 + 10,
    },
    {
      left: x - node.width / 2 - 7,
      right: x + node.width / 2 + 12,
      top: y + node.iconHeight + node.gap - 2,
      bottom: y + node.height + 12,
    },
  ];
}

export function layoutRectsOverlap(a: LayoutRect, b: LayoutRect, gap = 8): boolean {
  return a.left < b.right + gap && a.right + gap > b.left
    && a.top < b.bottom + gap && a.bottom + gap > b.top;
}

export function computeSubcategoryPositions({ width, patternWidth, nodes, obstacles, sweep = Math.PI / 2 }: SubcategoryLayoutInput): SubcategoryPosition[] | null {
  if (nodes.length === 0) return [];
  if (width <= 0 || patternWidth <= 0) return null;

  const scale = patternWidth / 1580;
  const radius = 644 * scale;
  const radiusX = Math.min(radius, width / 2 - Math.max(...nodes.map(node => node.width)) / 2 - 28);
  if (radiusX <= 0) return null;
  const apex = 32 * scale;
  const steps = 360;

  for (const spread of [1, 0.75, 0.5, 0.25, 0]) {
    const positions: SubcategoryPosition[] = [];
    const occupied: LayoutRect[] = [];
    const last = { left: -1, right: -1 };

    for (let index = 0; index < nodes.length; index++) {
      const side = index % 2 === 0 ? "right" : "left";
      const slotIndex = Math.floor(index / 2);
      const count = side === "right" ? Math.ceil(nodes.length / 2) : Math.floor(nodes.length / 2);
      const preferred = Math.round(((slotIndex + 0.5) / count) * steps * spread);
      const node = nodes[index];

      for (let step = Math.max(last[side] + 1, preferred); step <= steps; step++) {
        const angle = (step / steps) * sweep;
        const position: SubcategoryPosition = {
          x: width / 2 + (side === "right" ? 1 : -1) * radiusX * Math.sin(angle),
          y: apex + radius * (1 - Math.cos(angle)) - node.iconHeight / 2,
          side,
          slotIndex,
        };
        const bounds = subcategoryBounds(node, position);
        if (bounds.some(box => box.left < 16 || box.right > width - 16 || box.top < 8
          || obstacles.some(obstacle => layoutRectsOverlap(box, obstacle))
          || occupied.some(other => layoutRectsOverlap(box, other)))) continue;

        positions.push(position);
        occupied.push(...bounds);
        last[side] = step;
        break;
      }
      if (positions.length !== index + 1) break;
    }

    if (positions.length === nodes.length) return positions;
  }
  return null;
}

/**
 * Mobile layout: subcategory tiles stack in centered rows under the copy
 * instead of arcing over it.
 *
 * A row holds at most SUBCATEGORY_MOBILE_ROW_MAX (4) tiles and, once there is
 * more than one row, at least 2. Rows are filled greedily with 4 tiles each;
 * the final two rows are then re-balanced evenly (larger half first) so the
 * layout never ends on a lone straggler. This gives:
 *   1 -> [1]        5 -> [3, 2]     8  -> [4, 4]
 *   2 -> [2]        6 -> [3, 3]     12 -> [4, 4, 4]
 *   3 -> [3]        7 -> [4, 3]     13 -> [4, 4, 3, 2]
 *   4 -> [4]
 */
export const SUBCATEGORY_MOBILE_ROW_MAX = 4;

export function computeSubcategoryMobileRows(count: number): number[] {
  if (count <= 0) return [];
  if (count <= SUBCATEGORY_MOBILE_ROW_MAX) return [count];

  const rowCount = Math.ceil(count / SUBCATEGORY_MOBILE_ROW_MAX);
  const rows = Array.from({ length: rowCount }, (_, i) =>
    i < rowCount - 1 ? SUBCATEGORY_MOBILE_ROW_MAX : count - SUBCATEGORY_MOBILE_ROW_MAX * (rowCount - 1),
  );

  const tail = rows[rowCount - 2] + rows[rowCount - 1];
  rows[rowCount - 2] = Math.ceil(tail / 2);
  rows[rowCount - 1] = Math.floor(tail / 2);

  return rows;
}

/**
 * Whether a subcategory tile should use the filled star icon, based purely on
 * its position (a checkerboard, per the design references) rather than any
 * per-tile data. Desktop arc: each side alternates starting with the right
 * side's pivot-closest slot filled and the left side's pivot-closest slot
 * plain. Mobile rows: alternates by (row + column) parity.
 */
export function isFilledStarSlot(position: { side: "left" | "right"; slotIndex: number }): boolean {
  const isEven = position.slotIndex % 2 === 0;
  return position.side === "right" ? isEven : !isEven;
}

export function isFilledStarCell(rowIndex: number, colIndex: number): boolean {
  return (rowIndex + colIndex) % 2 === 0;
}
