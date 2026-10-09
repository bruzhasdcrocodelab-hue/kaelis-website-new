import type { NextConfig } from "next";
import { API_BASE } from "./src/lib/config/constants";
import { BACKEND_ORIGIN } from "./src/lib/config/env";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/images/cards/deck/**", search: "?v=complete" },
    ],
  },
  async rewrites() {
    return [
      {
        source: `${API_BASE}/broadcasting/auth`,
        destination: `${BACKEND_ORIGIN}/broadcasting/auth`,
      },
      {
        source: `${API_BASE}/:path*`,
        destination: `${BACKEND_ORIGIN}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
