import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/profile", "/notifications", "/passkey-setup", "/lecturer", "/admin"];

export function middleware(request: NextRequest) {
  const cookieName = process.env.SESSION_COOKIE_NAME || "secure_learning_session";
  const hasSessionCookie = Boolean(request.cookies.get(cookieName)?.value);
  const needsSession = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  if (needsSession && !hasSessionCookie) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/profile", "/notifications", "/passkey-setup", "/lecturer/:path*", "/admin/:path*"] };
