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

const OX = 159;
const OY = 108;

export const cardFanMobile: MobileFanCardSpec[] = [
  // { id: "1", left: 447.6 + OX, top: -86.46 + OY, width: 60, height: 110, rotate: 91.95 },

  { id: "22", left: 462.9 + OX, top: -61.81 + OY, width: 60, height: 110, rotate: 101.18 },

  { id: "21", left: 450.24 + OX, top: -16.68 + OY, width: 60, height: 110, rotate: 109.36 },
  { id: "20", left: 432.22 + OX, top: 26.2 + OY, width: 60, height: 110, rotate: 118.29 },
  { id: "19", left: 406.38 + OX, top: 65.83 + OY, width: 60, height: 110, rotate: 127.09 },
  { id: "18", left: 375.33 + OX, top: 100.3 + OY, width: 60, height: 110, rotate: 135.84 },
  { id: "17", left: 338.98 + OX, top: 128.8 + OY, width: 60, height: 110, rotate: 144.62 },
  { id: "16", left: 298.58 + OX, top: 152.7 + OY, width: 60, height: 110, rotate: 153.51 },
  { id: "15", left: 254.63 + OX, top: 169.5 + OY, width: 60, height: 110, rotate: 162.56 },
  { id: "14", left: 208.89 + OX, top: 179.52 + OY, width: 60, height: 110, rotate: 171.75 },
  {
    id: "13",
    left: 165 + OX,
    top: 182.79 + OY,
    width: 60,
    height: 110,
    rotate: -0.5,
    flipY: true,
  },
  { id: "12", left: 114.0 + OX, top: 178.2 + OY, width: 60, height: 110, rotate: -171.58 },
  { id: "10", left: 67.5 + OX, top: 166.8 + OY, width: 60, height: 110, rotate: -162.46 },
  { id: "9", left: 24.11 + OX, top: 148.0 + OY, width: 60, height: 110, rotate: -153.5 },
  { id: "8", left: -15.97 + OX, top: 123.5 + OY, width: 60, height: 110, rotate: -144.67 },
  { id: "7", left: -51.41 + OX, top: 92.86 + OY, width: 60, height: 110, rotate: -135.91 },
  { id: "6", left: -81.35 + OX, top: 57.12 + OY, width: 60, height: 110, rotate: -127.15 },
  { id: "5", left: -105.97 + OX, top: 17.52 + OY,width: 60, height: 110, rotate: -118.29 },
  { id: "4", left: -123.58 + OX, top: -24.06 + OY, width: 60, height: 110, rotate: -109.28 },
  { id: "3", left: -134.09 + OX, top: -69.58 + OY, width: 60, height: 110, rotate: -101.03 },

  // { id: "2", left: -170.07 + OX, top: -97.99 + OY, width: 60, height: 110, rotate: -92.69 },
];
