import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const MODEL_ORCHESTRATOR_URL =
  process.env.NEXT_PUBLIC_API_URL_MODEL_ORCHESTRATOR || "http://localhost:8001";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  transpilePackages: [
    "@coordinator/utils",
    "@coordinator/ui",
    "@coordinator/chart",
    "@coordinator/settings",
    "@coordinator/leaderboard",
    "@coordinator/metrics",
    "@coordinator/model",
    "@coordinator/pitch",
    "@coordinator/dev",
  ],
  async rewrites() {
    return [
      {
        source: "/api/logs/:path*",
        destination: "/api/logs/:path*",
      },
      {
        source: "/api/leaderboard/:path*",
        destination: "/api/leaderboard/:path*",
      },
      {
        source: "/api/metrics/widgets/:path*",
        destination: "/api/metrics/widgets/:path*",
      },
      {
        source: "/api/settings/:path*",
        destination: "/api/settings/:path*",
      },
      {
        source: "/api/models/:path*",
        destination: `${MODEL_ORCHESTRATOR_URL}/models/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
