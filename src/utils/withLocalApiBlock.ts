import { NextResponse } from "next/server";
import { MiddlewareFn } from "./proxy";

const LOCAL_API_PATHS = [
  "/api/logs",
  "/api/settings",
  "/api/leaderboard",
  "/api/metrics/widgets",
];

export const withLocalApiBlock: MiddlewareFn = async (req, res) => {
  const pathname = req.nextUrl.pathname;

  const isLocalApi = LOCAL_API_PATHS.some((path) => pathname.startsWith(path));

  const vercelEnv = process.env.VERCEL_ENV;
  const isDevelopment = process.env.NODE_ENV === "development";

  const allowLocalApis = isDevelopment || !vercelEnv;

  if (isLocalApi && !allowLocalApis) {
    return NextResponse.json(
      {
        error: "This API is only available in local environment",
        message: `Local APIs are disabled on Vercel deployments`,
      },
      { status: 403 }
    );
  }

  return res;
};
