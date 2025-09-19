import React from "react";

import { LocalePrefix, Pathnames } from "next-intl/routing";

import ENFlag from "@/components/ENFlag";
import RUFlag from "@/components/RUFlag";
import TMFlag from "@/components/TMFlag";
import { DEFAULT_LOCALE, WEBAPP_URL } from "@/lib/constants";
import { RoleType } from "@/openapi/client";

export const locales = ["en", "ru", "tk"] as const;
export type Locale = "en" | "tk" | "ru"; // "en" | "ru"

interface Language {
    value: Locale;
    label: string;
    flag: string;
    Icon: React.ComponentType<{ className?: string }>;
}

export const languages: Language[] = [
    { value: "tk", label: "Türkmen", flag: "/images/flags/tk.svg", Icon: TMFlag },
    { value: "en", label: "English", flag: "/images/flags/en.svg", Icon: ENFlag },
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
    en: { value: "en", label: "English", flag: "/images/flags/en.svg", Icon: ENFlag },
    ru: { value: "ru", label: "Русский", flag: "/images/flags/ru.svg", Icon: RUFlag },
    tk: { value: "tk", label: "Türkmen", flag: "/images/flags/tk.svg", Icon: TMFlag },
};

export const defaultLocale = DEFAULT_LOCALE;

export const pathnames = {
    "/": "/",
} satisfies Pathnames<typeof locales>;

export const localePrefix: LocalePrefix<typeof locales> = "always";

export const port = process.env.PORT || 3000;
export const host = WEBAPP_URL;


export const ROUTES_BY_ROLE = {
    [RoleType.AdminRole]: "/dashboard",
    [RoleType.OperatorRole]: "/video",
    [RoleType.AccountantRole]: "/report",
};