import type { NextConfig } from "next";

const nodeApiUrl = process.env.NEXT_PUBLIC_NODE_API_URL || "http://localhost:8000";

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
      // Proxy /api/reports/* to the coordinator node's report-worker
      {
        source: "/api/reports/:path*",
        destination: `${nodeApiUrl}/reports/:path*`,
      },
      // Proxy /api/crunches/:name/reports/* → strip the crunch prefix
      {
        source: "/api/crunches/:crunch/reports/:path*",
        destination: `${nodeApiUrl}/reports/:path*`,
      },
      // Proxy /api/crunches/:name/healthz and /api/crunches/:name/info
      {
        source: "/api/crunches/:crunch/healthz",
        destination: `${nodeApiUrl}/healthz`,
      },
      {
        source: "/api/crunches/:crunch/info",
        destination: `${nodeApiUrl}/info`,
      },
    ];
  },
};

export default nextConfig;
