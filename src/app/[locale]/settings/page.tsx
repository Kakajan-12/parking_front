import { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";

import Content from "./content";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Omit<Props, "children">): Promise<Metadata> {
    const { locale } = await props.params;

    const t = await getTranslations({ locale });

    return {
        title: t("page-titles.settings"),
    };
}

const Page = async ({ params }: Props) => {
    // Enable static rendering
    const { locale } = await params;

    setRequestLocale(locale);
    return <Content />;
};

export default Page;
