export function scrollToCards(reducedMotion: boolean) {
  const fan = document.getElementById("cards");
  const panels = document.querySelector<HTMLElement>("[data-home-panels]");
  const promo = document.querySelector<HTMLElement>("[data-home-promo]");
  const page = document.querySelector<HTMLElement>("[data-home-page]");
  if (!fan || !panels || !promo || !page) return;
  const readingHeight = panels.getBoundingClientRect().height - promo.getBoundingClientRect().height;
  const pageHeight = page.getBoundingClientRect().bottom + window.scrollY;
  const maxScroll = Math.max(0, pageHeight - readingHeight - window.innerHeight);
  const margin = parseFloat(getComputedStyle(fan).scrollMarginTop) || 0;
  window.scrollTo({
    top: Math.floor(Math.min(window.scrollY + fan.getBoundingClientRect().top - margin, maxScroll)),
    behavior: reducedMotion ? "instant" : "smooth",
  });
}
