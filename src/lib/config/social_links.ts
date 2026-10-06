import type { Locale } from "@/lang";

const NETWORK = [
  {
    label: "TikTok",
    icon: "/icons/tiktok.svg",
    href: {
      en: "https://www.tiktok.com/@kaelisai?_t=ZM-8zPlIGKEeAf",
      ru: "https://www.tiktok.com/@kaelis_ai?_t=ZM-8zPlMOe2tGC",
      uk: "https://www.tiktok.com/@kaelis_ai_media?_t=ZM-8zPlJTkjIqE",
    },
  },
  {
    label: "Instagram",
    icon: "/icons/instagram.svg",
    href: {
      en: "https://www.instagram.com/kaelis_ai_media?igsh=MXczMW5wajJ4ODgxdQ==",
      ru: "https://www.instagram.com/kaelisai_media?igsh=MW9kcmV0YXFzdGdqcg==",
      uk: "https://www.instagram.com/kaelis_ai?igsh=aGR3dXU1bHBqczAy",
    },
  },
] satisfies { label: string; icon: string; href: Record<Locale, string> }[];

export function getSocialData(locale: Locale) {
  return NETWORK.map(({ href, ...network }) => ({ ...network, href: href[locale] }));
}
