"use client";

import { useMemo, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Each corner blob is the exact wedge-shaped silhouette of
 * `public/images/backgrounds/waves-3.svg` (thick at the panel corner,
 * tapering to a point at its far tip) — that artwork is just one frame
 * (one phase) of this same running wave.
 *
 * Both of its edges — the wavy top edge and the wavy belly edge, traced
 * from the reference — are displaced by the very same vector at every
 * point: a sine wave perpendicular to the blob's main diagonal (side tip
 * -> far tip), keyed to how far that point has travelled along the whole
 * boundary. Because every point of the mass (both edges together) shifts
 * identically rather than the edges moving relative to each other, the
 * wedge's shape and depth are exactly preserved at every phase; only its
 * position ripples, like a flag. The three anchor points (side tip, far
 * tip, bottom tip) get zero shift, so the corners never detach from the
 * panel edge.
 */
const WAVE_AMPLITUDE = 22;
const WAVE_WAVELENGTH = 420;
const SAMPLES_PER_SEGMENT = 24;
const WAVE_LOOP_DURATION = 2.5;
const FRAME_COUNT = 48;

interface Point {
  x: number;
  y: number;
}

type CubicSegment = [Point, Point, Point, Point];

function cubicPoint(seg: CubicSegment, t: number): Point {
  const [p0, p1, p2, p3] = seg;
  const mt = 1 - t;
  return {
    x:
      mt * mt * mt * p0.x +
      3 * mt * mt * t * p1.x +
      3 * mt * t * t * p2.x +
      t * t * t * p3.x,
    y:
      mt * mt * mt * p0.y +
      3 * mt * mt * t * p1.y +
      3 * mt * t * t * p2.y +
      t * t * t * p3.y,
  };
}

/** Flattens a chain of cubic segments (in curve order) into a point list. */
function flattenSegments(segments: CubicSegment[]): Point[] {
  const points: Point[] = [];
  segments.forEach((seg, segIndex) => {
    const start = segIndex === 0 ? 0 : 1;
    for (let i = start; i <= SAMPLES_PER_SEGMENT; i += 1) {
      points.push(cubicPoint(seg, i / SAMPLES_PER_SEGMENT));
    }
  });
  return points;
}

/** Point's signed distance along `dir` from `origin`, used as the wave's input. */
function projectAlong(point: Point, origin: Point, dirX: number, dirY: number): number {
  return (point.x - origin.x) * dirX + (point.y - origin.y) * dirY;
}

function rippleMass(
  topNearToFar: Point[],
  bellyFarToNear: Point[],
  sideTip: Point,
  farTip: Point,
  bottomTip: Point,
  phase: number,
  waveSign: 1 | -1,
): { top: Point[]; belly: Point[] } {
  const dx = farTip.x - sideTip.x;
  const dy = farTip.y - sideTip.y;
  const diagonalLength = Math.hypot(dx, dy);
  const dirX = dx / diagonalLength;
  const dirY = dy / diagonalLength;
  const normalX = -dirY;
  const normalY = dirX;

  // The whole boundary tapers to zero displacement at its three anchor
  // points (side tip, far tip, bottom tip) so those corners stay put.
  const bottomAlong = projectAlong(bottomTip, sideTip, dirX, dirY);
  const totalAlong = Math.max(diagonalLength, Math.abs(bottomAlong));

  const shiftFor = (point: Point): Point => {
    const along = projectAlong(point, sideTip, dirX, dirY);
    const t = Math.min(Math.max(along / totalAlong, -1), 1);
    const taper = Math.sin(Math.PI * Math.abs(t));
    const wave =
      Math.sin((along / WAVE_WAVELENGTH) * 2 * Math.PI + phase) *
      WAVE_AMPLITUDE *
      taper *
      waveSign;
    return {
      x: point.x + normalX * wave,
      y: point.y + normalY * wave,
    };
  };

  return {
    top: topNearToFar.map(shiftFor),
    belly: bellyFarToNear.map(shiftFor),
  };
}

function toSmoothPath(points: Point[]): string {
  let d = `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} `;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += `C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} `;
  }
  return `${d.trim()} Z`;
}

interface BlobConfig {
  /** Wavy top edge, side tip -> far tip, traced from waves-3.svg. */
  topSegments: CubicSegment[];
  /** Wavy belly edge, far tip -> bottom tip, traced from waves-3.svg. */
  bellySegments: CubicSegment[];
  /** Mirrors ripple direction so left/right blobs bow the same visual way. */
  waveSign: 1 | -1;
}

function buildFrames(config: BlobConfig): string[] {
  const topNearToFar = flattenSegments(config.topSegments);
  const bellyFarToNear = flattenSegments(config.bellySegments);

  const sideTip = config.topSegments[0][0];
  const farTip = config.topSegments[config.topSegments.length - 1][3];
  const bottomTip =
    config.bellySegments[config.bellySegments.length - 1][3];

  const frames: string[] = [];
  for (let i = 0; i <= FRAME_COUNT; i += 1) {
    const phase = (i / FRAME_COUNT) * 2 * Math.PI;
    const { top, belly } = rippleMass(
      topNearToFar,
      bellyFarToNear,
      sideTip,
      farTip,
      bottomTip,
      phase,
      config.waveSign,
    );
    frames.push(toSmoothPath([...top, ...belly]));
  }
  return frames;
}

const LEFT_TOP_SEGMENTS: CubicSegment[] = [
  [
    { x: -215.855, y: 87.2208 },
    { x: -215.855, y: 87.2208 },
    { x: -130.968, y: 28.3702 },
    { x: -68.263, y: 21.7643 },
  ],
  [
    { x: -68.263, y: 21.7643 },
    { x: -12.572, y: 15.8973 },
    { x: 17.6142, y: 54.3318 },
    { x: 73.0265, y: 46.2461 },
  ],
  [
    { x: 73.0265, y: 46.2461 },
    { x: 122.839, y: 38.9775 },
    { x: 138.576, y: -17.2567 },
    { x: 191.367, y: -38.0671 },
  ],
  [
    { x: 191.367, y: -38.0671 },
    { x: 287.987, y: -76.1547 },
    { x: 456.421, y: -16.3914 },
    { x: 456.421, y: -16.3914 },
  ],
];

const LEFT_BELLY_SEGMENTS: CubicSegment[] = [
  [
    { x: 456.421, y: -16.3914 },
    { x: 456.421, y: -16.3914 },
    { x: 325.486, y: 2.94459 },
    { x: 273.32, y: 51.2807 },
  ],
  [
    { x: 273.32, y: 51.2807 },
    { x: 222.857, y: 98.0382 },
    { x: 248.486, y: 172.794 },
    { x: 198.023, y: 219.552 },
  ],
  [
    { x: 198.023, y: 219.552 },
    { x: 145.857, y: 267.888 },
    { x: 67.0883, y: 238.888 },
    { x: 14.922, y: 287.224 },
  ],
  [
    { x: 14.922, y: 287.224 },
    { x: -35.5407, y: 333.982 },
    { x: -60.3751, y: 455.495 },
    { x: -60.3751, y: 455.495 },
  ],
];

function mirrorSegmentsX(
  segments: CubicSegment[],
  axisX: number,
): CubicSegment[] {
  const mirrorPoint = (p: Point): Point => ({ x: 2 * axisX - p.x, y: p.y });
  return segments.map((seg) => seg.map(mirrorPoint) as CubicSegment);
}

// The right blob is the left blob's mirror image (see waves-3.svg),
// reflected across the panel's vertical center at x = 639.767.
const PANEL_CENTER_X = 639.767;
const RIGHT_TOP_SEGMENTS = mirrorSegmentsX(LEFT_TOP_SEGMENTS, PANEL_CENTER_X);
const RIGHT_BELLY_SEGMENTS = mirrorSegmentsX(
  LEFT_BELLY_SEGMENTS,
  PANEL_CENTER_X,
);

const LEFT_CONFIG: BlobConfig = {
  topSegments: LEFT_TOP_SEGMENTS,
  bellySegments: LEFT_BELLY_SEGMENTS,
  waveSign: 1,
};

const RIGHT_CONFIG: BlobConfig = {
  topSegments: RIGHT_TOP_SEGMENTS,
  bellySegments: RIGHT_BELLY_SEGMENTS,
  waveSign: -1,
};

export interface AnimatedWavesProps {
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedWaves({
  className,
  style,
}: AnimatedWavesProps) {
  const prefersReducedMotion = useReducedMotion();

  const leftFrames = useMemo(() => buildFrames(LEFT_CONFIG), []);
  const rightFrames = useMemo(() => buildFrames(RIGHT_CONFIG), []);

  return (
    <svg
      width="1320"
      height="440"
      viewBox="0 0 1320 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden
    >
      <motion.path
        initial={{ d: leftFrames[0] }}
        animate={prefersReducedMotion ? undefined : { d: leftFrames }}
        transition={{
          duration: WAVE_LOOP_DURATION,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
        fill="url(#paint0_linear_1464_3679)"
      />
      <motion.path
        initial={{ d: rightFrames[0] }}
        animate={prefersReducedMotion ? undefined : { d: rightFrames }}
        transition={{
          duration: WAVE_LOOP_DURATION,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
        fill="url(#paint1_linear_1464_3679)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1464_3679"
          x1="129.033"
          y1="291.794"
          x2="117.513"
          y2="-45.7297"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F5D0B0" stopOpacity="0" />
          <stop offset="0.533654" stopColor="#FFB6D0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#E595E4" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1464_3679"
          x1="1210.5"
          y1="291.794"
          x2="1222.02"
          y2="-45.7297"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F5D0B0" stopOpacity="0" />
          <stop offset="0.533654" stopColor="#FFB6D0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#E595E4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
