"use server";

import { cookies } from "next/headers";

import { getTranslations } from "next-intl/server";

import { defaultLocale } from "@/config";
import { setAuthCookies } from "@/lib/auth/actions";
import { ApiError, CarParkChoices,  Token} from "@/openapi/client";
import getServerInstance from "@/openapi/server-instance";

interface IContactResponse {
    status: number;
    message?: string | null | undefined;
    errors: Record<string, string> | null;
    data: Token | null;
}

export const authenticate = async (values: {
    carPark: CarParkChoices | undefined;
    password: string;
    username: string;
    remember: boolean;
}): Promise<IContactResponse> => {
    const t = await getTranslations();

    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value ?? defaultLocale;
    try {
        const fetchClient = await getServerInstance({
            cache: "no-cache",
            locale: locale,
        });

        const response = await fetchClient.account.getToken({
            formData: {
                username: values.username,
                password: values.password,
            },
            carPark: values.carPark,
        });
        await setAuthCookies(
            {
                access_token: response.access_token,
            },
            true,
        );
        return {
            status: 200,
            errors: null,
            data: response,
        };
    } catch (e: any) {
        if (e instanceof ApiError) {
            if (e.status === 401) {
                return {
                    status: e.status,
                    message: t("errors.login-invalid-password-or-username"),
                    errors: e.body?.errors ?? null,
                    data: null,
                };
            } else if (e.status === 422) {
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
        return { status: 500, message: t("errors.something-went-wrong"), errors: null, data: null };
    }
};
