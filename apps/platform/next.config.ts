import type { NextConfig } from "next";

const COORDINATOR_NODE_API_URL =
  process.env.NEXT_PUBLIC_COORDINATOR_NODE_API_URL ||
  process.env.NEXT_PUBLIC_NODE_API_URL || // Backward compatibility
  "http://localhost:8000";

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
      {
        source: "/api/crunches/:crunchName/reports/:path*",
        destination: `${COORDINATOR_NODE_API_URL}/reports/:path*`,
      },
    ];
  },
};

export default nextConfig;
