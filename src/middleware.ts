import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { getToken, JWT } from "next-auth/jwt";

const publicPages = ["/", "/signin", "/signup"];

const restrictedAdminPaths = ["/dashboard/admin(.*)"];

const handleI18nRouting = createMiddleware(routing);

const authMiddleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token as JWT;
    const pathName = req.nextUrl.pathname;
    const isRestrictedAdminPath = restrictedAdminPaths.some((path) =>
      new RegExp(path).test(pathName)
    );
    if (isRestrictedAdminPath && token.role !== "admin") {
      const redirectUrl = new URL("/accessDenied", req.url);
      const redirectedRequest = new NextRequest(redirectUrl);
      return handleI18nRouting(redirectedRequest);
    }
    return handleI18nRouting(req);
  },
  {
    callbacks: {
      authorized: async (token) => token != null,
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

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return handleI18nRouting(req);
  }
  return (authMiddleware as any)(req);
}

// Config for matching all paths except for certain internal Next.js and API routes
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
