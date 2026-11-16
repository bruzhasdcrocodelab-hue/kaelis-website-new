"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import styles from "./RevealCardsStep.module.css";

export default function ReadingScroll({ children, scrollTop = 0, onScrollTopChange }: { children: ReactNode; scrollTop?: number; onScrollTopChange?: (value: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = ref.current!;
    const update = () => {
      element.dataset.atStart = String(element.scrollTop <= 1);
      element.dataset.atEnd = String(element.scrollHeight - element.clientHeight - element.scrollTop <= 1);
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    observer.observe(element.firstElementChild!);
    element.scrollTop = scrollTop;
    const scroll = () => { update(); onScrollTopChange?.(element.scrollTop); };
    element.addEventListener("scroll", scroll, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener("scroll", scroll); };
  }, [onScrollTopChange, scrollTop]);
  return <div ref={ref} className={styles.detailText} tabIndex={0} data-reading-scroll>
    <div className={styles.readingFlow}>{children}</div>
  </div>;
}
