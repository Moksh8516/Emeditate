import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const isPublicPath = path === '/admin/login'
  console.log('📍 Is public path?:', isPublicPath);

  // Get the accessToken from cookies (matching backend cookie name)
  const token = request.cookies.get('accessToken')?.value
  // redirect to dashboard
  if (isPublicPath && token) {
    // console.log('↪️ Redirecting authenticated user from login to dashboard');
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // If the path is protected and user is not logged in,
  // redirect to login
  if (!isPublicPath && !token) {
    console.log('⛔ Unauthorized access, redirecting to login');
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Continue with the request if authentication is valid
  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/login'
  ]
}
