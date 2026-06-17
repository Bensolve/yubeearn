import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('userId')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const isProtected =
    pathname.startsWith('/dashboard');

  // Auth routes (redirect if already logged in)
  const isAuthRoute =
    pathname === '/login' || pathname === '/signup';

  if (isProtected && !userId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && userId) {
    return NextResponse.redirect(new URL('/dashboard/earner', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};