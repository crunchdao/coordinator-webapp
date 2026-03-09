import { NextRequest, NextResponse } from "next/server";

const DEFAULT_BASE_URL = "http://localhost:8000";

/**
 * Proxies requests to a coordinator node backend.
 *
 * Usage: GET /api/coordinator-node/reports/leaderboard?baseUrl=https://api.example.com/api
 *
 * The `baseUrl` query param specifies the coordinator node URL.
 * Falls back to http://localhost:8000 if not provided.
 *
 * The rest of the path is forwarded as-is to the coordinator node.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const baseUrl =
    request.nextUrl.searchParams.get("baseUrl") || DEFAULT_BASE_URL;

  try {
    new URL(baseUrl);
  } catch {
    return NextResponse.json(
      { error: "Invalid baseUrl" },
      { status: 400 }
    );
  }

  const targetUrl = `${baseUrl.replace(/\/$/, "")}/${path.join("/")}`;
  console.log("[coordinator-node proxy]", { baseUrl, targetUrl });

  const response = await fetch(targetUrl);

  if (!response.ok) {
    return NextResponse.json(
      { error: `Coordinator node returned ${response.status}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
