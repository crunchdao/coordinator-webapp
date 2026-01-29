import { NextRequest, NextResponse } from "next/server";
import { buildCspValue } from "./csp";

export async function withCsp(req: NextRequest, res: NextResponse) {
  const accept = req.headers.get("accept") || "";
  if (!accept.includes("text/html")) return res;

  const reportOnly = process.env.CSP_REPORT_ONLY === "1";
  const { headerName, value } = buildCspValue(
    (process.env.NODE_ENV as "development" | "production" | "test") ??
      "production",
    reportOnly
  );

  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set(headerName, value);

  return res;
}
