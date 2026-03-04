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
      // Proxy node report API: /api/crunches/{name}/reports/* → node /reports/*
      {
        source: "/api/crunches/:crunchName/reports/:path*",
        destination: `${NODE_API_URL}/reports/:path*`,
      },
    ];
  },
};

export default nextConfig;
