import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = ['/admin/login', "/newChat"];

// List of routes that require authentication
const protectedRoutes = ['/admin/dashboard'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Get the token from cookies
  const token = request.cookies.get('accessToken')?.value;
  console.log('Cookie from backend:', token);
  
  const isPublicPath = publicRoutes.includes(path);
  const isProtectedPath = protectedRoutes.some(route => path.startsWith(route));

  // If the user is on a public path (like login) and has a token,
  // redirect them to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/admin/dashboard/upload', request.url));
  }

  // If the user is trying to access a protected path without a token,
  // redirect them to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/admin/login', request.url);
    // Store the attempted URL to redirect back after login
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all admin routes
    '/admin/:path*'
  ]
}
