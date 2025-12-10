import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/api/:path((?!logs$))",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;