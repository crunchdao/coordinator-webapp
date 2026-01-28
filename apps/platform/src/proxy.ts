import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { config as appConfig } from "@coordinator/utils/src/config";
import { isRouteAllowed, INTERNAL_LINKS } from "@coordinator/utils/src/routes";
import { compose } from "@coordinator/utils/src/proxy";
import { withCsp } from "@coordinator/utils/src/security/withCsp";
import { withMaintenance } from "@coordinator/utils/src/withMaintenance";
import { withLocalApiBlock } from "@coordinator/utils/src/withLocalApiBlock";

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
