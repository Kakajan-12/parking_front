import React, { Fragment } from "react";

import type { Metadata } from "next";

import { cookies } from "next/headers";
import { notFound, redirect, RedirectType } from "next/navigation";

import { getTranslations, setRequestLocale } from "next-intl/server";

import PageHeading from "@/components/PageHeading";
import { Paper } from "@/components/ui/paper";
import { AUTH_LOGIN_URL, AUTH_TOKEN_COOKIE } from "@/lib/constants";
import { UserVisible } from "@/openapi/client";
import getServerInstance, { callRequest } from "@/openapi/server-instance";

import Content from "./content";
import Form from "./form";

type Props = {
    params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata(props: Omit<Props, "children">): Promise<Metadata> {
    const { locale } = await props.params;

    const t = await getTranslations({ locale });

    return {
        title: t("page-titles.user-detail"),
    };
}

const Page = async ({ params }: Props) => {
    const { locale, id } = await params;
    setRequestLocale(locale);
    const t = await getTranslations();

    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_COOKIE);
    if (!token) {
        redirect(AUTH_LOGIN_URL, RedirectType.replace);
    }

    const fetchClient = await getServerInstance({
        cache: "no-cache",
        token: token.value,
        locale: locale,
    });
    const data: UserVisible | null = await callRequest({
        instance: fetchClient,
        service: "account",
        action: "userDetail",
        params: { objId: id },
        safeReturn: null,
    });

    if (data === null) {
        notFound();
    }

    return (
        <Fragment>
            <PageHeading
                title={t("nav.user-detail")}
                breadcrumbs={[
                    { href: "/dashboard", label: t("nav.dashboard") },
                    {
                        href: "/users",
                        label: t("nav.users"),
                        current: true,
                    },
                ]}
            />
            <Paper className="space-y-8">
                <Content data={data} />
                <Form data={data} />
            </Paper>
        </Fragment>
    );
};

export default Page;
