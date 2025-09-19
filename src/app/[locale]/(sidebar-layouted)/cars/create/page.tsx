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
        title: t("page-titles.car-add"),
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
                title={t("nav.camera-add")}
                breadcrumbs={[
                    { href: "/dashboard", label: t("nav.dashboard") },
                    {
                        href: "/cars",
                        label: t("nav.cars"),
                        current: false,
                    },
                    {
                        href: "/cars/create",
                        label: t("nav.car-add"),
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
