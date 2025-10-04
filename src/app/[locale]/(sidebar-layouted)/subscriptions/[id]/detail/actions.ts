"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import { getTranslations } from "next-intl/server";

import { defaultLocale } from "@/config";
import { checkAuthCookies } from "@/lib/auth/actions";
import { AuthError } from "@/lib/auth/exceptions";
import { ApiError } from "@/openapi/client";
import type {
    ValidationError,
    CarSubscriptionVisible,
    CarSubscriptionBase,
} from "@/openapi/client";
import getServerInstance from "@/openapi/server-instance";

interface IResponse {
    status: number;
    message: string | null | undefined;
    errors: Array<ValidationError> | null;
    data?: CarSubscriptionVisible | null;
}

export const updateAction = async (
    objId: number,
    values: CarSubscriptionBase,
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
        const response = await fetchClient.carPark.carSubscriptionUpdate({
            objId: objId,
            requestBody: values,
        });
        result = { status: 200, message: response.message, data: response.data, errors: null };
    } catch (e: any) {
        if (e instanceof ApiError) {
            if (e.status === 422) {
                console.log(e.body?.detail);
                return {
                    status: e.status,
                    message: t("errors.provide-valid-data"),
                    errors: e.body?.detail ?? null,
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
        return { status: 500, errors: null, message: t("errors.something-went-wrong"), data: null };
    }
    revalidateTag("subscription-list");
    revalidateTag("subscription-detail");
    return result;
};
