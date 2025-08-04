
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define the name for your session cookie
const SESSION_COOKIE_NAME = "session_id";
 
export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME);
 
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                   request.nextUrl.pathname.startsWith('/signup') || 
                   request.nextUrl.pathname.startsWith('/signup-petugas');

  // For the role switcher demo, we pass the role via a custom header
  // This allows server components to know which user to simulate
  const requestHeaders = new Headers(request.headers);
  const activeRole = request.cookies.get('activeRole')?.value;
  if (activeRole) {
    requestHeaders.set('x-active-role', activeRole);
  }


  // If the user is on an auth page but has a session, redirect to the dashboard.
  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If the user tries to access a dashboard page without a session, we now allow it
  // The dashboard layout will handle showing mock data.
  // if (request.nextUrl.pathname.startsWith('/dashboard') && !sessionToken) {
  //   const loginUrl = new URL('/login', request.url)
  //   // You can add a 'from' query parameter to redirect back after login
  //   loginUrl.searchParams.set('from', request.nextUrl.pathname);
  //   return NextResponse.redirect(loginUrl)
  // }
 
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
 
export const config = {
  // Match all routes except for static files, API routes, and the homepage
  matcher: [
    '/dashboard/:path*', 
    '/login', 
    '/signup', 
    '/signup-petugas',
  ],
}
