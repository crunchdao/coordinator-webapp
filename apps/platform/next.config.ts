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
};

export default nextConfig;
