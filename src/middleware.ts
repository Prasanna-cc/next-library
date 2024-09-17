import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

// const restrictedAdminPaths = [
//   "/dashboard/admin/allTransactions",
//   "/dashboard/admin/books",
//   "/dashboard/admin/members",
// ];
// const userPaths = ["/dashboard/transactions"];

// export default withAuth(function middleware(req) {
//   const token = req.nextauth.token;
//   const pathName = req.nextUrl.pathname;

//   if (userPaths.includes(pathName)) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/signin", req.url));
//     }
//   }

//   if (restrictedAdminPaths.includes(pathName)) {
//     if (!token || token.role !== "admin") {
//       return NextResponse.redirect(new URL("/accessDenied", req.url));
//     }
//   }

//   // Step 1: Use the incoming request (example)
//   const defaultLocale = req.headers.get("kn") || "en";

//   // Step 2: Create and call the next-intl middleware (example)
//   const handleI18nRouting = createMiddleware(routing);
//   const response = handleI18nRouting(req);

//   // Step 3: Alter the response (example)
//   response.headers.set("kn", defaultLocale);

//   return response;
// });

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    // "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    "/",
    "/(kn|en)/dashborad/:path*",
  ],
};
