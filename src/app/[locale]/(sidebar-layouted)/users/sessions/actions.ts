"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import { getTranslations } from "next-intl/server";

import { defaultLocale } from "@/config";
import { checkAuthCookies } from "@/lib/auth/actions";
import { AuthError } from "@/lib/auth/exceptions";
import { ApiError } from "@/openapi/client";
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
        const response = await fetchClient.users.getApiV1UserSessionRevoke({
            id: objId,
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
