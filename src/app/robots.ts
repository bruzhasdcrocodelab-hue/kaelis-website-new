import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kaelisai.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/api/kaelis/user/anonymous",
        "/api/kaelis/tarot/",
        "/api/kaelis/configuration",
        "/api/kaelis/broadcasting/auth",
      ],
      disallow: [
        "/api/",
        "/api/admin/",
        "/api/private/",
        "/api/internal/",
      ],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
