import React, { Fragment } from "react";

import { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";

import PageHeading from "@/components/PageHeading";
import { Paper } from "@/components/ui/paper";

import Content from "./content";

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: Omit<Props, "children">): Promise<Metadata> {
    const { locale } = await props.params;

    const t = await getTranslations({ locale });

    return {
        title: t("page-titles.user-add"),
    };
}

const Page = async ({ params }: Props) => {
    // Enable static rendering
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations();

    return (
        <Fragment>
            <PageHeading
                title={t("nav.user-add")}
                breadcrumbs={[
                    { href: "/dashboard", label: t("nav.dashboard") },
                    {
                        href: "/users",
                        label: t("nav.users"),
                        current: false,
                    },
                    {
                        href: "/users/create",
                        label: t("nav.user-add"),
                        current: true,
                    },
                ]}
            />

            <Paper>
                <Content />
            </Paper>
        </Fragment>
    );
};

export default Page;
