"use server";

import { notFound, redirect, RedirectType } from "next/navigation";

import { defaultLocale } from "@/config";
import { AUTH_LOGOUT_URL, AUTH_TOKEN_COOKIE, BASE_URL } from "@/lib/constants";
import { ApiError, FetchClient } from "@/openapi/client";

async function getServerInstance({
    next,
    token,
    cache,
    locale = defaultLocale,
}: {
    next?: NextFetchRequestConfig | undefined;
    token?: string;
    cache?: "default" | "force-cache" | "no-cache" | "no-store" | "only-if-cached" | "reload";
    locale?: string | undefined;
} = {}): Promise<FetchClient> {
    const config: {
        BASE: string | undefined;
        HEADERS: Record<string, string>;
        TOKEN?: string;
        NEXT?: NextFetchRequestConfig;

        CACHE?: "default" | "force-cache" | "no-cache" | "no-store" | "only-if-cached" | "reload";
    } = {
        BASE: BASE_URL,
        HEADERS: {
            "Accept-Language": locale,
        },
        NEXT: next,
        CACHE: cache,
    };
    if (token) {
        config["TOKEN"] = token;
    }
    return new FetchClient(config);
}

type ServiceKey = keyof FetchClient;
type ActionKey<T extends ServiceKey> = keyof FetchClient[T];
type ExtractAction<T> = T extends (...args: any) => any ? T : never;

type CallRequestParams<
    S extends ServiceKey,
    A extends ActionKey<S>,
    R = Awaited<ReturnType<ExtractAction<FetchClient[S][A]>>>, // default to actual return type
> = {
    instance: FetchClient;
    service: S;
    action: A;
    params?: Parameters<ExtractAction<FetchClient[S][A]>>[0];
    safeReturn: R;
    allow401?: boolean;
    allow404?: boolean;
    raiseExp?: boolean;
};

export async function callRequest<
    S extends ServiceKey,
    A extends ActionKey<S>,
    R = Awaited<ReturnType<ExtractAction<FetchClient[S][A]>>>,
>({
    instance,
    service,
    action,
    params,
    safeReturn,
    allow401 = false,
    allow404 = false,
    raiseExp = false,
}: CallRequestParams<S, A, R>): Promise<R> {
    let error = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 2;

    while (attempts < MAX_ATTEMPTS) {
        try {
            const serviceInstance = instance[service] as any; // Dynamic access to the service
            if (typeof serviceInstance[action] === "function") {
                return await serviceInstance[action](params);
            } else {
                throw new Error(
                    `Action '${String(action)}' is not a function on service '${String(service)}'`,
                );
            }
        } catch (e) {
            if (++attempts >= MAX_ATTEMPTS) {
                error = e;
            }
        }
    }
    if (error instanceof ApiError || (error && typeof error === "object" && "status" in error)) {
        if (error.status === 401) {
            if (allow401) {
                redirect(AUTH_LOGOUT_URL, RedirectType.replace);
            }
        } else if (error.status === 404) {
            if (allow404) {
                notFound();
            }
        } else {
            console.info(`callRequest error: ${error}`);
            if (raiseExp) {
                throw error; // Re-throw for other ApiError statuses
            }
        }
    } else if (error) {
        console.info(`callRequest error: ${error}`);
        if (raiseExp) {
            throw error; // Re-throw if it's not an ApiError
        }
    }

    return safeReturn;
}

export default getServerInstance;
