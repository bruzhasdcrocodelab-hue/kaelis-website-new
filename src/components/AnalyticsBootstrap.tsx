"use client";

import { useEffect } from "react";
import { consentBootstrap } from "@/lib/consent";

export default function AnalyticsBootstrap({ measurementId }: { measurementId: string }) {
  useEffect(() => {
    const bootstrapId = "google-analytics-consent";
    if (document.getElementById(bootstrapId)) return;
    const bootstrap = document.createElement("script");
    bootstrap.id = bootstrapId;
    bootstrap.text = `
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
      window.gtag('consent', 'default', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
      ${consentBootstrap()}
      window.gtag('set', 'ads_data_redaction', true);
      window.gtag('js', new Date());
      window.gtag('config', ${JSON.stringify(measurementId)}, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
    `;
    document.head.append(bootstrap);
    const analytics = document.createElement("script");
    analytics.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    analytics.async = true;
    analytics.dataset.kaelisAnalytics = "true";
    document.head.append(analytics);
  }, [measurementId]);

  return null;
}
