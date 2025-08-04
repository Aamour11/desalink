
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session_id');
 
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');

  // If the user is on an auth page but already has a session, redirect to the dashboard.
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If the user is trying to access a protected route without a session, redirect to the login page.
  if (request.nextUrl.pathname.startsWith('/dashboard') && !sessionCookie) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
 
  const response = NextResponse.next();

  // This is a workaround to apply headers set in server actions
  // In a real app, login/logout should ideally be API routes.
  if (request.headers.has('Set-Cookie')) {
    const newCookies = request.headers.get('Set-Cookie');
    if (newCookies) {
        response.headers.set('Set-Cookie', newCookies);
    }
  }

  return response
}
 
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/signup-petugas'],
}
