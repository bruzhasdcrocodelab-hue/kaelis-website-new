"use client";

import { useId, useMemo, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * "Running waves" effect — a wavy ribbon pulled straight down under a fixed
 * window.
 *
 * Think of `public/images/backgrounds/waves-3.svg` as one segment of an
 * endless ribbon: a band with a wavy edge on each side. Stack identical
 * segments vertically and, because every edge is the SAME periodic wave
 * sampled one period apart, the wide part of one segment flows seamlessly
 * into the narrow part of the next. That endless wavy band is used as a MASK;
 * the panel is the rectangular window it runs under. Sliding the mask down by
 * exactly one wave period lands it on a pixel-identical copy of itself, so the
 * loop is seamless and the waves appear to run forever, top to bottom.
 *
 * The gradient/opacity wash from waves-3.svg stays in a STATIONARY <rect>;
 * only the mask moves, so the colour never travels with the waves. Only a CSS
 * transform animates — no per-frame path recalculation.
 */

// waves-3.svg viewBox.
const VIEW_W = 1320;
const VIEW_H = 440;

// --- the periodic wave that forms every edge of the ribbon ---
// PERIOD is the vertical tile distance; the animation advances exactly this
// far per loop, so the wrap is invisible.
const WAVE_PERIOD = 300;
const WAVE_AMPLITUDE = 30;
const WAVE_HARMONIC_AMPLITUDE = 11;

// Each ribbon is a wide vertical band roughly matching one waves-3.svg wedge
// (its top edge spans ~670px). Its two edges are the same wave, offset
// vertically by BAND_PHASE_SHIFT (giving interlocking wide bellies / narrow
// necks) and horizontally by BAND_WIDTH.
const BAND_WIDTH = 620;
const BAND_PHASE_SHIFT = WAVE_PERIOD / 2;

// Enough periods to cover the window plus a period of slack top and bottom.
const SEGMENTS = 5;
const SAMPLES_PER_PERIOD = 44;

const LOOP_DURATION_SECONDS = 7;

interface Vec {
  x: number;
  y: number;
}

/** Periodic wave horizontal offset at height `y`. */
function waveOffset(y: number): number {
  const k = (2 * Math.PI) / WAVE_PERIOD;
  return (
    Math.sin(y * k) * WAVE_AMPLITUDE +
    Math.sin(y * k * 2 + Math.PI / 3) * WAVE_HARMONIC_AMPLITUDE
  );
}

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
 * The whole ribbon as one filled path in local space (x right, y down).
 * Left edge:  x = waveOffset(y)
 * Right edge: x = waveOffset(y + BAND_PHASE_SHIFT) + BAND_WIDTH
 * Both are the same wave, so segment k's edges line up with segment k+1's —
 * the stack has no seam and advancing y by WAVE_PERIOD is invisible.
 */
function buildRibbonPath(): string {
  const yStart = -WAVE_PERIOD;
  const yEnd = yStart + SEGMENTS * WAVE_PERIOD;
  const step = WAVE_PERIOD / SAMPLES_PER_PERIOD;

  const left: Vec[] = [];
  const right: Vec[] = [];
  for (let y = yStart; y <= yEnd + 0.001; y += step) {
    left.push({ x: waveOffset(y), y });
    right.push({ x: waveOffset(y + BAND_PHASE_SHIFT) + BAND_WIDTH, y });
  }

  return `${spline(left, "M")} ${spline([...right].reverse(), "L")} Z`;
}

interface RibbonConfig {
  /** SVG-space translation applied to the ribbon's local origin. */
  offsetX: number;
  /** true => mirror horizontally so the band hugs the right corner. */
  mirror: boolean;
  gradientId: string;
}

function Ribbon({
  config,
  animate,
  maskId,
}: {
  config: RibbonConfig;
  animate: boolean;
  maskId: string;
}) {
  const { offsetX, mirror, gradientId } = config;
  const ribbonPath = useMemo(() => buildRibbonPath(), []);

  const sx = mirror ? -1 : 1;
  const shape = (
    <g transform={`translate(${offsetX} 0) scale(${sx} 1)`}>
      <path d={ribbonPath} fill="#fff" />
    </g>
  );

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
        {animate ? (
          <motion.g
            initial={{ y: 0 }}
            animate={{ y: WAVE_PERIOD }}
            transition={{
              duration: LOOP_DURATION_SECONDS,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            {shape}
          </motion.g>
        ) : (
          shape
        )}
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

  const animate = !prefersReducedMotion;

  // Local band spans x in [~0, BAND_WIDTH]; place the left one so its outer
  // edge sits past the left panel edge (waves-3.svg's wedge starts near
  // x = -215), the right one mirrored.
  const leftConfig: RibbonConfig = {
    offsetX: -215,
    mirror: false,
    gradientId: "paint0_linear_1464_3679",
  };
  const rightConfig: RibbonConfig = {
    offsetX: VIEW_W + 215,
    mirror: true,
    gradientId: "paint1_linear_1464_3679",
  };

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

      <Ribbon config={leftConfig} animate={animate} maskId={leftMaskId} />
      <Ribbon config={rightConfig} animate={animate} maskId={rightMaskId} />
    </svg>
  );
}
