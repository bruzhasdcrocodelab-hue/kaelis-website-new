import { useId, type CSSProperties } from "react";

const STROKE_WIDTH = 2;

const SHADOW_STOPS = [
  "-2px 4px 10px rgba(145, 145, 145, 0.05)",
  "-7px 17px 18px rgba(145, 145, 145, 0.04)",
  "-15px 37px 24px rgba(145, 145, 145, 0.03)",
  "-27px 66px 29px rgba(145, 145, 145, 0.01)",
];

const dropShadowFilter = SHADOW_STOPS.map((s) => `drop-shadow(${s})`).join(" ");

const rectStyle: CSSProperties = {
  x: STROKE_WIDTH / 2,
  y: STROKE_WIDTH / 2,
  width: `calc(100% - ${STROKE_WIDTH}px)`,
  height: `calc(100% - ${STROKE_WIDTH}px)`,
};

export interface GradientWavesLineFrameProps {
  className?: string;
  style?: CSSProperties;
}

export default function GradientWavesLineFrame({
  className,
  style,
}: GradientWavesLineFrameProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gradientId = `gradient-waves-line-${rawId}`;

  return (
    <svg
      className={className}
      style={{ filter: dropShadowFilter, ...style }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0.317" x2="0" y2="1">
          <stop stopColor="#F5D0B0" stopOpacity="0" />
          <stop offset="0.533654" stopColor="#FFB6D0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#E595E4" />
        </linearGradient>
      </defs>
      <rect
        style={rectStyle}
        rx="30"
        ry="30"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={STROKE_WIDTH}
      />
    </svg>
  );
}
