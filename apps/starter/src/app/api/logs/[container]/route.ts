import { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ container: string }> }
) {
  const { container } = await params;

  const upstreamUrl = `${API_URL}/logs/${encodeURIComponent(container)}?follow=true&tail=200`;

  const upstreamResponse = await fetch(upstreamUrl, {
    signal: req.signal,
    headers: { Accept: "text/event-stream" },
  });

  if (!upstreamResponse.ok) {
    const body = await upstreamResponse.text().catch(() => "upstream error");
    return new Response(body, { status: upstreamResponse.status });
  }

  if (!upstreamResponse.body) {
    return new Response("No response body from upstream", { status: 502 });
  }

  return new Response(upstreamResponse.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
