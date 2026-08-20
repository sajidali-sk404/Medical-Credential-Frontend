// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  // Read the frontend-set cookie (not the httpOnly backend one)
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")
  const isClientPage = pathname.startsWith("/dashboard")
  const isAdminPage = pathname.startsWith("/admin")
  const isProviderPage = pathname.startsWith("/provider")

  // Not logged in
  if (!token) {
    if (isClientPage || isAdminPage || isProviderPage) {
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

  // Role restriction checks
  if (role === "client" && (isAdminPage || isProviderPage)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (role === "admin" && (isClientPage || isProviderPage)) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  if (role === "provider" && (isClientPage || isAdminPage)) {
    return NextResponse.redirect(new URL("/provider/dashboard", request.url))
  }

  // Already logged in visiting auth pages
  if (isAuthPage) {
    let target = "/dashboard"
    if (role === "admin") target = "/admin/dashboard"
    if (role === "provider") target = "/provider/dashboard"
    return NextResponse.redirect(new URL(target, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}