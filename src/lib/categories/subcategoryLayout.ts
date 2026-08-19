/**
 * Positions subcategory tiles along the "subcategory reference line" from the
 * Figma design (KAELIS design file, node-id=1464-3086 for the reference guide).
 *
 * The tiles are NOT evenly distributed on a fixed-radius arc, and cross-referencing
 * the exact tile coordinates across references with different counts (Dreams: 1,
 * Forecast: 3, Family: 4, Love: 13, nodes 1464-2341/2931/1491/2479) shows the
 * per-tile placement isn't a single closed-form function of index — it reads as
 * hand-placed per screen. What IS consistent is the outer envelope: a maximum
 * per-side slot table (angle from vertical + radial distance from a pivot) that
 * spans from close-to-center/high up to far-from-center/low, derived from Love's
 * 13 tiles (7 right + 6 left, the densest reference, which fully populates the
 * table) with a pivot at (720, 156) in the 1440px-wide "Categories" page frame.
 *
 * To reproduce the "fewer items -> more spread out" behavior visible across
 * references (e.g. Family's 2-per-side tiles sit much farther apart than two
 * consecutive Love tiles would), each side's N tiles are sampled at evenly
 * spaced indices across the FULL slot table for that count, rather than taking
 * the first N (densely-packed) slots — this is an approximation the max-density
 * table doesn't fully pin down analytically, but it matches the observed trend.
 *
 * The pivot is expressed here relative to the hero section (`CategoryHeroSection`),
 * not the page: Figma's page-absolute pivot y=156 sits 124px below the page's
 * Top Bar (the "section" frame that holds the reference line starts at
 * page y=124), so the section-relative pivot y is 156 - 124 = 32.
 *
 * Slots beyond the last known one are extrapolated by continuing the average
 * angle/distance step of the last few known slots on that side.
 */

export const SLOT_PIVOT = { x: 720, y: 32 };
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

/**
 * Picks `count` slots out of `slots` (the max-density table for one side),
 * evenly spaced across a fractional window of the index range that widens
 * as `count` approaches the table's full size — so a small count spreads out
 * across a moderate middle portion of the range (matching the "fewer items
 * sit farther apart" trend observed across references) while a count near
 * the table's max density uses the full range (matching Love's 13-tile case).
 */
function sampleEvenly(slots: Slot[], count: number): Slot[] {
  if (count <= 0) return [];

  const density = Math.min(count / slots.length, 1);
  const lo = 0.15 * (1 - density);
  const hi = 0.7 + 0.3 * density;
  const lastIndex = slots.length - 1;

  if (count === 1) return [slots[Math.round(((lo + hi) / 2) * lastIndex)]];

  const picked: Slot[] = [];
  for (let i = 0; i < count; i++) {
    const t = lo + ((hi - lo) * i) / (count - 1);
    picked.push(slots[Math.round(t * lastIndex)]);
  }
  return picked;
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
 * Computes tile positions for `count` subcategories, alternating right/left
 * (right gets the extra tile when count is odd) for visual balance. Each
 * side's tiles are spread evenly across that side's full slot range so a
 * small count doesn't cluster near the center.
 */
export function computeSubcategoryPositions(count: number): SubcategoryPosition[] {
  const rightCount = Math.ceil(count / 2);
  const leftCount = Math.floor(count / 2);

  const rightTable = extrapolateSlots(RIGHT_SLOTS, Math.max(rightCount, RIGHT_SLOTS.length));
  const leftTable = extrapolateSlots(LEFT_SLOTS, Math.max(leftCount, LEFT_SLOTS.length));

  const rightSlots = sampleEvenly(rightTable, rightCount);
  const leftSlots = sampleEvenly(leftTable, leftCount);

  const positions: SubcategoryPosition[] = [];
  for (let i = 0; i < count; i++) {
    const isRight = i % 2 === 0;
    const slot = isRight ? rightSlots[i / 2] : leftSlots[(i - 1) / 2];
    positions.push({ ...slotToPoint(slot), side: isRight ? "right" : "left" });
  }
  return positions;
}
