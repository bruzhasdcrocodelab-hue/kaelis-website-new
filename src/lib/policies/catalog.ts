import type { Locale } from "@/lang";

export const policyKeys = [
  "children-s-privacy-policy",
  "terms-of-use",
  "content-policy",
  "end-user-license-agreement-eula",
  "refund-and-subscription-policy",
  "privacy-policy"
] as const;

export type PolicyKey = typeof policyKeys[number];

export const policyTitles: Record<Locale, Record<PolicyKey, string>> = {
  "en": {
    "children-s-privacy-policy": "Children’s Privacy Policy",
    "terms-of-use": "Terms of Use",
    "content-policy": "Content Policy",
    "end-user-license-agreement-eula": "End-User License Agreement (EULA)",
    "refund-and-subscription-policy": "Refund & Subscription Policy",
    "privacy-policy": "Private Policy"
  },
  "ru": {
    "children-s-privacy-policy": "Политика конфиденциальности для детей",
    "terms-of-use": "Условия использования",
    "content-policy": "Политика в отношении контента",
    "end-user-license-agreement-eula": "Соглашение с конечным пользователем",
    "refund-and-subscription-policy": "Политика возвратов и подписок",
    "privacy-policy": "Политика конфиденциальности"
  },
  "uk": {
    "children-s-privacy-policy": "Політика конфіденційності для дітей",
    "terms-of-use": "Умови використання",
    "content-policy": "Політика щодо контенту",
    "end-user-license-agreement-eula": "Угода з кінцевим користувачем",
    "refund-and-subscription-policy": "Політика повернень коштів та підписок",
    "privacy-policy": "Політика конфіденційності"
  }
};

export function policyHref(locale: Locale, key: PolicyKey) {
  const prefix = locale === "uk" ? "ua" : locale;
  return `/${prefix}/policy/${key}-${prefix}`;
}

export function policyKeyFromSlug(slug: string, locale: string): PolicyKey | undefined {
  return policyKeys.find(key => slug === `${key}-${locale}`);
}
