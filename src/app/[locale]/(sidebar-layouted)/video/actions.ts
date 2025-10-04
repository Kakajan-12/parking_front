"use server";

import { cookies } from "next/headers";

import { getTranslations } from "next-intl/server";

import { defaultLocale } from "@/config";
import { checkAuthCookies } from "@/lib/auth/actions";
import { AuthError } from "@/lib/auth/exceptions";
import { ApiError, CarSessionEventVisible, CarParkChoices } from "@/openapi/client";
import getServerInstance from "@/openapi/server-instance";

interface IResponse {
    status: number;
    message: string | null | undefined;
    data: {
        rows: Array<CarSessionEventVisible>;
    } | null;
}

export const fetchEvents = async ({
    page,
    limit,
    search,
    carPark,
}: {
    page: number;
    limit: number;
    search?: string;
    carPark?: CarParkChoices | null;
}): Promise<IResponse> => {
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
        cache: "no-cache",
    });
    try {
        const response = await fetchClient.carPark.cameraEventList({
            page: page,
            limit: limit,
            search: search,
            carPark: carPark,
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

interface IOpenBarrierResponse {
    status: number;
    message: string | null | undefined;
}

export const openBarrierAction = async (channelToken: string): Promise<IOpenBarrierResponse> => {
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
        cache: "no-cache",
    });

    try {
        const response = await fetchClient.camera.cameraOpenBarrier({
            channelToken: channelToken,
        });
        return { status: 200, message: response?.message };
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
        return { status: 500, message: t("errors.something-went-wrong")};
    }
};
