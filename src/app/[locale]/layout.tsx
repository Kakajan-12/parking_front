import { ReactNode } from "react";

import type { Metadata } from "next";

import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { locales } from "@/config";
import AppProviders from "@/lib/app-providers";

import "@/app/globals.css";

// const geistSans = Geist({
//     variable: "--font-geist-sans",
//     subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//     variable: "--font-geist-mono",
//     subsets: ["latin"],
// });

type Props = {
    children: ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return locales.map(locale => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: {
            template: "%s | ASB parking system",
            default: "ASB parking system", // Fallback title
        },
        description: "A description for my site.",
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();
    return (
        <html lang="tk">
            <body className="antialiased">
                <NextIntlClientProvider messages={messages}>
                    <AppProviders>
                        <div className="h-full w-full flex flex-col bg-primary">{children}</div>
                    </AppProviders>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
