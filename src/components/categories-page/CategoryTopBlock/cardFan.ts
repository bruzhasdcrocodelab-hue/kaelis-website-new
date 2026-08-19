/**
 * Decorative 21-card fan behind the TopBlock panel (KAELIS design file,
 * node-id=1464-1491, "Mask group" under TopBlock). Positions are relative to
 * the fan's own 1400x415.4px container, which sits centered at the bottom of
 * the TopBlock panel. Every card renders the same shared image per the task
 * (`/images/cards/default-card.png`) — only position/size/rotation differ.
 */
export interface FanCardSpec {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
}

export const FAN_CONTAINER_WIDTH = 1400;
export const FAN_CONTAINER_HEIGHT = 415.4;

export const cardFan: FanCardSpec[] = [
  { id: "1", left: 1379.6, top: -334.2, width: 179.1, height: 102.7, rotate: 91.95 },
  { id: "22", left: 1374.8, top: -223.2, width: 191.3, height: 129.0, rotate: 101.18 },
  { id: "21", left: 1352.6, top: -116.1, width: 198.0, height: 149.6, rotate: 109.35 },
  { id: "20", left: 1314.3, top: -12.3, width: 200.8, height: 168.5, rotate: 118.29 },
  { id: "19", left: 1260.6, top: 84.2, width: 198.7, height: 183.3, rotate: 127.09 },
  { id: "18", left: 1192.9, top: 171.3, width: 192.0, height: 193.6, rotate: 135.84 },
  { id: "17", left: 1112.6, top: 247.1, width: 180.7, height: 199.4, rotate: 144.62 },
  { id: "16", left: 1021.7, top: 309.9, width: 165.1, height: 200.6, rotate: 153.51 },
  { id: "15", left: 922.0, top: 358.2, width: 145.1, height: 196.8, rotate: 162.55 },
  { id: "14", left: 815.7, top: 390.7, width: 121.0, height: 188.0, rotate: 171.75 },
  { id: "13", left: 610.6, top: 229.8, width: 97.0, height: 176.1, rotate: 0.1 },
  { id: "12", left: 597.3, top: 404.4, width: 121.5, height: 188.2, rotate: -171.58 },
  { id: "10", left: 487.9, top: 386.6, width: 145.3, height: 196.9, rotate: -162.45 },
  { id: "9", left: 382.7, top: 352.1, width: 165.1, height: 200.6, rotate: -153.49 },
  { id: "8", left: 284.3, top: 301.8, width: 180.7, height: 199.5, rotate: -144.66 },
  { id: "7", left: 194.9, top: 237.2, width: 191.9, height: 193.7, rotate: -135.91 },
  { id: "6", left: 116.3, top: 159.6, width: 198.6, height: 183.3, rotate: -127.15 },
  { id: "5", left: 50.3, top: 71.0, width: 200.8, height: 168.5, rotate: -118.29 },
  { id: "4", left: -1.6, top: -27.0, width: 198.0, height: 149.4, rotate: -109.27 },
  { id: "3", left: -36.8, top: -130.7, width: 191.2, height: 128.6, rotate: -101.03 },
  { id: "2", left: -55.8, top: -235.9, width: 180.3, height: 104.9, rotate: -92.69 },
];
