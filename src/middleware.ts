
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define the name for your session cookie
const SESSION_COOKIE_NAME = "session_id";
 
export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME);
 
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                   request.nextUrl.pathname.startsWith('/signup') || 
                   request.nextUrl.pathname.startsWith('/signup-petugas');

  const requestHeaders = new Headers(request.headers);
  const simulationUserId = request.nextUrl.searchParams.get('sim_user');
  
  if (simulationUserId) {
    requestHeaders.set('x-simulation-user-id', simulationUserId);
  }

  // If the user is on an auth page but has a session, redirect to the dashboard.
  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
 
  // If the user is not authenticated and trying to access a protected page, redirect to login
  if (!sessionToken && !isAuthPage && request.nextUrl.pathname !== '/') {
      return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
 
export const config = {
  // Match all routes except for static files, API routes, and the homepage
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|uploads|.*\\.png$).*)'
  ],
}
