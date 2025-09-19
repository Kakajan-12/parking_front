import { Metadata } from "next";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { getTranslations } from "next-intl/server";

import { AUTH_TOKEN_COOKIE, AUTH_LOGIN_URL } from "@/lib/constants";
import getServerInstance, { callRequest } from "@/openapi/server-instance";

import Content from "./content";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Omit<Props, "children">): Promise<Metadata> {
    const { locale } = await props.params;

    const t = await getTranslations({ locale });

    return {
        title: t("page-titles.logout"),
    };
}

const Page = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_COOKIE);
    if (!token) {
        redirect(AUTH_LOGIN_URL, RedirectType.replace);
    }

    const fetchClient = await getServerInstance({
        token: token.value,
        cache: "no-cache",
    });

    await callRequest({
        instance: fetchClient,
        service: "auth",
        action: "getApiV1AuthLogout",
        safeReturn: null,
        allow401: false,
        allow404: false,
        raiseExp: false,
    });
    return <Content />;
};

export default Page;
