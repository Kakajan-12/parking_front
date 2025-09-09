import { Metadata } from "next";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { getTranslations, setRequestLocale } from "next-intl/server";

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

const Page = async ({ params }: Props) => {
    const { locale } = await params;

    setRequestLocale(locale);
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_COOKIE);
    if (!token) {
        redirect(AUTH_LOGIN_URL, RedirectType.replace);
    }

    const fetchClient = await getServerInstance({ withAuth: true, cache: "no-cache" });

    await callRequest({
        instance: fetchClient,
        service: "auth",
        action: "postApiV1AuthLogout",
        safeReturn: null,
        raiseExp: false,
    });
    return <Content />;
};

export default Page;
