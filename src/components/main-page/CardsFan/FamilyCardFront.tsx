"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./FamilyCardFront.module.css";

const ASSET_ROOT = "/images/cards/family-motion";

export default function FamilyCardFront({ active }: { active: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    let disposed = false;
    let requested = false;
    let generation = 0;

    const update = () => {
      if (inView && !reducedMotion.matches && !video.getAttribute("src")) {
        video.src = `${ASSET_ROOT}/family-motion.mp4`;
      }
      const shouldPlay = active && inView && !document.hidden && !reducedMotion.matches;
      if (!inView || document.hidden || reducedMotion.matches) video.style.visibility = "hidden";
      if (shouldPlay === requested) return;
      requested = shouldPlay;
      const attempt = ++generation;
      if (!shouldPlay) {
        video.pause();
        // Freeze the last frame during the reverse flip. The front unmounts
        // at its midpoint; don't flash the initial poster on mouse leave.
        return;
      }
      // Keep the poster visible until playback actually starts. Each reveal
      // begins at zero; stale play promises must not reveal a hidden video.
      video.style.visibility = "hidden";
      video.currentTime = 0;
      void video.play().then(() => {
        if (!disposed && requested && attempt === generation) video.style.visibility = "visible";
      }).catch(() => {
        if (!disposed && attempt === generation) video.style.visibility = "hidden";
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRect.width > 0;
      update();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", update);
    reducedMotion.addEventListener("change", update);
    return () => {
      disposed = true;
      generation++;
      video.pause();
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, [active]);

  return (
    <div ref={rootRef} className={styles.front} aria-hidden="true">
      <Image
        className={styles.layer}
        src={`${ASSET_ROOT}/family-poster.png`}
        alt=""
        fill
        sizes="165px"
        unoptimized
      />
      <video
        ref={videoRef}
        className={`${styles.layer} ${styles.video}`}
        poster={`${ASSET_ROOT}/family-poster.png`}
        width={618}
        height={1098}
        preload="auto"
        muted
        playsInline
        loop
        tabIndex={-1}
        onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
      />
      <Image
        className={styles.layer}
        src={`${ASSET_ROOT}/family-title.svg`}
        alt=""
        fill
        unoptimized
      />
    </div>
  );
}
