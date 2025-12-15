import packageJson from "../../package.json";

export type Environment = "development" | "staging" | "production";

interface Config {
  env: Environment;
  version: string;
}

const getEnvironment = (): Environment => {
  if (process.env.NODE_ENV === "development") {
    return "development";
  }

  if (process.env.VERCEL_ENV) {
    if (
      process.env.VERCEL_ENV === "production" &&
      process.env.VERCEL_GIT_COMMIT_REF === "master"
    ) {
      return "production";
    }

    return "staging";
  }

  return process.env.NODE_ENV === "production" ? "production" : "development";
};

export const config: Config = {
  env: getEnvironment(),
  version: packageJson.version,
} as const;
