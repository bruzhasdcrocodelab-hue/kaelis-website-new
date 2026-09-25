interface FanSlot {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
}

/** Fit additional selectable cards into the existing fan's outline, not a new layout. */
export function fitSelectionFan<T extends FanSlot>(slots: T[], count: number): T[] {
  return Array.from({ length: count }, (_, index) => {
    const position = count === 1 ? (slots.length - 1) / 2 : index * (slots.length - 1) / (count - 1);
    const start = slots[Math.floor(position)];
    const end = slots[Math.ceil(position)];
    const fraction = position - Math.floor(position);
    const lerp = (a: number, b: number) => a + (b - a) * fraction;
    const angleDelta = ((end.rotate - start.rotate + 540) % 360) - 180;
    return {
      ...(fraction < 0.5 ? start : end),
      id: `spread-card-${index + 1}`,
      left: lerp(start.left, end.left),
      top: lerp(start.top, end.top),
      width: lerp(start.width, end.width),
      height: lerp(start.height, end.height),
      rotate: start.rotate + angleDelta * fraction,
    };
  });
}
