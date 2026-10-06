/** All points stay in the existing presentation coordinate system. */
export type Point = { x: number; y: number };
export type RevealMetrics = {
  cardWidth: number; cardHeight: number; labelHeight: number; gap: number;
  column: number; row: number; padding: number;
  deal: number; stagger: number; flip: number; focus: number; detail: number;
  rotation: number; stiffness: number; damping: number;
  ease: [number, number, number, number];
};

export function readRevealMetrics(): RevealMetrics {
  return {
    cardWidth: 120, cardHeight: 215.398,
    labelHeight: 0, gap: 0,
    column: 136.8, row: 232.2, padding: 8,
    deal: 0.48, stagger: 0.16,
    flip: 0.5, focus: 0.7, detail: 0.4,
    rotation: -8, stiffness: 260, damping: 22,
    ease: [0.4, 0, 0.2, 1],
  };
}

export function spreadGeometry(cards: Point[], metrics: RevealMetrics) {
  const { padding, column, row, cardWidth, cardHeight, labelHeight, gap } = metrics;
  const positions = cards.map(card => ({ x: padding + card.x * column, y: padding + card.y * row }));
  return {
    positions,
    width: Math.max(0, ...positions.map(card => card.x)) + cardWidth + padding,
    height: Math.max(0, ...positions.map(card => card.y)) + labelHeight + gap + cardHeight + padding,
  };
}

export function clampPan(value: number, content: number, viewport: number, gutter = 0) {
  return content + gutter * 2 <= viewport ? (viewport - content) / 2 : Math.max(viewport - content - gutter, Math.min(gutter, value));
}

export function zoomBounds(width: number, height: number, vw: number, vh: number, metrics: RevealMetrics, overviewWidth: number, maxWidth: number) {
  const fit = Math.min(overviewWidth / metrics.cardWidth, vw / width, vh / height);
  const max = Math.max(fit, Math.min(maxWidth / metrics.cardWidth,
    vw / (metrics.cardWidth + metrics.padding * 2),
    vh / (metrics.cardHeight + metrics.labelHeight + metrics.gap + metrics.padding * 2)));
  return { fit, max };
}

export function focusTransform(point: Point, scale: number, width: number, height: number, vw: number, vh: number, allowEdgeFocus = false) {
  return {
    x: clampPan(vw / 2 - point.x * scale, width * scale, vw, allowEdgeFocus ? vw / 2 : 0),
    y: clampPan(vh / 2 - point.y * scale, height * scale, vh, allowEdgeFocus ? vh / 2 : 0),
    scale,
  };
}
