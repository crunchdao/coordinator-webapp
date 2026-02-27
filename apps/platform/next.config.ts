import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  transpilePackages: [
    "@coordinator/utils",
    "@coordinator/ui",
    "@coordinator/leaderboard",
    "@coordinator/metrics",
  ],
  async rewrites() {
    return [
      {
        source: "/hub-staging/:path*",
        destination: "https://api.hub.crunchdao.io/:path*",
      },
      {
        source: "/hub-prod/:path*",
        destination: "https://api.hub.crunchdao.com/:path*",
      },
    ];
  },
};

export default nextConfig;
