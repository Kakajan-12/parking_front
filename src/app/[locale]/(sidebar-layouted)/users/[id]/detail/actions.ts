"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import { getTranslations } from "next-intl/server";

import { defaultLocale } from "@/config";
import { checkAuthCookies } from "@/lib/auth/actions";
import { AuthError } from "@/lib/auth/exceptions";
import { ApiError } from "@/openapi/client";
import type { UserUpdateInput, UserResponse } from "@/openapi/client";
import getServerInstance from "@/openapi/server-instance";

interface IResponse {
    status: number;
    message: string | null | undefined;
    errors: Record<string, string> | null;
    data?: UserResponse | null;
}

export const userUpdateAction = async (
    objId: string,
    values: UserUpdateInput,
): Promise<IResponse> => {
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
        const response = await fetchClient.users.patchApiV1UserUpdate({
            id: objId,
            requestBody: values,
        });
        result = { status: 200, message: response.message, data: response.data, errors: null };
    } catch (e: any) {
        if (e instanceof ApiError) {
            if (e.status === 422) {
                console.log(e.body?.errors);
                return {
                    status: e.status,
                    message: e.body?.detail || t("errors.provide-valid-data"),
                    errors: e.body?.errors ?? null,
                    data: null,
                };
            } else {
                return {
                    status: e.status,
                    message: t("errors.something-went-wrong"),
                    errors: null,
                    data: null,
                };
            }
        }
        return { status: 500, errors: null, message: "Something went wrong!", data: null };
    }
    revalidateTag("user-list");
    revalidateTag("user-detail");
    return result;
};
