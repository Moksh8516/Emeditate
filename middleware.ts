// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// ✅ Role-based route rules
const ROUTE_PERMISSIONS: Record<string, RegExp[] | RegExp> = {
  admin: /^\/admin\/dashboard(\/.*)?$/, // admin can access all dashboard
  "content Manager": [
    /^\/admin\/dashboard\/blog(\/.*)?$/, // blog section
    /^\/admin\/dashboard\/change-password$/, // change password
    /^\/admin\/dashboard\/profile$/, // profile
  ],
};

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET)
  throw new Error("JWT_SECRET is not defined in environment variables");

const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("accessToken")?.value;

  // 🚦 CASE 1: No token found
  if (!token) {
    // 👇 Admin routes → go to /admin/login with callback
    if (pathname.startsWith("/admin/dashboard")) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 👇 Other protected routes → go to /login-or-create
    const generalLoginUrl = new URL("/login-or-create", req.url);
    generalLoginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(generalLoginUrl);
  }

  try {
    // ✅ Verify token (ignore expiration for silent refresh)
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;

    // ✅ Role is allowed on this path
    if (checkPermission(role, pathname)) return NextResponse.next();

    // 🚦 Role exists but path not allowed → redirect to default route
    return NextResponse.redirect(new URL(getDefaultPath(role), req.url));
  } catch (err) {
    const error = err as Error & { code?: string; name?: string };

    if (error?.code === "ERR_JWT_EXPIRED" || error?.name === "JWTExpired") {
      console.warn("Token expired but allowing silent refresh.");
      return NextResponse.next(); // let axios handle refresh silently
    }

    console.error("JWT verification failed:", err);

    // 👇 Invalid/malformed/expired token
    if (pathname.startsWith("/admin/dashboard")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.redirect(new URL("/login-or-create-account", req.url));
  }
}

// 🔒 Permission check
function checkPermission(role: string, pathname: string): boolean {
  const permission = ROUTE_PERMISSIONS[role];
  if (!permission) return false;

  if (permission instanceof RegExp) return permission.test(pathname);
  return permission.some((regex) => regex.test(pathname));
}

// 🎯 Default redirect paths
function getDefaultPath(role: string): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "content Manager":
      return "/admin/dashboard/blog";
    default:
      return "/login-or-create";
  }
}

// ⚡ Apply only to admin dashboard routes
export const config = {
  matcher: ["/admin/dashboard", "/admin/dashboard/:path*"],
};
