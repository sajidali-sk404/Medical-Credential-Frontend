// middleware.js (root of frontend project)
import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')
  const { pathname } = request.nextUrl

  const isAuthPage   = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')
  const isClientPage = pathname.startsWith('/dashboard') || pathname.startsWith('/requests')
  const isAdminPage  = pathname.startsWith('/admin')

  // Not logged in → redirect to sign-in
  if (!token && (isClientPage || isAdminPage)) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // Already logged in → skip auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}