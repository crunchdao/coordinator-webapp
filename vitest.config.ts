import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    include: ["packages/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@coordinator/utils": path.resolve(__dirname, "packages/utils"),
      "@coordinator/ui": path.resolve(__dirname, "packages/ui"),
      "@coordinator/leaderboard": path.resolve(
        __dirname,
        "packages/leaderboard"
      ),
      "@coordinator/metrics": path.resolve(__dirname, "packages/metrics"),
    },
  },
});
