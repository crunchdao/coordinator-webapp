import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy requests to the coordinator node to avoid CORS issues.
 * 
 * Usage: POST /api/node-proxy
 * Body: { "nodeUrl": "http://...", "path": "/healthz", "method": "GET" }
 * 
 * Or for POST/PATCH:
 * Body: { "nodeUrl": "http://...", "path": "/reports/checkpoints/CKP_001/confirm", "method": "POST", "body": { "tx_hash": "..." } }
 */
export async function POST(request: NextRequest) {
  try {
    const { nodeUrl, path, method = "GET", body } = await request.json();

    if (!nodeUrl || !path) {
      return NextResponse.json(
        { error: "nodeUrl and path are required" },
        { status: 400 }
      );
    }

    const url = `${nodeUrl}${path}`;
    const fetchOptions: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    if (body && method !== "GET") {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json().catch(() => null);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proxy error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
