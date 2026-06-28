import { NextRequest, NextResponse } from "next/server"

const PUBLIC_PATHS = ["/auth/login", "/auth/register"]

export function middleware(req: NextRequest) {
  const token = req.cookies.get("nexttalk_token")?.value
  const { pathname } = req.nextUrl

  if (!token && pathname.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }
  if (token && PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/chat", req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/chat/:path*", "/auth/:path*"],
}
