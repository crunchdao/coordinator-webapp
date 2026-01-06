import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/edge-config";
import { INTERNAL_LINKS } from "./routes";

export async function withMaintenance(req: NextRequest): Promise<NextResponse> {
  try {
    if (req.nextUrl.pathname === INTERNAL_LINKS.MAINTENANCE) {
      return NextResponse.next();
    }

    if (!process.env.EDGE_CONFIG) {
      return NextResponse.next();
    }

    const environment: "production" | "staging" | undefined =
      process.env.NEXT_PUBLIC_SOLANA_NETWORK === "devnet"
        ? "staging"
        : process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet"
        ? "production"
        : undefined;

    const maintenanceMode = await get<{
      production: boolean;
      staging: boolean;
    }>("isCoordinatorPlatformInMaintenanceMode");

    if (environment && maintenanceMode?.[environment]) {
      req.nextUrl.pathname = INTERNAL_LINKS.MAINTENANCE;
      return NextResponse.rewrite(req.nextUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error checking maintenance mode:", error);
    return NextResponse.next();
  }
}
