"use client";

import { useEffect, useId, useMemo } from "react";
import { motion, useAnimate, type AnimationSequence } from "motion/react";
import PatternArtwork from "./PatternArtwork";
import { desktopCenter, desktopSide, mobileCenter, mobileSide } from "./patternData";
import type { PatternLayer, PatternNode, PatternProperty } from "./types";
import styles from "./HomePatterns.module.css";
import pageStyles from "@/app/page.module.css";

function Layer({ layer, prefix }: { layer: PatternLayer; prefix: string }) {
  const origin = layer.animation?.style?.transformOrigin;
  const [originX, originY] = origin ? origin.split(" ").map(parseFloat) : [50, 50];

  return (
    <g transform={`translate(${layer.x} ${layer.y})`}>
      <motion.g
        data-pattern-node={layer.id}
        initial={layer.animation?.initial}
        style={layer.animation ? { originX: `${layer.width * originX / 100}px`, originY: `${layer.height * originY / 100}px` } : undefined}
      >
        <PatternArtwork asset={layer.asset} idPrefix={`${prefix}-${layer.id.replace(":", "-")}`} />
      </motion.g>
    </g>
  );
}

function Layers({ nodes, prefix }: { nodes: PatternNode[]; prefix: string }) {
  return nodes.map((node, index) => {
    if ("asset" in node) return <Layer key={node.id} layer={node} prefix={prefix} />;
    const maskId = `${prefix}-mask-${index}`;
    return (
      <g key={maskId} transform={node.translateY ? `translate(0 ${node.translateY})` : undefined}>
        {node.mask && (
          <defs>
            <mask id={maskId} className={styles.mask} maskUnits="userSpaceOnUse" x={-1000} y={-1000} width={3000} height={3000}>
              <Layer layer={node.mask} prefix={`${prefix}-mask`} />
            </mask>
          </defs>
        )}
        <g mask={node.mask ? `url(#${maskId})` : undefined}>
          <Layers nodes={node.children} prefix={`${prefix}-${index}`} />
        </g>
      </g>
    );
  });
}

function animatedLayers(nodes: PatternNode[]): PatternLayer[] {
  return nodes.flatMap(node => "asset" in node
    ? node.animation ? [node] : []
    : [...(node.mask?.animation ? [node.mask] : []), ...animatedLayers(node.children)]);
}

const patterns = [
  { name: "center", mobile: false, width: 996, height: 491, nodes: desktopCenter, className: pageStyles.patternCenter },
  { name: "left", mobile: false, width: 340, height: 750, nodes: desktopSide, className: pageStyles.patternLeft },
  { name: "right", mobile: false, width: 340, height: 750, nodes: desktopSide, className: pageStyles.patternRight },
  { name: "center", mobile: true, width: 147, height: 79, nodes: mobileCenter, className: pageStyles.patternCenterMobile },
  { name: "left", mobile: true, width: 108, height: 605, nodes: mobileSide, className: pageStyles.patternLeftMobile },
  { name: "right", mobile: true, width: 108, height: 605, nodes: mobileSide, className: pageStyles.patternRightMobile },
];

type SidePatternClasses = { left: string; right: string };
type PatternDefinition = (typeof patterns)[number];

export function DesktopGradientPatterns({ left, right }: SidePatternClasses) {
  const sides = useMemo(() => patterns.filter(pattern => !pattern.mobile && pattern.name !== "center").map(pattern => ({
    ...pattern,
    width: pattern.name === "left" ? 339 : 340,
    className: pattern.name === "left" ? left : right,
  })), [left, right]);

  return <AnimatedPatterns patterns={sides} gradient />;
}

export default function HomePatterns() {
  return <AnimatedPatterns patterns={patterns} />;
}

function AnimatedPatterns({ patterns, gradient = false }: { patterns: PatternDefinition[]; gradient?: boolean }) {
  const prefix = useId().replace(/:/g, "");
  const [scope, animate] = useAnimate<HTMLDivElement>();

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stop = () => {};

    function start() {
      stop();
      const sequence: AnimationSequence = [];
      const resets: (() => void)[] = [];

      for (const pattern of patterns.filter(pattern => pattern.mobile === mobile.matches)) {
        const container = scope.current.querySelector<SVGSVGElement>(`[data-pattern="${pattern.mobile ? "mobile" : "desktop"}-${pattern.name}"]`);
        if (!container) continue;

        for (const layer of animatedLayers(pattern.nodes)) {
          const element = container.querySelector<SVGGElement>(`[data-pattern-node="${layer.id}"]`);
          const animation = layer.animation;
          if (!element || !animation) continue;
          resets.push(() => { animate(element, animation.initial, { duration: 0 }).complete(); });
          for (const property of Object.keys(animation.animate) as PatternProperty[]) {
            sequence.push([element, { [property]: animation.animate[property] }, { ...animation.transition[property], at: 0 }]);
          }
        }

        if (!pattern.mobile) {
          sequence.push([container, { y: [0, 12, 0] }, { at: 0, duration: 3.664, times: [0, 0.5019, 1], ease: "easeInOut" }]);
          resets.push(() => { animate(container, { y: 0 }, { duration: 0 }).complete(); });
        }
      }

      if (reduced.matches) {
        resets.forEach(reset => reset());
        stop = () => {};
        return;
      }

      if (!sequence.length) return;

      const playback = animate(sequence, { repeat: Infinity });
      stop = () => {
        playback.stop();
        resets.forEach(reset => reset());
      };
    }

    start();
    mobile.addEventListener("change", start);
    reduced.addEventListener("change", start);
    return () => {
      stop();
      mobile.removeEventListener("change", start);
      reduced.removeEventListener("change", start);
    };
  }, [animate, scope, patterns]);

  return (
    <div ref={scope} className={styles.scope} aria-hidden="true">
      {patterns.map(pattern => {
        const name = `${pattern.mobile ? "mobile" : "desktop"}-${pattern.name}`;
        const side = pattern.name !== "center";
        const offset = pattern.mobile ? "translate(-124 0)" : "translate(-124 -14)";
        const fadeId = `${prefix}-${name}-fade`;
        const gradientId = `${fadeId}-gradient`;
        return (
          <div key={name} className={pattern.className}>
            <motion.svg initial={{ y: 0 }} data-pattern={name} className={styles.canvas} width={pattern.width} height={pattern.height} viewBox={`0 0 ${pattern.width} ${pattern.height}`} fill="none" focusable="false">
              {gradient && (
                <defs>
                  <linearGradient id={gradientId} x1={0} y1={13.7435} x2={0} y2={750} gradientUnits="userSpaceOnUse">
                    <stop stopColor="currentColor" />
                    <stop offset={1} stopColor="currentColor" stopOpacity={0} />
                  </linearGradient>
                  <mask id={fadeId} className={styles.mask} maskUnits="userSpaceOnUse" x={-1000} y={-1000} width={3000} height={3000}>
                    <rect x={-1000} y={-1000} width={3000} height={3000} fill={`url(#${gradientId})`} />
                  </mask>
                </defs>
              )}
              <g mask={gradient ? `url(#${fadeId})` : undefined}>
                <g transform={pattern.name === "left" ? `translate(${pattern.width} 0) scale(${-pattern.width / (gradient ? 340 : pattern.width)} 1)` : undefined}>
                  <g transform={side ? offset : undefined}>
                    <Layers nodes={pattern.nodes} prefix={`${prefix}-${name}`} />
                  </g>
                </g>
              </g>
            </motion.svg>
          </div>
        );
      })}
    </div>
  );
}
