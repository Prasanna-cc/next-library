import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { JWT } from "next-auth/jwt";

const publicPages = ["/", "/signin", "/signup"];

// Define restricted admin paths
const restrictedAdminPaths = ["/dashboard/admin(.*)"];

const handleI18nRouting = createMiddleware(routing);

// Authentication middleware with role-based authorization
const authMiddleware = withAuth(
  // Called when the user is authorized

  function middleware(req) {
    // handle role based authentication here. make the request to /accessDenied if fails and let the handleI18nRouting(req) handle locale prefixing.
    const token = req.nextauth.token as JWT; // Access the token from the request
    const pathName = req.nextUrl.pathname;
    const isRestrictedAdminPath = restrictedAdminPaths.some((path) =>
      new RegExp(path).test(pathName)
    );
    if (isRestrictedAdminPath && token.role !== "admin") {
      // User is not authorized for admin access
      const redirectUrl = new URL("/accessDenied", req.url);
      const redirectedRequest = new NextRequest(redirectUrl);
      return handleI18nRouting(redirectedRequest);
    }
    // Delegate to the i18n middleware for locale handling
    return handleI18nRouting(req);
  },
  {
    callbacks: {
      // Role-based authorization
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: "/signin",
    },
  }
);

export default function middleware(req: NextRequest) {
  const locales = routing.locales;

  // Regex to match the public pages (with or without locale prefix)
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i"
  );

  // Determine if the current request is for a public page
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  // Handle public pages with only locale routing (no authentication needed)
  if (isPublicPage) {
    return handleI18nRouting(req);
  }
  // For protected routes, run authentication and locale handling
  return (authMiddleware as any)(req);
}

// Config for matching all paths except for certain internal Next.js and API routes
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
