"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import { getTranslations } from "next-intl/server";

import { defaultLocale } from "@/config";
import { checkAuthCookies } from "@/lib/auth/actions";
import { AuthError } from "@/lib/auth/exceptions";
import { ApiError, OperatorSessionVisible } from "@/openapi/client";
import getServerInstance from "@/openapi/server-instance";

interface IResponse {
    status: number;
    message: string | null | undefined;
}

export const userSessionRevokeAction = async (objId: string): Promise<IResponse> => {
    const t = await getTranslations();

    const [token, isAuth] = await checkAuthCookies();
    if (!isAuth) {
        throw new AuthError(t("auth.must-sign-in"));
    }

    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value ?? defaultLocale;

    const fetchClient = await getServerInstance({
        locale: locale,
        token: token,
    });
    let result = undefined;
    try {
        const response = await fetchClient.account.userSessionRevoke({
            objId: objId,
        });
        result = { status: 200, message: response.message };
    } catch (e: any) {
        if (e instanceof ApiError) {
            if (e.status === 400) {
                return {
                    status: 400,
                    message: e.body?.detail || "errors.something-went-wrong",
                };
            } else {
                return {
                    status: e.status,
                    message: t("errors.something-went-wrong"),
                };
            }
        }
        return { status: 500, message: t("errors.something-went-wrong") };
    }
    revalidateTag("user-session-list");
    return result;
};


interface IOperatorCalculateResponse {
    status: number;
    message: string | null | undefined;
    data: OperatorSessionVisible | null;
}

export const operatorSessionCalculate = async (objId: number): Promise<IOperatorCalculateResponse> => {
    const t = await getTranslations();

    const [token, isAuth] = await checkAuthCookies();
    if (!isAuth) {
        throw new AuthError(t("auth.must-sign-in"));
    }

    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value ?? defaultLocale;

    const fetchClient = await getServerInstance({
        locale: locale,
        token: token,
    });
    let result = undefined;
    try {
        const response = await fetchClient.account.operatorSessionCalculate({
            objId: objId,
        });
        result = { status: 200, message: response.message, data: response.data };
    } catch (e: any) {
        if (e instanceof ApiError) {
            if (e.status === 400) {
                return {
                    status: 400,
                    message: e.body?.detail || "errors.something-went-wrong",
                    data: null
                };
            } else {
                return {
                    status: e.status,
                    message: t("errors.something-went-wrong"),
                    data: null
                };
            }
        }
        return { status: 500, message: t("errors.something-went-wrong"), data: null };
    }
    revalidateTag("user-session-list");
    return result;
};

interface IFetchResponse {
    status: number;
    message: string | null | undefined;
    data: {
        rows: Array<OperatorSessionVisible>;
    } | null;
}

export const fetchOperatorSessions = async ({
    page,
    limit,
    userId,
    sessionId,
}: {
    page: number;
    limit: number;
    userId?: string;
    sessionId?: string;
}): Promise<IFetchResponse> => {
    const t = await getTranslations();

    const [token, isAuth] = await checkAuthCookies();
    if (!isAuth) {
        throw new AuthError(t("auth.must-sign-in"));
    }

    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value ?? defaultLocale;

    const fetchClient = await getServerInstance({
        locale: locale,
        token: token,
        cache: "no-cache"
    });
    try {
        const response = await fetchClient.account.operatorSessionList({
            page: page,
            limit: limit,
            userId: userId,
            sessionId: sessionId,
        });
        return { status: 200, message: null, data: response };
    } catch (e: any) {
        if (e instanceof ApiError) {
            if (e.status === 400) {
                return {
                    status: 400,
                    message: e.body?.detail || "errors.something-went-wrong",
                    data: null,
                };
            } else {
                return {
                    status: e.status,
                    message: t("errors.something-went-wrong"),
                    data: null,
                };
            }
        }
        return { status: 500, message: t("errors.something-went-wrong"), data: null };
    }
};
