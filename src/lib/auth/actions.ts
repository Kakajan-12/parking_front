"use server";

import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";

import jwtDecode from "jwt-decode";

import { checkToken } from "@/lib/auth/index";
import {
    AUTH_LOGOUT_REDIRECT,
    AUTH_LOGOUT_URL,
    AUTH_REFRESH_TOKEN_COOKIE,
    AUTH_TOKEN_COOKIE,
    COOKIE_ENABLE_SECURE,
    COOKIE_PATH,
    COOKIE_SAME_SITE,
} from "@/lib/constants";

export const navigateToLogout = async () => {
    redirect(AUTH_LOGOUT_URL, RedirectType.replace);
};

export const destroyAuthCookies = async (redirectRequire: boolean = true): Promise<void> => {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_TOKEN_COOKIE);
    if (redirectRequire) {
        redirect(AUTH_LOGOUT_REDIRECT); // Navigate to the new post page
    }
};

export const checkAuthCookies = async (): Promise<[string | undefined, boolean]> => {
    const token = await getAuthToken();
    return [token, checkToken(token)];
};

export const setAuthCookies = async (
    response: {
        access_token: string;
        refresh_token?: string;
    },
    remember?: boolean,
) => {
    let exp = undefined;
    const cookiesStore = await cookies();
    if (remember) {
        const decoded = jwtDecode<{ exp: number }>(response.refresh_token ?? response.access_token);
        exp = new Date(decoded.exp * 1000);
    }
    cookiesStore.set(AUTH_TOKEN_COOKIE, `Bearer ${response.access_token}`, {
        path: COOKIE_PATH,
        expires: exp,
        secure: COOKIE_ENABLE_SECURE,
        sameSite: COOKIE_SAME_SITE,
    });
    if (response.refresh_token) {
        cookiesStore.set(AUTH_REFRESH_TOKEN_COOKIE, response.refresh_token, {
            path: COOKIE_PATH,
            expires: exp,
            secure: COOKIE_ENABLE_SECURE,
            sameSite: COOKIE_SAME_SITE,
        });
    }
};

export const getAuthToken = async (): Promise<string | undefined> => {
    const cookieStore = await cookies();
    return cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
};

