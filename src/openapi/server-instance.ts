"use server";

import { headers } from "next/headers";
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
    const headersList = await headers();

    const userAgent = headersList.get("user-agent") ?? "";
    const forwardedFor = headersList.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0].trim() ?? "";
    const forwardedHost = headersList.get("x-forwarded-host") ?? "";

    if (!BASE_URL) throw new Error("BASE_URL is not defined");

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
            "User-Agent": userAgent,
            "X-Forwarded-For": clientIp,
            "X-Forwarded-Host": forwardedHost,
        },
        NEXT: next,
        CACHE: cache,
    };
    if (token) {
        if (token) config["TOKEN"] = token;
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
    allow401 = true,
    allow404 = true,
    raiseExp = true,
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

    const isApiError = (err: unknown): err is ApiError =>
        typeof err === "object" &&
        err !== null &&
        "status" in err &&
        typeof (err as any).status === "number" &&
        "responseHeaders" in err &&
        typeof (err as any).responseHeaders?.get === "function";

    if (isApiError(error)) {
        const { status, responseHeaders } = error;

        if (status === 401 && allow401) {
            const wwwAuthenticate = responseHeaders.get("WWW-Authenticate");

            if (
                wwwAuthenticate === "Bearer signature_expired" &&
                "refreshToken" in instance.account &&
                typeof instance.account.refreshToken === "function"
            ) {
                try {
                    await instance.account.refreshToken();
                } catch {
                    redirect(AUTH_LOGOUT_URL, RedirectType.replace);
                }
            } else {
                redirect(AUTH_LOGOUT_URL, RedirectType.replace);
            }
        } else if (status === 404 && allow404) {
            notFound();
        } else {
            console.debug(`callRequest error:`, error);
            if (raiseExp) throw error;
        }
    } else if (error) {
        console.debug(`callRequest error:`, error);
        if (raiseExp) throw error;
    }

    return safeReturn;
}

export default getServerInstance;
