import { format, parseISO, intervalToDuration } from "date-fns";
import type { Locale as DateFnsLocale } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { ru } from "date-fns/locale/ru";
import type { FormikProps } from "formik";
import type { ToastOptions } from "react-toastify";
import { toast as baseToast } from "react-toastify";
import type { Locale } from "use-intl/core";

import { defaultLocale } from "@/config";
import { tk } from "@/locale/tk";
import { ValidationError } from "@/openapi/client";

const localeMap: Record<Locale, DateFnsLocale> = {
    en: enUS,
    ru: ru,
    tk: tk,
};
type LocaleStrings = Record<"year" | "month" | "day" | "hour" | "minute" | "second", string>;

const DURATION_LOCALES: Record<string, LocaleStrings> = {
    ru: { year: "г", month: "мес", day: "дн", hour: "ч", minute: "м", second: "с" },
    tk: { year: "ýyl", month: "ay", day: "gün", hour: "sagat", minute: "min", second: "sek" },
    en: { year: "y", month: "mo", day: "d", hour: "h", minute: "m", second: "s" },
};

const toastOptions: ToastOptions = {
    // autoClose: 5000,
    position: "top-center",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    closeButton: true,
    pauseOnFocusLoss: false,
};

export const toastLoading = (message: string) => {
    return baseToast.loading(message, toastOptions);
};

export const toastUpdate = (
    toastId: number | string,
    message: string,
    toastType: "info" | "success" | "warning" | "error" | "default" = "success",
) => {
    baseToast.update(toastId, {
        render: message,
        type: toastType,
        isLoading: false,
        autoClose: 5000,
    });
};

export const toast = (
    message: string,
    toastType: "info" | "success" | "warning" | "error" | "default" = "success",
    options?: ToastOptions,
) => {
    baseToast(message, {
        type: toastType,
        autoClose: 5000,

        ...toastOptions,
        ...options,
    });
};

export const formatDate = ({
    date,
    formatStr = "PP",
    locale = defaultLocale,
}: {
    date?: string | Date | null;
    formatStr?: string;
    locale?: Locale;
}) => {
    if (!date) return "";
    if (typeof date === "string") {
        date = parseISO(date);
    }
    return format(date, formatStr, { locale: localeMap[locale] });
};

export const formatDatetime = ({
    date,
    locale = defaultLocale,
    formatStr = "dd.MM.yyyy HH:mm",
}: {
    date?: string | Date | null;
    formatStr?: string;
    locale?: Locale;
}) => {
    if (!date) return "";
    if (typeof date === "string") {
        date = parseISO(date);
    }
    return format(date, formatStr, { locale: localeMap[locale] });
};

export const formatDuration = ({
    start,
    end,
    locale = "ru",
}: {
    start?: string | Date | null;
    end?: string | Date | null;
    locale?: Locale;
}) => {
    if (!start || !end) return "";
    if (typeof start === "string") start = new Date(start);
    if (typeof end === "string") end = new Date(end);

    const duration = intervalToDuration({ start, end });
    const strings = DURATION_LOCALES[locale];

    const parts: string[] = [];
    if (duration.years) parts.push(`${duration.years} ${strings.year}`);
    if (duration.months) parts.push(`${duration.months} ${strings.month}`);
    if (duration.days) parts.push(`${duration.days} ${strings.day}`);
    if (duration.hours) parts.push(`${duration.hours} ${strings.hour}`);
    if (duration.minutes) parts.push(`${duration.minutes} ${strings.minute}`);
    if (duration.seconds) parts.push(`${duration.seconds} ${strings.second}`);

    return parts.join(" ") || `0 ${strings.minute}`;
};

export function formatVideoDuration(seconds: number) {
    const totalSeconds = Math.floor(seconds);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const format = (num: number) => String(num).padStart(2, "0");

    if (days > 0) {
        return `${days}:${format(hours)}:${format(minutes)}:${format(secs)}`;
    } else if (hours > 0) {
        return `${format(hours)}:${format(minutes)}:${format(secs)}`;
    } else {
        return `${format(minutes)}:${format(secs)}`;
    }
}

type ResolutionType = "DESKTOP" | "MOBILE";

export function getResolution(): ResolutionType {
    if (typeof window !== "undefined") {
        return window.innerWidth <= 768 ? "MOBILE" : "DESKTOP";
    } else return "DESKTOP";
}

export function getValueFromEnum<T extends string>(
    enumObj: Record<string, T>,
    value: string | number | undefined,
): T | undefined {
    if (value === undefined) {
        return undefined;
    }
    const keys = Object.keys(enumObj) as Array<keyof typeof enumObj>;
    const key = keys.find(k => enumObj[k] === value);
    return key ? enumObj[key] : undefined;
}

export const canSubmit = <T>(formik: FormikProps<T>) => {
    if (!(formik.isValid && formik.dirty)) return true;
    return formik.isSubmitting;
};

export const checkError = <T>(
    formik: FormikProps<T>,
    errors: ValidationError[] | Record<string, string> | null,
    field: keyof T | string,
): boolean => {
    if (formik.errors[field as keyof T]) return true;

    if (Array.isArray(errors)) {
        return errors.some(e => e.loc[1] === field);
    }

    if (errors && typeof errors === "object") {
        return Boolean(errors[field as string]);
    }

    return false;
};

export function getError<T>(
    formik: FormikProps<T>,
    errors: ValidationError[] | Record<string, string> | null,
    field: keyof T | string,
): string | undefined {
    const formikError = formik.errors[field as keyof T];
    if (formikError) {
        return String(formikError);
    }

    if (errors && Array.isArray(errors)) {
        const err = errors.find(e => e.loc[1] === field);
        return err?.msg;
    } else if (errors && typeof errors === "object") {
        const errMsg = errors[field as string];
        return errMsg ?? undefined;
    }

    return undefined;
}

export function getPrice({ amount, currency }: { amount: string | null | undefined; currency: string }): string {
    if (!amount) return "";

    return `${amount} ${currency}`;
    // return new Intl.NumberForm/*at("ru-RU", {
    //     style: "currency",
    //     currency,
    //     minimumFractionDigits: 2,
    //     maximumFractionDigits: 2,
    // }).format(amount);*/
}
