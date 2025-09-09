import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import createMiddleware from "next-intl/middleware";

import { checkToken } from "@/lib/auth";

import { routing } from "./i18n/routing";
import { AUTH_LOGIN_URL, AUTH_TOKEN_COOKIE } from "./lib/constants";

export default function middleware(request: NextRequest) {
    // Un comment for protected paths
    const [, ...segments] = request.nextUrl.pathname.split("/");
    const pathname = segments.join("/");

    const protectedPaths = ["dashboard", "operator", "report", "settings", "users", "video"]; // Add paths as needed
    if (protectedPaths.some(path => pathname.startsWith(path))) {
        const token = request.cookies.get(AUTH_TOKEN_COOKIE);
        const isValid = checkToken(token?.value.toString());
        if (!isValid) {
            request.cookies.delete(AUTH_TOKEN_COOKIE);
            const url = request.nextUrl.clone();
            url.searchParams.set("next-url", request.nextUrl.pathname);
            url.pathname = AUTH_LOGIN_URL;
            return NextResponse.redirect(url);
        }
    }

    const handleI18nRouting = createMiddleware(routing);
    return handleI18nRouting(request);
}

export const config = {
    matcher: [
        // Enable a redirect to a matching locale at the root
        "/",

        // Set a cookie to remember the previous locale for
        // all requests that have a locale prefix
        "/(tk|ru|en)/:path*",

        // Enable redirects that add missing locales
        // (e.g. `/pathnames` -> `/en/pathnames`)
        "/((?!_next|_vercel|.*\\..*).*)",
    ],
};
