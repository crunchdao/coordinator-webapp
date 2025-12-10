import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

let apiBaseUrl;

try {
  const configPath = path.join(process.cwd(), "config", "global-settings.json");
  const fileContent = fs.readFileSync(configPath, "utf-8");
  const config = JSON.parse(fileContent);
  apiBaseUrl = config.apiBaseUrl || apiBaseUrl;
} catch (error) {
  console.log(error);
}

apiBaseUrl =
  apiBaseUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
