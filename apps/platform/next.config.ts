import type { NextConfig } from "next";

const NODE_API_URL =
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
      // Proxy node report API: /api/crunches/{name}/reports/* → node /reports/*
      {
        source: "/api/crunches/:crunchName/reports/:path*",
        destination: `${NODE_API_URL}/reports/:path*`,
      },
      // Proxy node health endpoint: /api/crunches/{name}/healthz → node /healthz
      {
        source: "/api/crunches/:crunchName/healthz",
        destination: `${NODE_API_URL}/healthz`,
      },
    ];
  },
};

export default nextConfig;
