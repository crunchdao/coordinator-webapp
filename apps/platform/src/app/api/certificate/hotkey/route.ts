import { NextRequest, NextResponse } from "next/server";

function getCpiApiUrl(): string {
  const hubUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (hubUrl.includes("crunchdao.io")) {
    return "https://cpi.crunchdao.io/";
  }
  return "https://cpi.crunchdao.com/";
}

interface HotkeyResponse {
  hotkey: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const cpiUrl = getCpiApiUrl();
    const response = await fetch(
      `${cpiUrl}hotkeys?wallet=${encodeURIComponent(wallet)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Hotkey not found for this wallet" },
          { status: 404 }
        );
      }
      const errorText = await response.text();
      console.error("CPI hotkey error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch hotkey" },
        { status: response.status }
      );
    }

    const data: HotkeyResponse = await response.json();

    return NextResponse.json({ hotkey: data.hotkey });
  } catch (error) {
    console.error("Hotkey fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotkey" },
      { status: 500 }
    );
  }
}
