"use client";

import { useEffect, useRef } from "react";
import styles from "./StarField.module.css";

/**
 * Scattered twinkling stars behind the categories list. Positions are taken
 * loosely from the mock (node "Group 51") and expressed as viewport-relative
 * percentages so the spread survives resizing; exact placement is not important,
 * only the random-looking distribution.
 */
type Star = { x: number; y: number; size: number };

const STARS: Star[] = [
  { x: 28.4, y: 3.1, size: 3 },
  { x: 33.3, y: 1.9, size: 2 },
  { x: 38.8, y: 4.6, size: 4 },
  { x: 74.9, y: 12.5, size: 3 },
  { x: 71.5, y: 18.1, size: 2 },
  { x: 10.3, y: 18.1, size: 2 },
  { x: 15.9, y: 33.0, size: 3 },
  { x: 54.1, y: 15.2, size: 2 },
  { x: 47.2, y: 19.4, size: 3 },
  { x: 68.0, y: 1.0, size: 2 },
  { x: 38.1, y: 30.2, size: 3 },
  { x: 33.9, y: 24.3, size: 2 },
  { x: 95.8, y: 6.4, size: 2 },
  { x: 93.7, y: 20.3, size: 3 },
  { x: 4.1, y: 9.4, size: 2 },
  { x: 61.0, y: 45.5, size: 2 },
  { x: 74.9, y: 49.0, size: 3 },
  { x: 12.4, y: 49.0, size: 2 },
  { x: 28.4, y: 57.2, size: 3 },
  { x: 33.3, y: 55.4, size: 2 },
  { x: 38.8, y: 57.9, size: 4 },
  { x: 74.9, y: 65.5, size: 3 },
  { x: 71.5, y: 71.1, size: 2 },
  { x: 10.3, y: 71.1, size: 2 },
  { x: 15.9, y: 85.7, size: 3 },
  { x: 54.1, y: 68.3, size: 2 },
  { x: 47.2, y: 72.5, size: 3 },
  { x: 68.0, y: 53.2, size: 2 },
  { x: 38.1, y: 83.2, size: 3 },
  { x: 33.9, y: 78.3, size: 2 },
  { x: 95.8, y: 59.4, size: 2 },
  { x: 93.7, y: 73.3, size: 3 },
  { x: 4.1, y: 62.4, size: 2 },
  { x: 61.0, y: 97.9, size: 2 },
];

function twinkleDelay(index: number): number {
  return -Number(((index * 0.618) % 4).toFixed(2));
}

export default function StarField() {
  const starRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        entry.target.toggleAttribute("data-paused", !entry.isIntersecting || entry.intersectionRect.width === 0 || entry.intersectionRect.height === 0);
      }
    }, { rootMargin: "120px" });
    starRefs.current.forEach(star => {
      if (star) observer.observe(star);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.field} aria-hidden>
      {STARS.map((star, i) => (
        <span
          key={i}
          ref={node => { starRefs.current[i] = node; }}
          className={styles.star}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${twinkleDelay(i)}s`,
          }}
        />
      ))}
    </div>
  );
}
