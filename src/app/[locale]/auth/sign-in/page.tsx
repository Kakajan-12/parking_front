import { Metadata } from "next";

import { cookies } from "next/headers";

import { getTranslations, setRequestLocale } from "next-intl/server";

import { AUTH_TOKEN_COOKIE } from "@/lib/constants";

import Content from "./content";
import SignInForm from "./sign-in-form";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Omit<Props, "children">): Promise<Metadata> {
    const { locale } = await props.params;

    const t = await getTranslations({ locale });

    return {
        title: t("page-titles.login"),
    };
}

const Page = async ({ params }: Props) => {
    // Enable static rendering
    const { locale } = await params;
    setRequestLocale(locale);
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_COOKIE);
    if (token) {
        return <Content />;
    }

    return <SignInForm />;
};

export default Page;
