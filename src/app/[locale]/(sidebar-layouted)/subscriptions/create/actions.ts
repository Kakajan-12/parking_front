"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import { getTranslations } from "next-intl/server";

import { defaultLocale } from "@/config";
import { checkAuthCookies } from "@/lib/auth/actions";
import { AuthError } from "@/lib/auth/exceptions";
import { ApiError, CarVisible } from "@/openapi/client";
import type {
    CarSubscriptionCreate,
    CarSubscriptionVisible,
    ValidationError,
} from "@/openapi/client";
import getServerInstance from "@/openapi/server-instance";

interface IResponse {
    status: number;
    message: string | null | undefined;
    errors: ValidationError[] | null;
    data?: CarSubscriptionVisible | null;
}

export const createAction = async (values: CarSubscriptionCreate): Promise<IResponse> => {
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
        const response = await fetchClient.carPark.carSubscriptionCreate({
            requestBody: values,
        });
        result = { status: 201, message: response.message, data: response.data, errors: null };
    } catch (e: any) {
        if (e instanceof ApiError) {
            if (e.status === 422) {
                console.log(e.body?.errors);
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
    revalidateTag("user-list");
    return result;
};

interface IFetchCarsResponse {
    status: number;
    message: string | null | undefined;
    data: Array<CarVisible> | null;
}

export const fetchCars = async (values: {
    search?: string;
    page: number;
    limit: number;
    isStaff?: boolean;
}): Promise<IFetchCarsResponse> => {
    const t = await getTranslations();

    const [token, isAuth] = await checkAuthCookies();
    if (!isAuth) {
        throw new AuthError(t("auth.must-sign-in"));
    }

    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value ?? defaultLocale;

    try {
        const fetchClient = await getServerInstance({
            locale: locale,
            token: token,
        });
        const response = await fetchClient.carPark.carList({
            search: values.search,
            page: values.page,
            limit: values.limit,
            isStaff: values.isStaff,
        });
        return { status: 200, message: null, data: response.rows };
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
