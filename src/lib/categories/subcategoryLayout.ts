/**
 * Positions subcategory tiles along the "subcategory reference line" from the
 * Figma design (KAELIS design file, node-id=1464-3086 for the reference guide).
 *
 * The tiles are NOT evenly distributed on a fixed-radius arc. Cross-referencing
 * the exact tile coordinates from the Family (4 subs, node 1464-1491), Forecast
 * (3 subs, node 1464-2931), Dreams (1 sub, node 1464-2341) and Love (13 subs,
 * node 1464-2479) frames shows a fixed, indexed slot table: tiles fill
 * alternately right/left starting from the innermost slot on the right, and
 * each side's slots grow in both angle (from vertical) and radial distance as
 * they move outward. All coordinates below were derived from Love's 13 tiles
 * (7 right + 6 left, which fully populate the observed slot table) with a
 * pivot at (720, 156) in a 1440px-wide design frame; Family/Forecast/Dreams
 * tile positions match these same slots to within ~1px.
 *
 * Slots beyond the last known one are extrapolated by continuing the average
 * angle/distance step of the last few known slots on that side.
 */

export const SLOT_PIVOT = { x: 720, y: 156 };
export const DESIGN_WIDTH = 1440;

interface Slot {
  /** Degrees from vertical "up" (positive = right side, negative = left side). */
  angle: number;
  /** Distance in px from the pivot to the tile's icon center. */
  distance: number;
}

const RIGHT_SLOTS: Slot[] = [
  { angle: 95.0, distance: 160.6 },
  { angle: 99.02, distance: 255.2 },
  { angle: 101.58, distance: 333.8 },
  { angle: 107.24, distance: 425.1 },
  { angle: 110.62, distance: 513.9 },
  { angle: 114.05, distance: 601.2 },
  { angle: 117.82, distance: 696.5 },
];

const LEFT_SLOTS: Slot[] = [
  { angle: -96.08, distance: 170.0 },
  { angle: -98.88, distance: 259.1 },
  { angle: -103.48, distance: 351.7 },
  { angle: -108.91, distance: 459.8 },
  { angle: -113.03, distance: 565.0 },
  { angle: -116.29, distance: 657.0 },
];

function extrapolateSlots(slots: Slot[], count: number): Slot[] {
  if (count <= slots.length) return slots.slice(0, count);

  const sampleSize = Math.min(3, slots.length - 1);
  let angleStep = 0;
  let distanceStep = 0;
  for (let i = slots.length - sampleSize; i < slots.length; i++) {
    angleStep += slots[i].angle - slots[i - 1].angle;
    distanceStep += slots[i].distance - slots[i - 1].distance;
  }
  angleStep /= sampleSize;
  distanceStep /= sampleSize;

  const extended = slots.slice();
  while (extended.length < count) {
    const last = extended[extended.length - 1];
    extended.push({ angle: last.angle + angleStep, distance: last.distance + distanceStep });
  }
  return extended;
}

function slotToPoint(slot: Slot): { xPct: number; yPx: number } {
  const rad = (slot.angle * Math.PI) / 180;
  const x = SLOT_PIVOT.x + Math.sin(rad) * slot.distance;
  const y = SLOT_PIVOT.y - Math.cos(rad) * slot.distance;
  return { xPct: (x / DESIGN_WIDTH) * 100, yPx: y };
}

export interface SubcategoryPosition {
  /** Horizontal position as a percentage of the page width (scales with viewport). */
  xPct: number;
  /** Vertical position in px from the top of the hero section's arc container. */
  yPx: number;
  side: "left" | "right";
}

/**
 * Computes tile positions for `count` subcategories, filling alternately
 * right/left from the innermost slot outward (right gets the extra slot when
 * count is odd), matching the fill order observed across every reference.
 */
export function computeSubcategoryPositions(count: number): SubcategoryPosition[] {
  const rightCount = Math.ceil(count / 2);
  const leftCount = Math.floor(count / 2);

  const rightSlots = extrapolateSlots(RIGHT_SLOTS, rightCount);
  const leftSlots = extrapolateSlots(LEFT_SLOTS, leftCount);

  const positions: SubcategoryPosition[] = [];
  for (let i = 0; i < count; i++) {
    const isRight = i % 2 === 0;
    const slot = isRight ? rightSlots[i / 2] : leftSlots[(i - 1) / 2];
    positions.push({ ...slotToPoint(slot), side: isRight ? "right" : "left" });
  }
  return positions;
}
