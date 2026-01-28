import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  transpilePackages: [
    "@coordinator/utils",
    "@coordinator/ui",
    "@coordinator/chart",
    "@coordinator/leaderboard",
    "@coordinator/metrics",
    "@coordinator/model",
    "@coordinator/pitch",
    "@coordinator/dev",
  ],
};

export default nextConfig;
