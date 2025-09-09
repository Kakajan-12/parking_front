import { JSX, ReactNode } from "react";

import { redirect, RedirectType } from "next/navigation";

import clsx from "clsx";
import { getTranslations } from "next-intl/server";

import { AUTH_LOGOUT_URL } from "@/lib/constants";
import { ApiError } from "@/openapi/client";

export default async function Await<T>({
    promise,
    children,
    className = "",
    fallback,
}: {
    promise: Promise<T>;
    children: (value: T) => JSX.Element;
    className?: string;
    fallback?: () => ReactNode;
}) {
    const t = await getTranslations("errors");
    let error: ApiError | null = null;
    try {
        const data = await promise;
        return children(data);
    } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
            error = e;
        } else {
            if (fallback) return fallback();
            return (
                <div className={clsx("h-full w-full flex items-center justify-center", className)}>
                    <div>{t("something-went-wrong")}</div>
                </div>
            );
        }
    }
    if (error) {
        redirect(AUTH_LOGOUT_URL, RedirectType.replace);
    }
}
