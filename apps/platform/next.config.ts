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
    "@coordinator/pitch",
  ],
};

export default nextConfig;
