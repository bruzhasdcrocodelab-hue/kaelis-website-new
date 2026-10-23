import { routeFromPath } from "./routing";

type AnalyticsParameter = string | number | boolean;
type AnalyticsParameters = Record<string, AnalyticsParameter>;
const ATTRIBUTION_PARAMETERS = new Set([
  "utm_id",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "dclid",
  "gbraid",
  "wbraid",
]);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function send(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer ??= [];
  if (window.gtag) window.gtag(...args);
  else window.dataLayer.push(args);
}

function safePageLocation(pathname = window.location.pathname) {
  const search = new URLSearchParams();
  new URLSearchParams(window.location.search).forEach((value, key) => {
    if (ATTRIBUTION_PARAMETERS.has(key)) search.append(key, value);
  });
  const query = search.toString();
  return `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;
}

function safeReferrer() {
  if (!document.referrer) return "";
  try { return new URL(document.referrer).origin; }
  catch { return ""; }
}

export function trackEvent(name: string, parameters: AnalyticsParameters = {}) {
  if (typeof window === "undefined") return;
  send("event", name, { ...parameters, page_location: safePageLocation() });
}

export function trackRoute(pathname: string, pageTitle: string) {
  if (typeof window === "undefined") return;
  trackEvent("page_view", {
    page_title: pageTitle.trim() || "Kaelis",
    page_referrer: safeReferrer(),
    page_location: safePageLocation(pathname),
  });
  const route = routeFromPath(pathname);
  if (!route) return;
  if (route.kind === "catalog") {
    trackEvent("view_tarot_catalog", { locale: route.locale });
    return;
  }
  if (route.kind !== "category") return;
  const [categorySlug, spreadSlug] = route.path;
  trackEvent(spreadSlug ? "view_tarot_spread" : "view_tarot_category", {
    locale: route.locale,
    category_slug: categorySlug,
    ...(spreadSlug ? { spread_slug: spreadSlug } : {}),
  });
}
