import type { Easing } from "motion/react";

export type PatternProperty = "x" | "y" | "rotate" | "scaleX" | "scaleY" | "opacity";

export type PatternTiming = {
  duration: number;
  times: number[];
  ease: Easing | Easing[];
};

export type PatternAnimation = {
  initial: Partial<Record<PatternProperty, number>>;
  animate: Partial<Record<PatternProperty, number[]>>;
  transition: Partial<Record<PatternProperty, PatternTiming>>;
  style?: { transformOrigin: string };
};

export type PatternLayer = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  asset: string;
  animation?: PatternAnimation;
};

export type PatternNode = PatternLayer | {
  mask?: PatternLayer;
  translateY?: number;
  children: PatternNode[];
};
