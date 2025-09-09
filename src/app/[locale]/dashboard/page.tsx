import { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";

import DefaultLayout from "@/components/layout";
import getServerInstance, { callRequest } from "@/openapi/server-instance";

import Content from "./content";
import { DashboardAPIDatatype, DashboardAPIReportDataType } from "./dashboard";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Omit<Props, "children">): Promise<Metadata> {
    const { locale } = await props.params;

    const t = await getTranslations({ locale });

    return {
        title: t("page-titles.dashboard"),
    };
}

const Page = async ({ params }: Props) => {
    // Enable static rendering
    const { locale } = await params;

    setRequestLocale(locale);
    const t = await getTranslations();
    const fetchClient = await getServerInstance({
        cache: "no-cache",
        withAuth: true,
        locale: locale,
    });

    fetchClient.usersCount.getApiV1UserCount();
    const data = await callRequest<"usersCount", "getApiV1UserCount", DashboardAPIDatatype>({
        instance: fetchClient,
        service: "usersCount",
        action: "getApiV1UserCount",
        raiseExp: true,
        allow401: true,
        allow404: true,
        safeReturn: {
            camera: 0,
            operator: 0,
            totalCars: 0,
            totalUsers: 4,
        },
    });
    const reportData = await callRequest<
        "accountant",
        "getApiV1AccountantOperators",
        DashboardAPIReportDataType
    >({
        instance: fetchClient,
        service: "accountant",
        action: "getApiV1AccountantOperators",
        safeReturn: {
            data: [],
        },
        raiseExp: true,
        allow401: true,
        allow404: true,
        params: {
            page: 1,
            limit: 100,
        },
    });

    return (
        <DefaultLayout title={t("page-titles.dashboard")}>
            <Content data={data} reportData={reportData} />
        </DefaultLayout>
    );
};

export default Page;
