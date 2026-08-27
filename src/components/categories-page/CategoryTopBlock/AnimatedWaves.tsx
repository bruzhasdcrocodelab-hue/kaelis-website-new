"use client";

import { useId, useMemo, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * "Running waves" effect — a narrow wavy ribbon running endlessly along a fixed
 * diagonal, one per top corner of the panel, matching
 * `public/images/backgrounds/waves-3.svg`.
 *
 * FRAME. Each ribbon is authored in a LOCAL frame: +y runs down the diagonal
 * (top-centre -> lower outer corner), x is across the band. That frame is
 * rotated + translated into place; the right ribbon is the exact mirror of the
 * left about the panel's vertical centre.
 *
 * SEAMLESS LOOP. The band's centre-line is a periodic wave of wavelength
 * WAVE_LENGTH. The animation advances the wave's PHASE by one full period; since
 * the wave (and everything derived from it) is exactly periodic, phase 0 and
 * phase 2*pi draw the identical shape, so the loop has no seam. The path is a
 * mask, redrawn from ~1 period of pre-sampled phase keyframes that `motion`
 * interpolates — cheap, and any sub-pixel interpolation error is invisible
 * through a mask.
 *
 * PERSPECTIVE TAPER. The band's half-width is a function of screen position
 * along the diagonal — small near the top-centre, full toward the outer edge.
 * Because the taper is baked into the (fixed-in-screen) path geometry rather
 * than layered as a clip, the band is genuinely squeezed, not cut. And because
 * the taper depends on screen y (not on the scrolling phase) it stays put while
 * the waves run under it, and it does not affect periodicity: at any fixed
 * screen y the half-width is the same on every loop.
 */

// waves-3.svg viewBox.
const VIEW_W = 1320;
const VIEW_H = 440;

// --- ribbon centre-line wave, in the local diagonal frame (x across, y along) ---
const WAVE_LENGTH = 340;
const WAVE_AMPLITUDE = 20;
const WAVE_HARMONIC_AMPLITUDE = 15;

// --- band width + perspective taper (both in the local frame) ---
// Half-width near the narrow (top-centre) end and out toward the wide edge.
const HALF_NARROW = 36;
const HALF_WIDE = 86;
// Local-y span over which the half-width eases from narrow to wide. The visible
// diagonal of the left ribbon runs from y ~= 0 (top edge) to y ~= 280 (exits
// the panel side), so the ramp resolves within that.
const TAPER_START_Y = -10;
const TAPER_END_Y = 310;

// Angle of the local +y axis, clockwise from straight down (SVG rotate() is
// clockwise), for the LEFT ribbon; positive swings the axis toward the
// lower-left corner. The right ribbon mirrors it.
const DIAGONAL_ANGLE_DEG = 56;

// LEFT ribbon's local origin in SVG space: at the top edge, in from the corner.
const ORIGIN_X = 230;
const ORIGIN_Y = -10;

// Ribbon must cover the whole visible diagonal at every phase. It is drawn from
// a few wavelengths before the origin to well past where the diagonal leaves
// the panel.
const LEAD_TILES = 2;
const RUNOUT_TILES = 5;
const SAMPLES_PER_WAVE = 44;

// Wave-phase keyframes over exactly one period (last == first for a clean loop).
const PHASE_FRAMES = 24;
const LOOP_DURATION_SECONDS = 6;

interface Vec {
  x: number;
  y: number;
}

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Local half-width of the band at along-axis position `y` (the taper). */
function halfWidthAt(y: number): number {
  if (y <= TAPER_START_Y) return HALF_NARROW;
  if (y >= TAPER_END_Y) return HALF_WIDE;
  const t = smoothstep((y - TAPER_START_Y) / (TAPER_END_Y - TAPER_START_Y));
  return HALF_NARROW + (HALF_WIDE - HALF_NARROW) * t;
}

/** Periodic centre-line offset (across the axis) at along-axis `y`, given phase. */
function waveOffset(y: number, phase: number): number {
  const k = (2 * Math.PI) / WAVE_LENGTH;
  return (
    Math.sin(y * k + phase) * WAVE_AMPLITUDE +
    Math.sin(y * k * 2 + phase * 2 + Math.PI / 3) * WAVE_HARMONIC_AMPLITUDE
  );
}

/** Smooth Catmull-Rom -> cubic-Bezier through `pts`. */
function spline(pts: Vec[], startCmd: "M" | "L"): string {
  let out = `${startCmd} ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    out += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return out;
}

/**
 * The ribbon at a given wave phase, as one filled path in the local frame.
 * Centre-line is the periodic wave; the two edges sit +/- halfWidthAt(y) from it,
 * so the band is squeezed near the top-centre and full toward the outer edge.
 */
function buildRibbonPath(phase: number): string {
  const yStart = -LEAD_TILES * WAVE_LENGTH;
  const yEnd = RUNOUT_TILES * WAVE_LENGTH;
  const step = WAVE_LENGTH / SAMPLES_PER_WAVE;

  const left: Vec[] = [];
  const right: Vec[] = [];
  for (let y = yStart; y <= yEnd + 0.001; y += step) {
    const c = waveOffset(y, phase);
    const h = halfWidthAt(y);
    left.push({ x: c - h, y });
    right.push({ x: c + h, y });
  }

  return `${spline(left, "M")} ${spline([...right].reverse(), "L")} Z`;
}

/**
 * Gradient endpoints for the LEFT ribbon, in SVG space, aimed along the
 * diagonal: waves-3.svg's stops run transparent -> opaque, so the transparent
 * end sits far down the diagonal and the opaque end near the top-outer corner.
 * The right ribbon's gradient is this mirrored across x = VIEW_W / 2.
 */
const rad = (DIAGONAL_ANGLE_DEG * Math.PI) / 180;
const alongToSvg = (d: number) => ({
  x: ORIGIN_X - Math.sin(rad) * d,
  y: ORIGIN_Y + Math.cos(rad) * d,
});
const GRAD_LEFT = {
  x1: alongToSvg(620).x,
  y1: alongToSvg(620).y,
  x2: alongToSvg(-40).x,
  y2: alongToSvg(-40).y,
};

interface RibbonSideProps {
  animate: boolean;
  maskId: string;
  gradientId: string;
  /** false = left ribbon, true = right ribbon (mirror of the left). */
  mirror: boolean;
}

function RibbonSide({ animate, maskId, gradientId, mirror }: RibbonSideProps) {
  // One period of phase keyframes; first frame repeated at the end so the loop
  // closes exactly.
  const frames = useMemo(() => {
    const out: string[] = [];
    // Negative phase so crests travel down-and-outward along +y (toward the
    // outer corner), not up the axis.
    for (let i = 0; i <= PHASE_FRAMES; i += 1) {
      out.push(buildRibbonPath(-(i / PHASE_FRAMES) * 2 * Math.PI));
    }
    return out;
  }, []);

  const place = `translate(${ORIGIN_X} ${ORIGIN_Y}) rotate(${DIAGONAL_ANGLE_DEG})`;
  const mirrorT = `translate(${VIEW_W} 0) scale(-1 1)`;
  const placed = mirror ? `${mirrorT} ${place}` : place;

  return (
    <>
      <mask
        id={maskId}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={VIEW_W}
        height={VIEW_H}
      >
        <g transform={placed}>
          {animate ? (
            <motion.path
              fill="#fff"
              initial={{ d: frames[0] }}
              animate={{ d: frames }}
              transition={{
                duration: LOOP_DURATION_SECONDS,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          ) : (
            <path d={frames[0]} fill="#fff" />
          )}
        </g>
      </mask>

      {/* Stationary gradient wash, revealed only through the moving ribbon. */}
      <rect
        x="0"
        y="0"
        width={VIEW_W}
        height={VIEW_H}
        fill={`url(#${gradientId})`}
        mask={`url(#${maskId})`}
      />
    </>
  );
}

export interface AnimatedWavesProps {
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedWaves({ className, style }: AnimatedWavesProps) {
  const prefersReducedMotion = useReducedMotion();
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const leftMaskId = `waves-mask-l-${rawId}`;
  const rightMaskId = `waves-mask-r-${rawId}`;
  const leftGradId = `waves-grad-l-${rawId}`;
  const rightGradId = `waves-grad-r-${rawId}`;

  const animate = !prefersReducedMotion;

  const gradStops = (
    <>
      <stop stopColor="#F5D0B0" stopOpacity="0" />
      <stop offset="0.533654" stopColor="#FFB6D0" stopOpacity="0.5" />
      <stop offset="1" stopColor="#E595E4" />
    </>
  );

  return (
    <svg
      width={VIEW_W}
      height={VIEW_H}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={leftGradId}
          x1={GRAD_LEFT.x1}
          y1={GRAD_LEFT.y1}
          x2={GRAD_LEFT.x2}
          y2={GRAD_LEFT.y2}
          gradientUnits="userSpaceOnUse"
        >
          {gradStops}
        </linearGradient>
        {/* Mirror of the left gradient across the panel's vertical centre. */}
        <linearGradient
          id={rightGradId}
          x1={VIEW_W - GRAD_LEFT.x1}
          y1={GRAD_LEFT.y1}
          x2={VIEW_W - GRAD_LEFT.x2}
          y2={GRAD_LEFT.y2}
          gradientUnits="userSpaceOnUse"
        >
          {gradStops}
        </linearGradient>
      </defs>

      <RibbonSide
        animate={animate}
        maskId={leftMaskId}
        gradientId={leftGradId}
        mirror={false}
      />
      <RibbonSide
        animate={animate}
        maskId={rightMaskId}
        gradientId={rightGradId}
        mirror
      />
    </svg>
  );
}
