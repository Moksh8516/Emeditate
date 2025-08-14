import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Protect only admin dashboard routes
  if (pathname.startsWith("/admin/dashboard")) {
     const token = req.cookies.get("accessToken")?.value;
    const fullPath = pathname + search;
    if (!token) {
        console.log('token is missing, redirecting to login');
        // Create absolute URL for login
      const loginUrl = new URL("/admin/login", req.url);
      
      // Set callback URL for redirect after login
      loginUrl.searchParams.set("callbackUrl", fullPath);
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Apply middleware only to dashboard routes
export const config = {
  matcher: [
    "/admin/dashboard",
    "/admin/dashboard/:path*"
  ],
};
