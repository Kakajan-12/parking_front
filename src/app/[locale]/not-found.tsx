"use client";

import React from "react";

import { useTranslations } from "next-intl";
import { MdOutlineErrorOutline } from "react-icons/md";

import Link from "@/components/Link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    const t = useTranslations("not-found-page");

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
            {/* Icon */}
            <div className="text-red-500 mb-6">
                <MdOutlineErrorOutline className="w-24 h-24 sm:w-32 sm:h-32" />
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-800 mb-4">404</h1>

            {/* Message */}
            <p className="text-lg sm:text-xl text-gray-600 mb-6 text-center max-w-md">
                {t("title")}
                <br />
                <span className="text-gray-500">{t("description")}</span>
            </p>

            {/* Action Button */}
            <Button asChild={true} variant="default" size="lg">
                <Link href="/">{t("back-to-home")}</Link>
            </Button>

            {/* Optional subtle background decoration */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-200 opacity-10 rounded-full -z-10" />
            <div className="absolute top-10 right-0 w-48 h-48 bg-blue-200 opacity-10 rounded-full -z-10" />
        </div>
    );
}
