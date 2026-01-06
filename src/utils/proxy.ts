import { NextRequest, NextResponse } from "next/server";

export type MiddlewareFn = (
  req: NextRequest,
  res: NextResponse
) => NextResponse | Promise<NextResponse>;

export function compose(...fns: MiddlewareFn[]) {
  return async (req: NextRequest) => {
    let res = NextResponse.next();
    for (const fn of fns) {
      res = await fn(req, res);
    }
    return res;
  };
}
