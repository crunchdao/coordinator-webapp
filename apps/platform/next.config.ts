import type { NextConfig } from "next";

const NODE_API_URL = process.env.NEXT_PUBLIC_NODE_API_URL || "http://localhost:8000";

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
      // Keep local Next.js API routes handled locally
      {
        source: "/api/certificate/:path*",
        destination: "/api/certificate/:path*",
      },
      {
        source: "/api/leaderboard/:path*",
        destination: "/api/leaderboard/:path*",
      },
      {
        source: "/api/metrics/:path*",
        destination: "/api/metrics/:path*",
      },
      // Proxy node API: /api/crunches/{name}/reports/* → node /reports/*
      {
        source: "/api/crunches/:crunchName/reports/:path*",
        destination: `${NODE_API_URL}/reports/:path*`,
      },
      // Proxy node healthz
      {
        source: "/api/crunches/:crunchName/healthz",
        destination: `${NODE_API_URL}/healthz`,
      },
    ];
  },
};

export default nextConfig;
