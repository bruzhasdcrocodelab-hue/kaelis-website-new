let cancelPreviousScroll: (() => void) | undefined;

export function scrollToCards(reducedMotion: boolean, followExpansion = false) {
  cancelPreviousScroll?.();
  const fan = document.getElementById("cards");
  const panels = document.querySelector<HTMLElement>("[data-home-panels]");
  if (!fan) return;
  let observer: ResizeObserver | undefined;
  let frame = 0;
  const cancel = () => {
    cancelAnimationFrame(frame);
    observer?.disconnect();
    for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) {
      window.removeEventListener(event, cancel);
    }
    if (cancelPreviousScroll === cancel) cancelPreviousScroll = undefined;
  };
  cancelPreviousScroll = cancel;
  let previousTop = -1;
  const scroll = () => {
    const margin = parseFloat(getComputedStyle(fan).scrollMarginTop) || 0;
    const target = Math.max(0, window.scrollY + fan.getBoundingClientRect().top - margin);
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const top = Math.min(target, maxScroll);
    if (top !== previousTop) {
      window.scrollTo({ top, behavior: reducedMotion ? "instant" : "smooth" });
      previousTop = top;
    }
    if (maxScroll >= target) cancel();
  };
  if (followExpansion && panels) {
    observer = new ResizeObserver(scroll);
    observer.observe(panels);
    for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) {
      window.addEventListener(event, cancel, { passive: true });
    }
  }
  scroll();
  return {
    cancel,
    finish: () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (cancelPreviousScroll !== cancel) return;
        scroll();
        cancel();
      });
    },
  };
}
