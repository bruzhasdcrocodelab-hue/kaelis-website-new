import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/kaelis/:path*",
        destination: "https://stagtest.kaelisai.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
