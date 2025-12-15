import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { config as appConfig } from "@/utils/config";
import { isRouteAllowed, INTERNAL_LINKS } from "@/utils/routes";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const env = appConfig.env;

  if (!isRouteAllowed(pathname, env)) {
    return NextResponse.redirect(new URL(INTERNAL_LINKS.ROOT, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)"],
};
