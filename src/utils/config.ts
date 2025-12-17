import packageJson from "../../package.json";

export type Environment = "local" | "staging" | "production" | "development";

interface Config {
  env: Environment;
  version: string;
}

const getEnvironment = (): Environment => {
  if (process.env.VERCEL_ENV) {
    if (
      process.env.VERCEL_ENV === "production" &&
      process.env.VERCEL_GIT_COMMIT_REF === "master"
    ) {
      return "production";
    }
    return "staging";
  }
  if (process.env.NODE_ENV === "development") {
    return "development";
  }
  return "local";
};

export const config: Config = {
  env: getEnvironment(),
  version: packageJson.version,
} as const;
