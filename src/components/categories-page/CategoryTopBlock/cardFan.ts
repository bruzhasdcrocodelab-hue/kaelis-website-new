/**
 * Decorative 21-card fan behind the TopBlock panel (KAELIS design file,
 * node-id=1464-1491, "Mask group" under TopBlock). The cards' wrapping divs
 * (`Mask group` / `Group 2`) use `display: contents` in the Figma dump, so
 * they don't establish a containing block — each card's left/top/width/height
 * is effectively relative to the TopBlock panel itself (1320x440, clipped by
 * the panel's own `overflow: clip`), not to a smaller sub-container.
 *
 * Per card, the dump nests a `flex items-center justify-center` box sized to
 * the ROTATED bounding box (left/top/width/height below) around an inner
 * element at the card's TRUE unrotated size (CARD_TRUE_WIDTH/HEIGHT,
 * constant across all 21 cards) that carries the `rotate(...)` transform.
 * Every card renders the same shared image per the task
 * (`/images/cards/default-card.png`) — only position/rotation differ.
 */
export interface FanCardSpec {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
}

export const FAN_CONTAINER_WIDTH = 1320;
export const FAN_CONTAINER_HEIGHT = 440;

export const CARD_TRUE_WIDTH = 96.749;
export const CARD_TRUE_HEIGHT = 175.908;

export const cardFan: FanCardSpec[] = [
  // { id: "1", left: 1379.6, top: -334.2, width: 97.0, height: 176.0, rotate: 91.95 },
  // { id: "22", left: 1374.8, top: -223.2, width: 97.0, height: 176.0, rotate: 101.18 },
  // { id: "21", left: 1352.6, top: -116.1, width: 97.0, height: 176.0, rotate: 109.35 },
  { id: "20", left: 1170.3, top: -112.3, width: 97.0, height: 176.0, rotate: 118.29 },
  { id: "19", left: 1119.6, top: -27, width: 97.0, height: 176.0, rotate: 127.09 },
  { id: "18", left: 1053.9, top: 46.3, width: 97.0, height: 176.0, rotate: 135.84 },
  { id: "17", left: 977.6, top: 109.1, width: 97.0, height: 176.0, rotate: 144.62 },
  { id: "16", left: 892.7, top: 159.7, width: 97.0, height: 176.0, rotate: 153.51 },
  { id: "15", left: 803.0, top: 196, width: 97.0, height: 176.0, rotate: 162.55 },
  { id: "14", left: 707.7, top: 218.4, width: 97.0, height: 176.0, rotate: 171.75 },
  { id: "13", left: 611, top: 225.8, width: 97.0, height: 176.0, rotate: 180 },
  { id: "12", left: 514.3, top: 218.4, width: 97.0, height: 176.0, rotate: -171.58 },
  { id: "10", left: 419.3, top: 195, width: 97.0, height: 176.0, rotate: -162.45 },
  { id: "9", left: 328.7, top: 157.7, width: 97.0, height: 176.0, rotate: -153.49 },
  { id: "8", left: 245.6, top: 106.8, width: 97.0, height: 176.0, rotate: -144.66 },
  { id: "7", left: 169.5, top: 44.2, width: 97.0, height: 176.0, rotate: -135.91 },
  { id: "6", left: 105.3, top: -30, width: 97.0, height: 176.0, rotate: -127.15 },
  { id: "5", left: 52.3, top: -110.0, width: 97.0, height: 176.0, rotate: -118.29 },
  // { id: "4", left: -1.6, top: -27.0, width: 97.0, height: 176.0, rotate: -109.27 },
  // { id: "3", left: -36.8, top: -130.7, width: 97.0, height: 176.0, rotate: -101.03 },
  // { id: "2", left: -55.8, top: -235.9, width: 97.0, height: 176.0, rotate: -92.69 },
];
