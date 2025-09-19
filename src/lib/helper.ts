import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale/ru";
import type { FormikProps } from "formik";
import type { ToastOptions } from "react-toastify";
import { toast as baseToast } from "react-toastify";

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
}: {
    date?: string | Date | null;
    formatStr?: string;
    locale?: string;
}) => {
    if (!date) return "";
    if (typeof date === "string") {
        date = parseISO(date);
    }
    return format(date, formatStr, { locale: ru });
};

export const formatDatetime = ({
    date,
    formatStr = "dd.MM.yyyy HH:mm",
}: {
    date?: string | Date | null;
    formatStr?: string;
    locale?: string;
}) => {
    if (!date) return "";
    if (typeof date === "string") {
        date = parseISO(date);
    }
    return format(date, formatStr, { locale: ru });
};

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
    errors: Record<string, string> | null,
    field: keyof T | string,
): boolean => {
    if (formik.errors[field as keyof T]) {
        return true;
    }

    return !!(errors && field in errors);

};

export function getError<T>(
    formik: FormikProps<T>,
    errors: Record<string, string> | null,
    field: keyof T | string,
): string | undefined {
    const formikError = formik.errors[field as keyof T];
    if (formikError) {
        return String(formikError);
    }

    if (errors && field in errors) {
        return errors[field as string];
    }

    return undefined;
}

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

export function getPrice({ amount, currency }: { amount: number; currency: string }): string {
    if (isNaN(amount)) return "";

    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}