import { NextRequest, NextResponse } from "next/server";

function getTargetUrl(request: NextRequest): string | null {
  return request.nextUrl.searchParams.get("url");
}

function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generic proxy to bypass CORS restrictions.
 *
 * Usage:
 *   GET   /api/proxy?url=https://example.com/api/data
 *   POST  /api/proxy?url=https://example.com/api/data  (body forwarded)
 *   PATCH /api/proxy?url=https://example.com/api/data  (body forwarded)
 */
export async function GET(request: NextRequest) {
  const url = getTargetUrl(request);
  if (!url) {
    return NextResponse.json(
      { error: "Missing 'url' query parameter" },
      { status: 400 }
    );
  }
  if (!validateUrl(url)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${response.status}` },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch upstream",
      },
      { status: 502 }
    );
  }
}

async function forwardWithBody(request: NextRequest, method: string) {
  const url = getTargetUrl(request);
  if (!url) {
    return NextResponse.json(
      { error: "Missing 'url' query parameter" },
      { status: 400 }
    );
  }
  if (!validateUrl(url)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const body = await request.text();
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body || undefined,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${response.status}` },
        { status: response.status }
      );
    }

    const text = await response.text();
    if (!text) return NextResponse.json(null);
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch upstream",
      },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  return forwardWithBody(request, "POST");
}

export async function PATCH(request: NextRequest) {
  return forwardWithBody(request, "PATCH");
}
