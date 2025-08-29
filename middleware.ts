import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "./lib/config";

// ✅ Role-based route rules
const ROUTE_PERMISSIONS = {
  admin: /^\/admin\/dashboard(\/.*)?$/, // admin can access all dashboard
  "content Manager": [
    /^\/admin\/dashboard\/blog(\/.*)?$/, // blog
    /^\/admin\/dashboard\/change-password$/, // change password
    /^\/admin\/dashboard\/profile$/, // profile
  ],
} as const;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("accessToken")?.value;
  console.log("Middleware token:", token);

  // 🚦 No token → go to login
  if (!token) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // ✅ Verify JWT with jose
    const secret = new TextEncoder().encode(JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    console.log(payload);

    const role = payload.role as string;

    // ✅ Check if this role is allowed for current path
    if (checkPermission(role, pathname)) {
      return NextResponse.next();
    }

    // 🚦 Redirect to default page for role
    return NextResponse.redirect(new URL(getRedirectPath(role), req.url));
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

// 🔒 Permission check
function checkPermission(role: string, pathname: string): boolean {
  if (role === "admin") return ROUTE_PERMISSIONS.admin.test(pathname);
  if (role === "content Manager")
    return ROUTE_PERMISSIONS["content Manager"].some((regex) =>
      regex.test(pathname)
    );
  return false;
}

// 🎯 Default redirect paths
function getRedirectPath(role: string): string {
  if (role === "content Manager") return "/admin/dashboard/blog";
  if (role === "admin") return "/admin/dashboard";
  return "/admin/login";
}

export const config = {
  matcher: ["/admin/dashboard", "/admin/dashboard/:path*"], // ✅ only runs for admin/dashboard pages
};
