// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  // Read the frontend-set cookie (not the httpOnly backend one)
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")
  const isClientPage = pathname.startsWith("/dashboard") || pathname.startsWith("/dashboard/requests") || pathname.startsWith("/dashboard/new-request") || pathname.startsWith("/dashboard/support")
  const isAdminPage = pathname.startsWith("/admin/dashboard") || pathname.startsWith("/admin/requests") || pathname.startsWith("/admin/users")

  // Not logged in
  if (!token) {
    if (isClientPage || isAdminPage) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }
    return NextResponse.next()
  }

  // Decode role from JWT
  let role = null
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    role = payload.role
  } catch {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  // Client trying admin routes
  if (role === "client" && isAdminPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Admin trying client routes
  if (role === "admin" && isClientPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  // Already logged in visiting auth pages
  if (isAuthPage) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin/dashboard" : "/dashboard", request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}