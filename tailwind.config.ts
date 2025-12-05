import sharedConfig from "@crunch-ui/tailwind-config";
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Pick<Config, "content" | "presets"> = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@crunch-ui/core/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [
    {
      ...sharedConfig,
      theme: {
        ...sharedConfig.theme,
        container: undefined,
      },
      plugins: [...(sharedConfig.plugins ?? []), tailwindcssAnimate],
    },
  ],
};

export default config;
