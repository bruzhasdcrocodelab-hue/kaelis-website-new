/**
 * Decorative card fan for the mobile TopBlock panel (KAELIS design file,
 * node-id=1873-6170, "Group 2" under the mobile "Mask group"). Unlike the
 * desktop fan (see cardFan.ts) this is the full 21-card arc and it curves the
 * other way — a wide bowl sitting above the panel copy, clipped by the panel's
 * own `overflow: hidden`.
 *
 * Coordinates are the design's own, shifted into a 0-based frame: each
 * `left/top/width/height` is the card's ROTATED bounding box within the
 * MOBILE_FAN_CONTAINER_WIDTH-wide "Group 2" frame (the design's own values run
 * from x=-170.07 / y=-97.99, so +170.07 / +97.99 is added here), and the inner
 * card is drawn at its TRUE unrotated size (MOBILE_CARD_TRUE_WIDTH/HEIGHT,
 * constant across all cards) carrying the `rotate`. The frame is centered in the
 * panel so card "13" (the frame's visual center) lands under the panel center.
 */
export interface MobileFanCardSpec {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
  /** Card "13" is mirrored vertically in the design (front-facing center card). */
  flipY?: boolean;
}

export const MOBILE_FAN_CONTAINER_WIDTH = 729.66;
export const MOBILE_FAN_CONTAINER_HEIGHT = 390.99;

export const MOBILE_CARD_TRUE_WIDTH = 60;
export const MOBILE_CARD_TRUE_HEIGHT = 110;

const OX = 170.07;
const OY = 97.99;

export const cardFanMobile: MobileFanCardSpec[] = [
  { id: "1", left: 447.6 + OX, top: -86.46 + OY, width: 111.981, height: 63.715, rotate: 91.95 },
  { id: "22", left: 437.62 + OX, top: -47.81 + OY, width: 119.548, height: 80.174, rotate: 101.18 },
  { id: "21", left: 422.24 + OX, top: -8.68 + OY, width: 123.677, height: 93.051, rotate: 109.36 },
  { id: "20", left: 401.22 + OX, top: 28.2 + OY, width: 125.306, height: 104.951, rotate: 118.29 },
  { id: "19", left: 375.38 + OX, top: 62.83 + OY, width: 123.931, height: 114.197, rotate: 127.09 },
  { id: "18", left: 345.33 + OX, top: 94.35 + OY, width: 119.677, height: 120.713, rotate: 135.84 },
  { id: "17", left: 311.78 + OX, top: 121.97 + OY, width: 112.617, height: 124.422, rotate: 144.62 },
  { id: "16", left: 275.58 + OX, top: 145.02 + OY, width: 102.787, height: 125.203, rotate: 153.51 },
  { id: "15", left: 237.63 + OX, top: 162.99 + OY, width: 90.247, height: 122.916, rotate: 162.56 },
  { id: "14", left: 198.89 + OX, top: 175.52 + OY, width: 75.174, height: 117.471, rotate: 171.75 },
  {
    id: "13",
    left: MOBILE_FAN_CONTAINER_WIDTH / 2 - 1.91 - 60.958 / 2,
    top: 181.79 + OY,
    width: 60.958,
    height: 110.519,
    rotate: 0.5,
    flipY: true,
  },
  { id: "12", left: 104.14 + OX, top: 173.73 + OY, width: 75.469, height: 117.598, rotate: -171.58 },
  { id: "10", left: 50.86 + OX, top: 159.34 + OY, width: 90.393, height: 122.956, rotate: -162.46 },
  { id: "9", left: 1.11 + OX, top: 139.6 + OY, width: 102.805, height: 125.204, rotate: -153.5 },
  { id: "8", left: -43.97 + OX, top: 114.92 + OY, width: 112.57, height: 124.435, rotate: -144.67 },
  { id: "7", left: -83.41 + OX, top: 85.86 + OY, width: 119.629, height: 120.757, rotate: -135.91 },
  { id: "6", left: -116.35 + OX, top: 53.12 + OY, width: 123.913, height: 114.248, rotate: -127.15 },
  { id: "5", left: -141.97 + OX, top: 17.52 + OY, width: 125.306, height: 104.951, rotate: -118.29 },
  { id: "4", left: -159.58 + OX, top: -20.06 + OY, width: 123.648, height: 92.934, rotate: -109.28 },
  { id: "3", left: -169.09 + OX, top: -59.58 + OY, width: 119.45, height: 79.923, rotate: -101.03 },
  { id: "2", left: -170.07 + OX, top: -97.99 + OY, width: 112.693, height: 65.091, rotate: -92.69 },
];
