"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import type { CardFrontAssets } from "./cardFrontAssets";
import styles from "./AnimatedCardFront.module.css";

export default function AnimatedCardFront({ active, visible, assets }: { active: boolean; visible: boolean; assets: CardFrontAssets }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    if ((!visible || active) && videoRef.current) videoRef.current.style.visibility = "hidden";
  }, [active, visible]);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    let disposed = false;
    let requested = false;
    let generation = 0;
    let videoFrame: number | undefined;
    let frame: number | undefined;
    const cancelFrame = () => {
      if (videoFrame !== undefined) video.cancelVideoFrameCallback(videoFrame);
      if (frame !== undefined) cancelAnimationFrame(frame);
      videoFrame = undefined;
      frame = undefined;
    };

    const update = () => {
      if (inView && !reducedMotion.matches && !video.getAttribute("src")) {
        video.src = assets.video;
      }
      const shouldPlay = active && inView && !document.hidden && !reducedMotion.matches;
      if (!inView || document.hidden || reducedMotion.matches) video.style.visibility = "hidden";
      if (shouldPlay === requested) return;
      requested = shouldPlay;
      const attempt = ++generation;
      cancelFrame();
      if (!shouldPlay) {
        video.pause();
        // Freeze the last frame during the reverse flip; the front is hidden
        // at its midpoint. Keep its images mounted for the next reveal.
        return;
      }
      // Keep the poster visible until playback actually starts. Each reveal
      // begins at zero; stale play promises must not reveal a hidden video.
      video.style.visibility = "hidden";
      video.currentTime = 0;
      void video.play().then(() => {
        if (disposed || !requested || attempt !== generation) return;
        const reveal = () => {
          if (!disposed && requested && attempt === generation && !video.seeking) video.style.visibility = "visible";
        };
        if (typeof video.requestVideoFrameCallback === "function") videoFrame = video.requestVideoFrameCallback(reveal);
        else frame = requestAnimationFrame(reveal);
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
      cancelFrame();
      video.pause();
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, [active, assets.video]);

  return (
    <div ref={rootRef} className={styles.front} style={{ opacity: visible ? 1 : 0 }} aria-hidden="true">
      <Image
        className={styles.layer}
        src={assets.poster}
        alt=""
        fill
        sizes="165px"
        loading="eager"
        unoptimized
      />
      <video
        ref={videoRef}
        className={`${styles.layer} ${styles.video}`}
        poster={assets.poster}
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
        src={assets.title}
        alt=""
        fill
        loading="eager"
        unoptimized
      />
    </div>
  );
}
