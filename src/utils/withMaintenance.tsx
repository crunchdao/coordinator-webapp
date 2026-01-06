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

    const isInMaintenanceMode = await get<boolean>(
      "isCoordinatorPlatformInMaintenanceMode"
    );

    if (isInMaintenanceMode) {
      req.nextUrl.pathname = INTERNAL_LINKS.MAINTENANCE;
      return NextResponse.rewrite(req.nextUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error checking maintenance mode:", error);
    return NextResponse.next();
  }
}
