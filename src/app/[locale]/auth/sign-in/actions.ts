"use server";

import { getTranslations } from "next-intl/server";

import { setAuthCookies } from "@/lib/auth/actions";
import { ApiError } from "@/openapi/client";
import getServerInstance from "@/openapi/server-instance";

interface IContactResponse {
    status: number;
    message?: string | null | undefined;
    errors: Record<string, string> | null;
    data: Record<string, string> | null;
}

export const authenticate = async (values: {
    username: string;
    password: string;
    parkno?: string;
}): Promise<IContactResponse> => {
    const t = await getTranslations();
    try {
        const fetchClient = await getServerInstance({
            cache: "no-cache",
            withAuth: false,
        });

        const response = await fetchClient.auth.postApiV1AuthLogin({
            credentials: {
                username: values.username,
                password: values.password,
                parkno: values.parkno,
            },
        });
        await setAuthCookies(
            {
                access_token: response.token,
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
                    message: t("login-invalid-password-or-username"),
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
        return { status: 500, message: "Something went wrong!", errors: null, data: null };
    }
};
