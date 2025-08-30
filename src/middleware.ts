import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import createMiddleware from "next-intl/middleware";

import {checkToken} from "@/lib/auth";

import {AUTH_LOGIN_URL, AUTH_TOKEN_COOKIE} from "./lib/constants";
import { routing } from "./i18n/routing";

export default function middleware(request: NextRequest) {

    // Un comment for protected paths
    const [, ...segments] = request.nextUrl.pathname.split('/');
    const pathname = segments.join("/");

    const protectedPaths = ['dashboard',]; // Add paths as needed
    if (protectedPaths.some(path => pathname.startsWith(path))) {

        const token = request.cookies.get(AUTH_TOKEN_COOKIE);
        const isValid = checkToken(token?.value.toString());
        if (!isValid) {
            request.cookies.delete(AUTH_TOKEN_COOKIE);
            const url = request.nextUrl.clone()
            url.searchParams.set('next-url', request.nextUrl.pathname);
            url.pathname = AUTH_LOGIN_URL;
            return NextResponse.redirect(url)
        }
    }

    const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`
    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, ' ')
        .trim()

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nonce', nonce)

    requestHeaders.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
    )

    const handleI18nRouting = createMiddleware(routing);
    const response =  handleI18nRouting(request);
    response?.headers.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
    )

    return response
};


export const config = {
    matcher: [

        // Enable a redirect to a matching locale at the root
        '/',

        // Set a cookie to remember the previous locale for
        // all requests that have a locale prefix
        '/(tk|ru)/:path*',

        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
            missing: [
                {type: 'header', key: 'next-router-prefetch'},
                {type: 'header', key: 'purpose', value: 'prefetch'},
            ],
        },
    ],
}

