import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getSession, Session } from '@/app/lib/session';
import { MiddlewareFactory } from '@/middleware';

export const COOKIE_SESSION_NAME: string = "filt"

export const getSessionFromReq = async (req: Request): Promise<Session | undefined> => {
  let sid = req.cookies.get(COOKIE_SESSION_NAME) // obtain session ID
  if (sid != null) {
    sid = sid.value
    console.log("\n\nFOUND COOKIE!!", sid)
    const session = await getSession(sid)

    console.log("session A", session)
    if (session) {
      console.log("RETURNED")
      return session
    }
  }
}

export const loggedIn: MiddlewareFactory = (next) => {
  return async(req: NextRequest, _next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;

    if (["/login"]?.some((path) => pathname.startsWith(path))) {
      const session = await getSessionFromReq(req)
      if (session) {
          return NextResponse.redirect(new URL("/account", req.url))
      } else {
        return next(req, _next);
      }
    } else if (["/account"]?.some((path) => pathname.startsWith(path))) {
      const session = await getSessionFromReq(req)
      if (session == null) {
        return NextResponse.redirect(new URL("/login", req.url))
      } else {
        return next(req, _next);
      }
    }
    return next(req, _next);
  };
};