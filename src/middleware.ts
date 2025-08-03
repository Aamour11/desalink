
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
 
  // Jika pengguna mencoba mengakses halaman login atau signup tetapi sudah memiliki sesi,
  // arahkan mereka ke dasbor.
  if ((request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Jika pengguna mencoba mengakses rute di dalam /dashboard tetapi tidak memiliki sesi,
  // arahkan mereka ke halaman login.
  /*
  if (request.nextUrl.pathname.startsWith('/dashboard') && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  */
 
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
