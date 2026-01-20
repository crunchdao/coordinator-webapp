import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { config as appConfig } from "@/utils/config";
import { isRouteAllowed, INTERNAL_LINKS } from "@/utils/routes";
import { compose } from "./utils/proxy";
import { withCsp } from "./utils/security/withCsp";
import { withMaintenance } from "./utils/withMaintenance";
import { withLocalApiBlock } from "./utils/withLocalApiBlock";

const run = compose(withCsp, withMaintenance, withLocalApiBlock);

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const env = appConfig.env;

  if (!isRouteAllowed(pathname, env)) {
    return NextResponse.redirect(new URL(INTERNAL_LINKS.ROOT, request.url));
  }

  return run(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|fonts).*)"],
};
