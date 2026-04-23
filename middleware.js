// middleware.js (root of frontend project)
import { NextResponse } from "next/server"

export function middleware(request) {
  const token    = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  // ── Not logged in at all ──────────────────────────────────────────
  if (!token) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/requests")  ||
      pathname.startsWith("/admin")
    ) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }
    return NextResponse.next()
  }

  // ── Decode role from JWT payload (no library needed) ─────────────
  // JWT is base64: header.payload.signature
  // We only need the payload (middle part)
  let role = null
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    role = payload.role   // "client" | "admin"
  } catch {
    // malformed token — send to sign-in
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  // ── Client trying to access admin routes ─────────────────────────
  if (role === "client" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // ── Admin trying to access client routes ─────────────────────────
  if (role === "admin" && (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/requests")
  )) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  // ── Already logged in, trying to visit sign-in/sign-up ───────────
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    const redirect = role === "admin" ? "/admin/dashboard" : "/dashboard"
    return NextResponse.redirect(new URL(redirect, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}