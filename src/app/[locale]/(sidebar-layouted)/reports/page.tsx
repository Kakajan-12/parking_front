import React, { Fragment, Suspense } from "react";

import { Metadata } from "next";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { getTranslations, setRequestLocale } from "next-intl/server";

import Loader from "@/components/Loader";
import PageHeading from "@/components/PageHeading";
import { Paper } from "@/components/ui/paper";
import Await from "@/lib/await";
import { AUTH_LOGIN_URL, AUTH_TOKEN_COOKIE } from "@/lib/constants";
import getServerInstance from "@/openapi/server-instance";

import Content from "./content";

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: Omit<Props, "children">): Promise<Metadata> {
    const { locale } = await props.params;

    const t = await getTranslations({ locale });

    return {
        title: t("page-titles.report"),
    };
}

const Page = async ({ params, searchParams }: Props) => {
    // Enable static rendering
    const { locale } = await params;

    setRequestLocale(locale);
    const t = await getTranslations();

    const { page, limit } = await searchParams;
    const safePage = typeof page === "string" ? Number(page) : 1;
    const safeLimit = typeof limit === "string" ? Number(limit) : 25;

    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_COOKIE);
    if (!token) {
        redirect(AUTH_LOGIN_URL, RedirectType.replace);
    }

    const fetchClient = await getServerInstance({
        cache: "no-cache",
        locale: locale,
        token: token.value,
    });
    const promise = fetchClient.account.operatorSessionList({
        page: safePage,
        limit: safeLimit,
    });
    return (
        <Fragment>
            <PageHeading
                title={t("nav.report")}
                breadcrumbs={[
                    { href: "/dashboard", label: t("nav.dashboard") },
                    {
                        href: "/reports",
                        label: t("nav.report"),
                        current: true,
                    },
                ]}
            />

            <Paper>
                <Suspense fallback={<Loader />}>
                    <Await promise={promise} allow401={true}>
                        {data => <Content rows={data.rows} page={safePage} limit={safeLimit} />}
                    </Await>
                </Suspense>
            </Paper>
        </Fragment>
    );
};

export default Page;
