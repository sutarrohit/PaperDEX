// Import getSessionCookie or getCookieCache from better-auth/cookies
import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const authRoutes = ["/sign-in", "/sign-up", "/reset-password", "/forgot-password"];
const protectedRoutes = ["/dashboard", "/trade", "/market", "/history"];

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  const isAuthRoute = authRoutes.some((route) => pathName.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) => pathName.startsWith(route));

  const hasSessionCookie = getSessionCookie(request);
  const sessionExists = hasSessionCookie;

  if (!sessionExists) {
    // User is not logged in / session cookie not present
    if (isProtectedRoute) {
      const pathname = request.nextUrl.pathname;
      const filteredSearchParams = new URLSearchParams(request.nextUrl.search);
      filteredSearchParams.delete("redirect");

      const searchString = filteredSearchParams?.toString();
      const redirectTo = searchString ? `${pathname}?${searchString}` : pathname;

      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", redirectTo);

      // Add a header to prevent caching issues in Next.js middleware
      const response = NextResponse.redirect(signInUrl);
      response.headers.set("x-middleware-cache", "no-cache");
      return response;
    }

    return NextResponse.next();
  }

  if (isAuthRoute) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.headers.set("x-middleware-cache", "no-cache"); // Prevent caching of this redirect
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
