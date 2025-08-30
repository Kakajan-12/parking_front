import React from "react";

import { LocalePrefix, Pathnames } from "next-intl/routing";

import { ENFlag, RUFlag, TMFlag } from "@/components/icons";
import { DEFAULT_LOCALE, WEBAPP_URL } from "@/lib/constants";

export const locales = ["ru", "tk"] as const;
export type Locale  = "tk" | "ru"; // "en" | "ru"

interface Language {
    value: Locale;
    label: string;
    flag: string;
    Icon: React.ComponentType<{ className?: string }>;
}

export const languages: Language[] = [
    { value: "tk", label: "Türkmen", flag: "/images/flags/tk.svg", Icon: TMFlag },
    { value: "ru", label: "Русский", flag: "/images/flags/ru.svg", Icon: RUFlag },
];

type LanguagesKeymapType = Record<
    string,
    {
        value: string;
        label: string;
        flag: string;
        Icon: React.ComponentType<{ className?: string }>;
    }
>;

export const languagesKeymap: LanguagesKeymapType = {
    ru: { value: "ru", label: "Русский", flag: "/images/flags/ru.svg" },
    tk: { value: "tk", label: "Türkmen", flag: "/images/flags/tk.svg", Icon: TMFlag },
};

export const defaultLocale = DEFAULT_LOCALE;

export const pathnames = {
    "/": "/",
} satisfies Pathnames<typeof locales>;

export const localePrefix: LocalePrefix<typeof locales> = "always";

export const port = process.env.PORT || 3000;
export const host = WEBAPP_URL;
