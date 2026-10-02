/** All points stay in the existing presentation coordinate system. */
export type Point = { x: number; y: number };
export type RevealMetrics = {
  cardWidth: number; cardHeight: number; labelHeight: number; gap: number;
  column: number; row: number; padding: number;
  deal: number; stagger: number; flip: number; focus: number; detail: number;
  rotation: number; stiffness: number; damping: number;
  ease: [number, number, number, number];
};

export function readRevealMetrics(element: Element): RevealMetrics {
  const style = getComputedStyle(element);
  const token = (name: string) => parseFloat(style.getPropertyValue(`--reveal-${name}`));
  return {
    cardWidth: token('card-width'), cardHeight: token('card-height'),
    labelHeight: token('label-height'), gap: token('gap'),
    column: token('column'), row: token('row'), padding: token('padding'),
    deal: token('deal-duration'), stagger: token('stagger-duration'),
    flip: token('flip-duration'), focus: token('focus-duration'), detail: token('detail-duration'),
    rotation: token('selection-rotation'), stiffness: token('selection-stiffness'), damping: token('selection-damping'),
    ease: style.getPropertyValue('--reveal-ease').split(',').map(Number) as RevealMetrics['ease'],
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

export function focusTransform(point: Point, scale: number, width: number, height: number, vw: number, vh: number, allowEdgeFocus = false) {
  return {
    x: clampPan(vw / 2 - point.x * scale, width * scale, vw, allowEdgeFocus ? vw / 2 : 0),
    y: clampPan(vh / 2 - point.y * scale, height * scale, vh, allowEdgeFocus ? vh / 2 : 0),
    scale,
  };
}
