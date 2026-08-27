"use client";

import { useId, useMemo, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * "Running waves" effect — a narrow wavy ribbon pulled endlessly along a fixed
 * diagonal, one per top corner of the panel.
 *
 * `public/images/backgrounds/waves-3.svg` puts a slim wavy band in each top
 * corner, lying on the diagonal that runs from near the top-centre out to the
 * lower outer corner. The ribbon's shape is authored in a LOCAL FRAME whose +y
 * axis is that diagonal, then rotated + translated into place. The animation
 * slides the ribbon along its own +y, so the waves travel down-and-outward
 * along the diagonal (not straight down). The right ribbon is the exact mirror
 * of the left about the panel's vertical centre — same position, shape and
 * motion, flipped.
 *
 * One wavelength of the ribbon edge is a tile: the edge is a single periodic
 * wave, so advancing exactly one wavelength lands the ribbon on a pixel-perfect
 * copy of itself and the loop is seamless.
 *
 * The ribbon is a MASK over a STATIONARY gradient <rect>; the gradient vector
 * is aimed along the same diagonal (mirrored per side) so the colour falloff
 * follows the ribbon, and it never moves while the waves run under it. Only one
 * CSS transform animates — no per-frame path recalculation.
 */

// waves-3.svg viewBox.
const VIEW_W = 1320;
const VIEW_H = 440;

// --- ribbon geometry, in the local diagonal frame (x = across, y = along) ---
// Both long edges share ONE periodic wave in phase, so the band keeps a
// constant width and just snakes — a smooth serpentine, no lumps.
const WAVE_LENGTH = 340;
const WAVE_AMPLITUDE = 20;
const WAVE_HARMONIC_AMPLITUDE = 20;
const RIBBON_WIDTH = 86;

// Angle of the local +y axis, clockwise from straight down, for the LEFT
// ribbon. SVG rotate() is clockwise, so a POSITIVE angle swings the downward
// axis toward the lower-LEFT corner — the ribbon enters at the top edge near
// centre and sweeps out through the left edge, hugging the corner along the
// reference diagonal. The right ribbon mirrors it.
const DIAGONAL_ANGLE_DEG = 56;

// The LEFT ribbon's local origin in SVG space: right at the top edge, offset in
// from the outer corner. The diagonal axis runs down-and-left from here.
const ORIGIN_X = 230;
const ORIGIN_Y = -10;

// The ribbon must always cover the whole visible diagonal at EVERY point in the
// loop cycle. The mask slides its local y by +WAVE_LENGTH each loop, so the
// ribbon's trailing (top) end retreats by one wavelength — it needs a few
// wavelengths of lead-in above the origin, and plenty of run-out past where the
// diagonal leaves the panel. All in whole wavelengths so the wave stays
// periodic and the wrap is seamless.
const LEAD_TILES = 3; // wavelengths of ribbon above the origin
const RUNOUT_TILES = 8; // wavelengths of ribbon below the origin
const SAMPLES_PER_WAVE = 40;

const LOOP_DURATION_SECONDS = 6;

interface Vec {
  x: number;
  y: number;
}

/** Periodic serpentine offset (across the axis) at along-axis position `s`. */
function waveOffset(s: number): number {
  const k = (2 * Math.PI) / WAVE_LENGTH;
  return (
    Math.sin(s * k) * WAVE_AMPLITUDE +
    Math.sin(s * k * 2 + Math.PI / 3) * WAVE_HARMONIC_AMPLITUDE
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
 * The ribbon as one filled path in the local diagonal frame. Both edges use the
 * same in-phase wave, so width is constant and one wavelength up the axis is
 * identical to the next.
 */
function buildRibbonPath(): string {
  const yStart = -LEAD_TILES * WAVE_LENGTH;
  const yEnd = RUNOUT_TILES * WAVE_LENGTH;
  const step = WAVE_LENGTH / SAMPLES_PER_WAVE;

  const left: Vec[] = [];
  const right: Vec[] = [];
  for (let y = yStart; y <= yEnd + 0.001; y += step) {
    const c = waveOffset(y);
    left.push({ x: c - RIBBON_WIDTH / 2, y });
    right.push({ x: c + RIBBON_WIDTH / 2, y });
  }

  return `${spline(left, "M")} ${spline([...right].reverse(), "L")} Z`;
}

/**
 * Gradient endpoints for the LEFT ribbon, in SVG space, aimed along the
 * diagonal. waves-3.svg's stops run transparent -> opaque, so the transparent
 * end (x1,y1) is placed far down the diagonal and the opaque end (x2,y2) near
 * the top-outer corner — dense pink at the corner, fading as the ribbon runs
 * inward, matching waves-3.svg. The right ribbon's gradient is this mirrored
 * across x = VIEW_W / 2.
 */
// A local along-axis distance d maps to SVG (ORIGIN - d*sinθ, ORIGIN + d*cosθ)
// under SVG's clockwise rotate(). Transparent end far down-axis, opaque end
// just past the top-outer corner.
const rad = (DIAGONAL_ANGLE_DEG * Math.PI) / 180;
const GRAD_LEN = 620;
const alongToSvg = (d: number) => ({
  x: ORIGIN_X - Math.sin(rad) * d,
  y: ORIGIN_Y + Math.cos(rad) * d,
});
const GRAD_LEFT = {
  x1: alongToSvg(GRAD_LEN).x,
  y1: alongToSvg(GRAD_LEN).y,
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
  const ribbonPath = useMemo(() => buildRibbonPath(), []);

  // Left ribbon: rotate local +y onto the diagonal, move to the origin.
  // Right ribbon: the whole thing mirrored about x = VIEW_W / 2.
  const place = `translate(${ORIGIN_X} ${ORIGIN_Y}) rotate(${DIAGONAL_ANGLE_DEG})`;
  const mirrorT = `translate(${VIEW_W} 0) scale(-1 1)`;

  const staticPath = <path d={ribbonPath} fill="#fff" />;

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
        <g transform={mirror ? `${mirrorT} ${place}` : place}>
          {animate ? (
            <motion.g
              initial={{ y: 0 }}
              animate={{ y: WAVE_LENGTH }}
              transition={{
                duration: LOOP_DURATION_SECONDS,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              {staticPath}
            </motion.g>
          ) : (
            staticPath
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
