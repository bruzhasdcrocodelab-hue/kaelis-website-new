import type { CSSProperties } from "react";

const STROKE_WIDTH = 1;

const SHADOW_STOPS = [
  "-2px 4px 10px rgba(145, 145, 145, 0.05)",
  "-7px 17px 18px rgba(145, 145, 145, 0.04)",
  "-15px 37px 24px rgba(145, 145, 145, 0.03)",
  "-27px 66px 29px rgba(145, 145, 145, 0.01)",
];

const dropShadowFilter = SHADOW_STOPS.map((s) => `drop-shadow(${s})`).join(" ");

export interface WavesLineFrameProps {
  className?: string;
  style?: CSSProperties;
}

const rectStyle: CSSProperties = {
  x: STROKE_WIDTH / 2,
  y: STROKE_WIDTH / 2,
  width: `calc(100% - ${STROKE_WIDTH}px)`,
  height: `calc(100% - ${STROKE_WIDTH}px)`,
};

export default function WavesLineFrame({ className, style }: WavesLineFrameProps) {
  return (
    <svg
      className={className}
      style={{ filter: dropShadowFilter, ...style }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      <rect
        style={rectStyle}
        rx="16"
        ry="16"
        fill="none"
        stroke="#2F2F2F"
        strokeOpacity="0.07"
        strokeWidth={STROKE_WIDTH}
      />
    </svg>
  );
}
