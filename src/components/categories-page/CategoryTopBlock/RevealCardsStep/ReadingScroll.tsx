"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import styles from "./RevealCardsStep.module.css";

export default function ReadingScroll({ children }: { children: ReactNode }) {
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
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, []);
  return <div ref={ref} className={styles.detailText} tabIndex={0} data-reading-scroll>
    <div className={styles.readingFlow}>{children}</div>
  </div>;
}
