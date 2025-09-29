export const PROJECT_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME;

export const AUTH_TOKEN = "access_token";
export const AUTH_TOKEN_COOKIE: string = "Authorization";
export const AUTH_REFRESH_TOKEN_COOKIE: string = "refresh";
export const AUTH_LOGOUT_REDIRECT = "/auth/sign-in";

export const AUTH_LOGIN_URL = "/auth/sign-in";
export const AUTH_LOGOUT_URL = "/auth/logout";

export const AUTH_REMEMBER_ME = "remember_me";

export const COOKIE_DEFAULT_AGE = 10 * 365 * 24 * 60 * 60;
export const COOKIE_PATH = process.env.NEXT_PUBLIC_COOKIE_PATH;
export const COOKIE_SAME_SITE: true | false | "lax" | "strict" | "none" | undefined = "strict";
export const COOKIE_ENABLE_SECURE = process.env.NEXT_PUBLIC_ENABLE_COOKIE_SECURE === "true";

export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_PRODUCTION_BUILD = process.env.NODE_ENV === "production";

const VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "";

export const WEBAPP_URL =
    process.env.NEXT_PUBLIC_WEBAPP_URL || VERCEL_URL || "http://localhost:3000";
export const DEFAULT_LOCALE = "tk";

export const BASE_URL =
    typeof window !== "undefined" ? process.env.NEXT_PUBLIC_BASE_URL : process.env.BASE_SERVER_URL;
export const MEDIA_HOST = process.env.NEXT_PUBLIC_MEDIA_HOST ?? WEBAPP_URL;

// NEXT CACHING DEFAULTS
export const MD_DELAY = 1; // revalidate at every 1 second
export const M_FIVE_MINUTES_DELAY = 600; // revalidate at every 5 minute
export const M_HOUR_DELAY = 3600; // revalidate at every 1 hour
export const M_DAY_DELAY = 86400; // revalidate at every 1 day
export const M_WEEK_DELAY = 604800; // revalidate at every 1 week
export const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Company name";
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Site name";
export const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? "localhost";
