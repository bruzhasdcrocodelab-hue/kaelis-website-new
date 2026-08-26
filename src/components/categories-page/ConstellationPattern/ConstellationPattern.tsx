import styles from "./ConstellationPattern.module.css";

/**
 * Recreation of pattern-categories.svg (Figma node-id=1494-744, "BG") as animatable
 * SVG primitives instead of the flattened stroke-to-fill export. Geometry (ring radii,
 * moon positions, constellation path) is copied from that export so the static frame
 * matches pixel-for-pixel; layers are regrouped so each piece named in the animation
 * spec can be transformed independently.
 */
const CENTER_X = 790.5;
const CENTER_Y = 744.5;

/**
 * Soft elliptical hole cut behind the title/description text (.titleWrap in
 * CategoryHeroSection), so the animated rings/moons don't clash with the copy.
 * Position/size are derived from .titleWrap's on-screen box relative to this
 * SVG's origin (measured at the default viewport; the mask is defined in the
 * SVG's own coordinate space so it scales together with the pattern).
 */
const TITLE_CUTOUT_X = 786;
const TITLE_CUTOUT_Y = 210;
const TITLE_CUTOUT_RX = 960;
const TITLE_CUTOUT_RY = 310;

const CONSTELLATION_PATH =
  "M796.508 323.135L845.33 398.996M845.33 398.996L793.504 428.288L842.325 441.057L845.33 398.996ZM957.995 421.529L976.772 447.817M976.772 447.817L1011.32 429.04M976.772 447.817L980.528 487.625M980.528 487.625L1011.32 481.616L1049.63 489.879M980.528 487.625L976.772 519.922V552.971M1202.1 607.05L1192.34 592.779L1161.54 607.05L1153.28 623.574M1153.28 623.574L1166.05 643.854L1161.54 673.898L1072.91 633.338L1018.08 623.574L1079.67 607.05L1153.28 623.574ZM1102.96 758.021L1133 795.575M1133 795.575L1063.15 817.357M1133 795.575L1154.03 809.095L1204.35 823.366M1006.06 990.861L1048.13 963.821L1067.65 944.293M1067.65 944.293L1105.21 936.031L1123.24 924.764M1067.65 944.293L1033.86 931.524L991.043 970.581M906.92 1029.92L903.916 1098.56L906.92 1107.71M906.92 1107.71L926.448 1092.61L960.999 1029.92M906.92 1107.71L898.658 1128.31L918.937 1156.68L898.658 1168.12M700.368 1141.08L724.403 1127.56L782.238 1064.47M637.276 1003.63L566.672 1060.71L562.917 1097.52L553.904 1101.27L550.899 1127.56L525.362 1066.72L532.873 1029.92L493.065 1024.66L496.069 1003.63M378.147 969.83L469.781 938.284L475.039 918.756M475.039 918.756H487.807L480.296 875.192M475.039 918.756L441.239 907.489L390.916 892.467M480.296 875.192L452.506 862.423L445.746 824.117L457.763 818.108L499.825 862.423L480.296 875.192ZM402.182 565.739L427.719 562.735L455.51 585.268M455.51 585.268H495.318M455.51 585.268L444.243 607.05M495.318 585.268L492.314 552.22L508.087 534.193M495.318 585.268L517.851 619.067M508.087 534.193H548.646V549.215L508.087 534.193ZM508.087 534.193L495.318 514.665M621.163 411.764L640.28 425.274L653.049 434.297L625.258 483.119M621.163 411.764L596.716 394.489L616.996 358.436L650.044 365.947L621.163 411.764ZM640.28 425.274L673.328 417.022M375.894 641.6V727.226L422.462 755.016L496.82 739.994L395.422 675.4L375.894 641.6Z";

/** Ring radii for Vector 2's solid concentric circles, outermost first. */
const SOLID_RING_RADII = [510.75, 407.1, 380.06, 350.01, 304.95];

/** Ring radius for Vector 2's dashed circle (longer marks) that spins clockwise with the rest of the pattern. */
const DASHED_RING_RADIUS = 449.25;

/** The dashed ring that carries a crescent glyph — stays fixed in place instead of spinning. */
const STATIC_DASHED_RING_RADIUS = 286.22;

/** The dashed ring Ellipse 10 rides on — stays fixed in place instead of spinning. */
const ELLIPSE_10_RING_RADIUS = 477.04;

/** The dotted ring Ellipse 7 rides on — stays fixed in place instead of spinning. */
const ELLIPSE_7_RING_RADIUS = 226.13;

type Glyph = { cx: number; cy: number; r: number; variant: "crescentCutout" | "half" | "outline" };

/** Glyphs riding the ring that spins clockwise with the rest of Vector 2. */
const SPINNING_GLYPHS: Glyph[] = [
  { cx: 741.68, cy: 1189.9, r: 15.77, variant: "outline" },
  { cx: 1120.23, cy: 1045.69, r: 26.29, variant: "outline" },
];

/** Crescent-moon glyph riding the dashed ring that stays fixed (does not spin). */
const STATIC_SPIN_GLYPHS: Glyph[] = [{ cx: 641.03, cy: 504.9, r: 15.87, variant: "crescentCutout" }];

/** Glyphs riding the dashed ring that carries Ellipse 10 — stay fixed with it. */
const STATIC_GLYPHS: Glyph[] = [
  { cx: 936.96, cy: 291.59, r: 15.77, variant: "half" },
  { cx: 1027.1, cy: 332.15, r: 15.77, variant: "outline" },
];

/**
 * Builds a mask that punches a solid hole for each glyph's circle, so ring/spoke strokes
 * drawn underneath (and sharing this mask) don't show through the glyphs riding on them.
 * The hole radius is padded slightly beyond glyph.r so the ring's stroke width is fully
 * cleared, not just clipped at the glyph's center line.
 *
 * `spinClassName` optionally wraps the holes in a group carrying a rotation animation,
 * so that once composed with the ambient rotation of whatever masked element references
 * this mask, the hole lands at — and tracks — the glyph's absolute position. The caller
 * is responsible for picking a rotation that actually cancels/adds correctly against
 * that ambient transform (see spinningGlyphsDashedRingHoleMask's "beat rate" below).
 */
function renderGlyphHoleMask(id: string, glyphs: Glyph[], spinClassName?: string) {
  const holes = glyphs.map((glyph, i) => <circle key={i} cx={glyph.cx} cy={glyph.cy} r={glyph.r + 1.5} fill="#000000" />);
  return (
    <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="1580" height="1580">
      <rect x="0" y="0" width="1580" height="1580" fill="#ffffff" />
      {spinClassName ? (
        <g className={spinClassName} style={{ transformOrigin: `${CENTER_X}px ${CENTER_Y}px` }}>
          {holes}
        </g>
      ) : (
        holes
      )}
    </mask>
  );
}

function renderGlyph(glyph: Glyph, key: number | string) {
  switch (glyph.variant) {
   case "crescentCutout":
    return (
      <g key={key}>
        <defs>
          <clipPath id={`clip-${key}`}>
            <circle cx={glyph.cx} cy={glyph.cy} r={glyph.r} strokeWidth={1.8} />
          </clipPath>
        </defs>
        <circle cx={glyph.cx} cy={glyph.cy} r={glyph.r} strokeWidth={1.8} stroke="var(--color-gold)" />
        <path
          key={key}
          d={`M ${glyph.cx + glyph.r * 0.38} ${glyph.cy - glyph.r} A ${glyph.r * 0.62} ${glyph.r} 0 0 1 ${glyph.cx + glyph.r * 0.38} ${glyph.cy + glyph.r} A ${glyph.r} ${glyph.r} 0 0 1 ${glyph.cx + glyph.r * 0.38} ${glyph.cy - glyph.r} Z`}
          fill="var(--color-gold)"
          clipPath={`url(#clip-${key})`}
        />
      </g>
    );
    case "half":
      return (
        <g key={key}>
          <circle cx={glyph.cx} cy={glyph.cy} r={glyph.r} stroke="var(--color-gold)" strokeWidth={1.8} />
          <path
            key={key}
            d={`M ${glyph.cx} ${glyph.cy + glyph.r} A ${glyph.r} ${glyph.r} 0 0 1 ${glyph.cx} ${glyph.cy - glyph.r} Z`}
            fill="var(--color-gold)"
          />
        </g>
      );
    case "outline":
      return <circle key={key} cx={glyph.cx} cy={glyph.cy} r={glyph.r} stroke="var(--color-gold)" strokeWidth={1.8} />;
  }
}

/** 12 spokes radiating from the pattern's center out to the outermost solid ring. */
const SPOKE_COUNT = 12;
const SPOKE_RADIUS = SOLID_RING_RADII[0];

/** The four moons riding on the rings — Ellipse 7/8/9/10 from the Figma layer names. */
const ellipse7 = { cx: 594.463, cy: 632.586, r: 20.2796 };
const ellipse10 = { cx: 791.251, cy: 272.06, r: 24.7862 };
const ellipse8Orbit = { r: 283.16, startAngle: -0.15 };
const ellipse9Orbit = { r: 408.31, startAngle: -177.26 };
const ELLIPSE_R = 20.2796;
const ELLIPSE9_R = 14.2709;

export default function ConstellationPattern() {
  return (
    <svg
      className={styles.pattern}
      width="1580"
      height="764"
      viewBox="0 0 1580 764"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="constellationFadeOuter" x1={CENTER_X} y1="221.5" x2={CENTER_X} y2="1313.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-gold)" />
          <stop offset="0.5" stopColor="var(--color-gold)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="constellationFadeMid" x1={CENTER_X} y1="243.5" x2={CENTER_X} y2="1291.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-gold)" />
          <stop offset="0.5" stopColor="var(--color-gold)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="constellationFadeWide" x1={CENTER_X} y1="0.5" x2={CENTER_X} y2="1534.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-gold)" />
          <stop offset="0.5" stopColor="var(--color-gold)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="constellationGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${CENTER_X} ${744.264}) scale(522.53 522.53)`}>
          <stop offset="0.05" stopColor="var(--color-gold)" stopOpacity="0" />
          <stop offset="0.35" stopColor="var(--color-gold)" stopOpacity="0.18" />
          <stop offset="0.502" stopColor="var(--color-gold)" stopOpacity="0" />
        </radialGradient>

        {/*
          Cuts a soft hole behind the title/description block so the animated rings and
          moons don't visually clash with the text. Sized/positioned in the SVG's own
          coordinate space to line up with .titleWrap, which sits near CENTER_X at the
          top of the pattern. Applied as a mask on the whole pattern (not on the animated
          groups) so the hole itself stays fixed while spinning elements fade underneath it.
        */}
        <radialGradient id="titleCutoutMask" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${TITLE_CUTOUT_X} ${TITLE_CUTOUT_Y}) scale(${TITLE_CUTOUT_RX} ${TITLE_CUTOUT_RY})`}>
          <stop offset="0" stopColor="#000000" />
          <stop offset="0.25" stopColor="#000000" />
          <stop offset="1" stopColor="#ffffff" />
        </radialGradient>
        <mask id="titleCutout" maskUnits="userSpaceOnUse" x="0" y="0" width="1580" height="764">
          <rect x="0" y="0" width="1580" height="764" fill="url(#titleCutoutMask)" />
        </mask>

        {/*
          Punch a hole in the ring/spoke strokes wherever a glyph rides on them, so the
          ring line isn't visible cutting through the glyph's circle. Each mask lives in
          the same rotating frame as the glyphs it covers, so the hole tracks the glyph
          exactly as it animates.
        */}
        {renderGlyphHoleMask("spinningGlyphsHoleMask", SPINNING_GLYPHS)}
        {renderGlyphHoleMask("staticGlyphsHoleMask", [...STATIC_SPIN_GLYPHS, ...STATIC_GLYPHS])}
        {/*
          SPINNING_GLYPHS also visually ride the dashed ring, which spins counter-clockwise
          in its own group — independently of the glyphs' clockwise frame. This mask is
          referenced from a circle nested inside that counter-clockwise group, so its content
          renders in that group's rotated coordinate space. To land the hole at the glyphs'
          absolute (clockwise) position despite that, its holes spin clockwise at the "beat"
          rate between the two frames (1 / (1/spinDuration + 1/ringSpinDurationReverse)) —
          the rotation needed to cancel the ambient counter-clockwise spin and add the
          glyphs' own clockwise spin on top, not the glyphs' plain spin rate.
        */}
        {renderGlyphHoleMask("spinningGlyphsDashedRingHoleMask", SPINNING_GLYPHS, styles.spinClockwiseRelativeToCounterRing)}
      </defs>

      {/* Ellipse 4, Ellipse 6, Ellipse 7 (outer) — fixed, never animate */}
      <g className={styles.static} opacity="1">
        <path
          d="M481 279.953C328.28 380.661 227.5 553.762 227.5 750.404C227.5 1061.39 479.564 1313.5 790.5 1313.5C1101.44 1313.5 1353.5 1061.39 1353.5 750.404C1353.5 553.762 1252.72 380.661 1100 279.953"
          stroke="url(#constellationFadeOuter)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M478.5 309.963C340.538 407.865 250.5 568.956 250.5 751.093C250.5 1049.55 492.266 1291.5 790.5 1291.5C1088.73 1291.5 1330.5 1049.55 1330.5 751.093C1330.5 568.956 1240.46 407.865 1102.5 309.963"
          stroke="url(#constellationFadeMid)"
          strokeLinecap="round"
        />
        <path
          d="M518.785 0.5C216.337 111.424 0.5 402.216 0.5 743.485C0.5 1180.35 354.195 1534.5 790.5 1534.5C1226.81 1534.5 1580.5 1180.35 1580.5 743.485C1580.5 402.216 1364.66 111.424 1062.21 0.5"
          stroke="url(#constellationFadeWide)"
          strokeLinecap="round"
        />
      </g>

      <g mask="url(#titleCutout)">
      

      <g clipPath="url(#constellationClip)">
        <clipPath id="constellationClip">
          <circle cx={CENTER_X} cy="744.264" r="522.53" strokeWidth={1.5} />
        </clipPath>

        {/* Soft glow, revealed only through the ring/line strokes drawn above it. */}
        <circle cx={CENTER_X} cy="744.264" r="522.53" fill="url(#constellationGlow)" className={styles.glow} strokeWidth={1.5} />

        {/* Vector 1 + Vector 2 (minus the two rings that carry Ellipse 7 and Ellipse 10) spin together, clockwise. */}
        <g className={styles.spinClockwise} style={{ transformOrigin: `${CENTER_X}px ${CENTER_Y}px` }}>
          <g mask="url(#spinningGlyphsHoleMask)">
            <path d={CONSTELLATION_PATH} stroke="var(--color-gold)" />

            {Array.from({ length: SPOKE_COUNT }, (_, i) => {
              const angle = (i * 360) / SPOKE_COUNT;
              return (
                <line
                  key={`spoke-${i}`}
                  x1={CENTER_X}
                  y1={CENTER_Y}
                  x2={CENTER_X + SPOKE_RADIUS}
                  y2={CENTER_Y}
                  stroke="var(--color-gold)"
                  strokeOpacity="0.25"
                  transform={`rotate(${angle} ${CENTER_X} ${CENTER_Y})`}
                />
              );
            })}

            {SOLID_RING_RADII.map((r) => (
              <circle key={`solid-${r}`} cx={CENTER_X} cy={CENTER_Y} r={r} stroke="var(--color-gold)" strokeOpacity="0.4" strokeWidth={1.5} />
            ))}
          </g>

          {SPINNING_GLYPHS.map((glyph, i) => renderGlyph(glyph, i))}
        </g>

        {/* The dotted ring (2nd from outside among dotted/dashed rings) spins counter-clockwise,
            independently from the rest of Vector 2. */}
        <g className={styles.spinCounterClockwise} style={{ transformOrigin: `${CENTER_X}px ${CENTER_Y}px` }}>
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={DASHED_RING_RADIUS}
            stroke="var(--color-gold)"
            strokeDasharray="1.5 15.6"
            strokeLinecap="round"
            strokeWidth={1.5}
            mask="url(#spinningGlyphsDashedRingHoleMask)"
          />
        </g>

        {/* The dashed ring carrying its crescent glyph, the dotted ring (carrying Ellipse 7),
            and the dashed ring carrying Ellipse 10 all stay fixed in place. */}
        <g mask="url(#staticGlyphsHoleMask)">
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={STATIC_DASHED_RING_RADIUS}
            stroke="var(--color-gold)"
            strokeDasharray="9 10"
            strokeLinecap="round"
            strokeWidth={1.5}
          />

          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={ELLIPSE_7_RING_RADIUS}
            stroke="var(--color-gold)"
            strokeDasharray="9 10"
            strokeLinecap="round"
            strokeWidth={1.5}
          />
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={ELLIPSE_10_RING_RADIUS}
            stroke="var(--color-gold)"
            strokeDasharray="9 10"
            strokeLinecap="round"
            strokeWidth={1.5}
          />
        </g>

        {STATIC_SPIN_GLYPHS.map((glyph, i) => renderGlyph(glyph, `static-spin-${i}`))}
        {STATIC_GLYPHS.map((glyph, i) => renderGlyph(glyph, i))}
      </g>

      {/* Ellipse 7 and Ellipse 10 — fixed moons riding on their (now static) rings. */}
      <circle cx={ellipse7.cx} cy={ellipse7.cy} r={ellipse7.r} fill="var(--color-gold)" strokeWidth={1.5} />
      <circle cx={ellipse10.cx} cy={ellipse10.cy} r={ellipse10.r} fill="var(--color-gold-light)" strokeWidth={1.5} />

      {/* Ellipse 8 orbits clockwise, Ellipse 9 orbits counter-clockwise, each on its own ring. */}
      <g className={styles.orbitClockwise} style={{ transformOrigin: `${CENTER_X}px ${CENTER_Y}px` }}>
        <circle
          cx={CENTER_X + ellipse8Orbit.r}
          cy={CENTER_Y}
          r={ELLIPSE_R}
          fill="var(--color-gold-light)"
          transform={`rotate(${ellipse8Orbit.startAngle} ${CENTER_X} ${CENTER_Y})`}
          strokeWidth={1.5}
        />
      </g>
      <g className={styles.orbitCounterClockwise} style={{ transformOrigin: `${CENTER_X}px ${CENTER_Y}px` }}>
        <circle
          cx={CENTER_X + ellipse9Orbit.r}
          cy={CENTER_Y}
          r={ELLIPSE9_R}
          fill="var(--color-gold)"
          transform={`rotate(${ellipse9Orbit.startAngle} ${CENTER_X} ${CENTER_Y})`}
          strokeWidth={1.5}
        />
      </g>
      </g>
    </svg>
  );
}
