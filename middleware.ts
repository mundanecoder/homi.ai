import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that do not require authentication
const publicPaths = ["/login", "/sign-up"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request URL is a public path
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for the token in the request cookies
  const token = request.cookies.get("token")?.value;

  console.log(token, "dance");

  // Redirect to login page if the token is not found
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the original URL as a query parameter for redirection after login
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed if the token is found
  return NextResponse.next();
}

// Specify which paths the middleware should apply to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     * - sign-up
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
