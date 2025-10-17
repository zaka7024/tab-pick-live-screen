import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isLoginPage = req.nextUrl.pathname.startsWith('/login')
  const isApiRoute = req.nextUrl.pathname.startsWith('/api')

  // Allow API routes to pass through
  if (isApiRoute) {
    return NextResponse.next()
  }

  // If user is logged in and trying to access login page, redirect to display
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/display', req.url))
  }

  // If user is not logged in and trying to access protected routes, redirect to login
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}