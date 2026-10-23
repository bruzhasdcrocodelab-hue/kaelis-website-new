export const CONSENT_KEY = "kaelis.analyticsConsent";
export const CONSENT_DURATION = 180 * 24 * 60 * 60 * 1000;
export type AnalyticsConsent = "granted" | "denied";

export function readConsent(value: string | null, now = Date.now()): AnalyticsConsent | null {
  try {
    const record = JSON.parse(value ?? "null");
    if (record?.version !== 1 || !Number.isFinite(record.expiresAt) || record.expiresAt <= now) return null;
    return record.choice === "granted" || record.choice === "denied" ? record.choice : null;
  } catch {
    return null;
  }
}

export function consentBootstrap() {
  return `
    try {
      const choice = (${readConsent.toString()})(localStorage.getItem(${JSON.stringify(CONSENT_KEY)}));
      if (choice) window.gtag('consent', 'update', { analytics_storage: choice });
    } catch {}
  `;
}

export function saveConsent(choice: AnalyticsConsent) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: 1, choice, expiresAt: Date.now() + CONSENT_DURATION }));
  } catch {}
  window.gtag?.("consent", "update", { analytics_storage: choice });
}
